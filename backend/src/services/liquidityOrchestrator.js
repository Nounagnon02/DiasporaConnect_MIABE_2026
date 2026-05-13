/**
 * Liquidity Orchestrator — flux simplifié
 *
 * SmartContract.TransferCreated
 *   → cinetPayService.sendTransfer()  (conversion cUSD→FCFA + virement Momo en un appel)
 *     → webhook CinetPay : virement confirmé
 *       → release() on-chain
 *         → notifier destinataire
 */
import { ethers } from 'ethers';
import * as cp from './cinetPayService.js';
import { createTransfer, getTransfer, updateTransfer, logEvent } from '../db/transfers.js';

const TIMEOUT_30MIN = 30 * 60 * 1000;
const MAX_RETRIES   = 3;

// ── Provider + contrat ────────────────────────────────────────────────────────

const ABI = [
  'function release(bytes32 _transferId, address _nodeAddress) external',
  'function refund(bytes32 _transferId) external',
  'event TransferCreated(bytes32 indexed transferId, address indexed sender, string recipientPhone, string operator, uint256 amount)',
];

const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer   = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY, provider);
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, signer);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const withRetry = async (fn, transferId, label) => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      logEvent(transferId, label, 'retry', { attempt, error: err.message });
      if (attempt === MAX_RETRIES) throw err;
      await sleep(2 ** attempt * 1000); // 2s → 4s → 8s
    }
  }
};

// ── ÉTAPE 1 : Enregistrer le transfert depuis l'événement blockchain ──────────

export const onTransferCreated = async ({ transferId, sender, recipientPhone, operator, amount, txHash }) => {
  const amountCUSD  = parseFloat(ethers.formatEther(amount));
  // CinetPay travaille en FCFA entiers
  const amountFCFA  = Math.round(amountCUSD * parseFloat(process.env.EXCHANGE_RATE || '612.5'));

  if (getTransfer(transferId)) {
    console.log(`[Orchestrator] ${transferId} déjà enregistré — ignoré`);
    return;
  }

  createTransfer({
    transfer_id:     transferId,
    sender_address:  sender,
    recipient_phone: recipientPhone,
    operator,
    amount_cusd:     amountCUSD.toString(),
    amount_fcfa:     amountFCFA,
    tx_hash:         txHash,
  });

  logEvent(transferId, 'blockchain', 'TransferCreated', { sender, recipientPhone, operator, amountCUSD, amountFCFA });
  console.log(`[Orchestrator] 🔔 Nouveau transfert : ${amountCUSD} cUSD → ${amountFCFA} FCFA → ${recipientPhone} (${operator})`);

  // Timeout global 30 min → remboursement automatique
  setTimeout(() => triggerTimeout(transferId), TIMEOUT_30MIN);

  await sendMomo(transferId);
};

// ── ÉTAPE 2 : Vérifier le float et envoyer via CinetPay ──────────────────────

