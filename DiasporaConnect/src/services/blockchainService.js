/**
 * DiasporaConnect Blockchain Service (Celo Alfajores + ethers v6)
 * Private Ledger implementation logic
 */
import { ethers } from 'ethers';
import { RPC_URL, CONTRACT_ADDRESS, EXCHANGE_RATE as ENV_RATE } from '@env';
import { DIASPORA_CONNECT_ABI } from './abi';

const EXCHANGE_RATE = parseFloat(ENV_RATE) || 612.5;

export const calculateTransfer = (amount, currency = 'EUR') => {
  if (!amount || isNaN(amount)) return null;
  const base = parseFloat(amount);
  
  // Real logic: fetch conversion
  let amountUSD = currency === 'EUR' ? base * 1.08 : base;
  
  // Fees (Private Ledger < 1%)
  const diasporaFee = amountUSD * 0.008; // 0.8%
  const recipientGets = amountUSD - diasporaFee;
  const recipientGetsFCFA = recipientGets * EXCHANGE_RATE;

  // Comparison
  const wuFee = amountUSD * 0.08; // 8% avg
  const mgFee = amountUSD * 0.06; // 6% avg
  const savings = wuFee - diasporaFee;

  return {
    amountUSD,
    amountFCFA: amountUSD * EXCHANGE_RATE,
    diasporaFee,
    wuFee,
    mgFee,
    recipientGets,
    recipientGetsFCFA,
    savings
  };
};

/**
 * Execute real transfer on Celo
 * @param {ethers.Signer} signer - The signer from WalletConnect
 */
export const executeTransfer = async (amountUSD, recipientPhone, operator, signer, onProgress) => {
  try {
    onProgress('Préparation de la transaction...');
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DIASPORA_CONNECT_ABI, signer);
    
    // Convert USD to CELO/cUSD or directly to native CELO for the demo if contract handles CELO
    // For this demo, let's assume the contract handles CELO (native)
    // In production, we would use a price oracle or a stablecoin like cUSD
    const amountInWei = ethers.parseEther((amountUSD / 1.0).toString()); // Mocking 1 CELO = 1 USD for demo simplicity
    
    onProgress('Signature Web3 en attente...');
    
    const tx = await contract.deposit(recipientPhone, { value: amountInWei });
    
    onProgress('Confirmation sur Celo Alfajores...');
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error('Transfer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
