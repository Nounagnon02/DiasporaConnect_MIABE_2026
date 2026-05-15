/**
 * Transfer Orchestrator — Point d'entrée unique pour les deux scénarios
 *
 * Scénario 1 (non-crypto) : initiateFiatTransfer  → fiatPaymentService
 * Scénario 2 (crypto)     : initiateCryptoTransfer → blockchainService + cinetpayService
 */

import { initiateFiatTransfer, checkFiatTransferStatus, calculateFiatFees } from './fiatPaymentService';
import { sendMobileMoneyPayout, checkPayoutStatus } from './cinetpayService';
import { executeTransfer, executeTransferDemo, calculateTransfer } from './blockchainService';

export { calculateFiatFees };

// ─── Scénario 1 — Carte bancaire ──────────────────────────────────────────────

/**
 * @param {object} p
 * @param {number} p.amount
 * @param {string} p.currency         "EUR" | "USD"
 * @param {string} p.recipientPhone
 * @param {string} p.operator         "MTN" | "MOOV" | "ORANGE" | "WAVE"
 * @param {Function} [p.onStep]       callback(stepKey) à chaque étape
 */
export const sendViaCard = (p) => initiateFiatTransfer(p);

export const getFiatTransferStatus = (txRef) => checkFiatTransferStatus(txRef);

// ─── Scénario 2 — Wallet crypto ───────────────────────────────────────────────

/**
 * @param {object} p
 * @param {number} p.amountCUSD
 * @param {string} p.recipientPhone
 * @param {string} p.operator
 * @param {object} [p.signer]         signer ethers.js (null = mode démo)
 * @param {Function} [p.onProgress]   callback(message)
 */
export const sendViaCrypto = async ({
  amountCUSD,
  recipientPhone,
  operator,
  signer = null,
  onProgress,
}) => {
  // 1. Dépôt sur le smart contract
  const blockchainResult = signer
    ? await executeTransfer(amountCUSD, recipientPhone, operator, signer, onProgress)
    : await executeTransferDemo(amountCUSD, recipientPhone, onProgress);

  if (!blockchainResult.success) {
    return { success: false, error: 'Blockchain deposit failed' };
  }

  onProgress?.('Conversion cUSD → XOF en cours...');

  // 2. Payout Mobile Money via CinetPay (mock)
  const txRef = `DC-CRYPTO-${Date.now()}`;
  const payoutResult = await sendMobileMoneyPayout({
    phone: recipientPhone,
    operator,
    amountCUSD,
    txRef,
  });

  return {
    success: payoutResult.success,
    txRef,
    txHash: blockchainResult.txHash,
    amountXOF: payoutResult.amountXOF,
    mock: true,
  };
};

export const getCryptoPayoutStatus = (txRef) => checkPayoutStatus(txRef);

// ─── Calcul frais unifié ──────────────────────────────────────────────────────

/**
 * Retourne les frais pour les deux scénarios afin d'afficher la comparaison UI.
 */
export const getFeesComparison = (amount, currency = 'EUR') => {
  const fiat = calculateFiatFees(amount, currency);
  const crypto = calculateTransfer(amount, currency);
  return { fiat, crypto };
};