const sendMomo = async (transferId) => {
  const transfer = getTransfer(transferId);
  updateTransfer(transferId, { status: 'sending' });

  // Vérifier le float avant d'envoyer
  try {
    const { balanceFCFA } = await cp.getFloatBalance();
    const threshold = parseInt(process.env.FLOAT_ALERT_THRESHOLD_FCFA || '500000');

    if (balanceFCFA < threshold) {
      console.warn(`[Orchestrator] ⚠️  Float bas : ${balanceFCFA} FCFA (seuil : ${threshold})`);
      logEvent(transferId, 'system', 'float_alert', { balanceFCFA, threshold });
    }

    if (balanceFCFA < transfer.amount_fcfa) {
      updateTransfer(transferId, { status: 'failed', error_message: 'Float insuffisant' });
      console.error(`[Orchestrator] ❌ Float insuffisant pour ${transferId}`);
      return;
    }
  } catch (err) {
    // Float check non bloquant — on continue
    console.warn(`[Orchestrator] Float check échoué (non bloquant) : ${err.message}`);
  }

  try {
    const result = await withRetry(
      () => cp.sendTransfer({
        phoneNumber:   transfer.recipient_phone,
        operator:      transfer.operator,
        amountFCFA:    transfer.amount_fcfa,
        transferId,
        recipientName: 'Destinataire',
      }),
      transferId, 'CinetPay'
    );

    updateTransfer(transferId, { cp_transfer_id: result.cinetPayId });
    logEvent(transferId, 'CinetPay', 'transfer_initiated', result);
    console.log(`[Orchestrator] 📤 Virement CinetPay initié : ${result.cinetPayId}`);

    // Sandbox sans webhook → simuler confirmation
    if (result.cinetPayId.startsWith('cp_mock_')) {
      await sleep(2000);
      await onCinetPayWebhook({ cinetPayId: result.cinetPayId, status: 'completed', transferId });
    }
  } catch (err) {
    updateTransfer(transferId, { status: 'failed', error_message: `CP: ${err.message}` });
    logEvent(transferId, 'CinetPay', 'transfer_failed', { error: err.message });
    console.error(`[Orchestrator] ❌ CinetPay échoué pour ${transferId} — remboursement déclenché`);
    await triggerRefund(transferId);
  }
};

// ── ÉTAPE 3 : Webhook CinetPay — virement Momo confirmé ──────────────────────

export const onCinetPayWebhook = async ({ cinetPayId, status, transferId: tid }) => {
  const transfer = tid ? getTransfer(tid) : null;
  if (!transfer) {
    console.warn(`[Orchestrator] Webhook CP : transferId inconnu pour ${cinetPayId}`);
    return;
  }

  logEvent(transfer.transfer_id, 'CinetPay', `webhook_${status}`, { cinetPayId });

  if (status !== 'completed') {
    updateTransfer(transfer.transfer_id, { status: 'failed', error_message: `CP: ${status}` });
    console.error(`[Orchestrator] ❌ Virement CinetPay échoué (${status}) — remboursement`);
    await triggerRefund(transfer.transfer_id);
    return;
  }

  console.log(`[Orchestrator] ✅ Virement Momo confirmé pour ${transfer.transfer_id}`);
  await releaseOnChain(transfer.transfer_id);
};

// ── ÉTAPE 4 : release() on-chain ─────────────────────────────────────────────

const releaseOnChain = async (transferId) => {
  try {
    const contract = getContract();
    const tx = await contract.release(transferId, process.env.OPERATOR_ADDRESS);
    await tx.wait();

    updateTransfer(transferId, { status: 'completed' });
    logEvent(transferId, 'blockchain', 'released', { txHash: tx.hash });
    console.log(`[Orchestrator] 🎉 Transfert ${transferId} complété — txHash : ${tx.hash}`);
  } catch (err) {
    logEvent(transferId, 'blockchain', 'release_failed', { error: err.message });
    console.error(`[Orchestrator] ❌ release() échoué pour ${transferId} :`, err.message);
  }
};

// ── Timeout 30 min → remboursement automatique ────────────────────────────────

const triggerTimeout = async (transferId) => {
  const transfer = getTransfer(transferId);
  if (!transfer || ['completed', 'refunded'].includes(transfer.status)) return;
  console.warn(`[Orchestrator] ⏰ Timeout 30 min — remboursement de ${transferId}`);
  logEvent(transferId, 'system', 'timeout_triggered');
  await triggerRefund(transferId);
};

// ── Remboursement via smart contract ─────────────────────────────────────────

export const triggerRefund = async (transferId) => {
  try {
    const contract = getContract();
    const tx = await contract.refund(transferId);
    await tx.wait();

    updateTransfer(transferId, { status: 'refunded' });
    logEvent(transferId, 'blockchain', 'refunded', { txHash: tx.hash });
    console.log(`[Orchestrator] 🔄 Remboursement confirmé — ${transferId} : ${tx.hash}`);
  } catch (err) {
    logEvent(transferId, 'blockchain', 'refund_failed', { error: err.message });
    console.error(`[Orchestrator] ❌ refund() échoué pour ${transferId} :`, err.message);
  }
};
