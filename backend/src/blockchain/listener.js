/**
 * Blockchain Listener — écoute les événements TransferCreated sur Celo Sepolia
 * et déclenche l'orchestrateur pour chaque nouveau transfert
 */
import { ethers } from 'ethers';
import { onTransferCreated } from '../services/liquidityOrchestrator.js';

const ABI = [
  'event TransferCreated(bytes32 indexed transferId, address indexed sender, string recipientPhone, string operator, uint256 amount)',
];

let provider;
let contract;

export const startBlockchainListener = () => {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, provider);

  contract.on('TransferCreated', async (transferId, sender, recipientPhone, operator, amount, event) => {
    console.log(`[Listener] 🔔 TransferCreated détecté — txHash : ${event.log.transactionHash}`);
    try {
      await onTransferCreated({
        transferId,
        sender,
        recipientPhone,
        operator,
        amount,
        txHash: event.log.transactionHash,
      });
    } catch (err) {
      console.error('[Listener] Erreur dans onTransferCreated :', err.message);
    }
  });

  // Reconnexion automatique si le provider se déconnecte
  provider.on('error', (err) => {
    console.error('[Listener] Provider error :', err.message);
    setTimeout(startBlockchainListener, 5000);
  });

  console.log(`[Listener] ✅ Écoute des événements sur ${process.env.CONTRACT_ADDRESS}`);
};
