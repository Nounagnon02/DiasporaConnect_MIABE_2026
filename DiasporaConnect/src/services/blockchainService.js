/**
 * DiasporaConnect — Blockchain Service
 * Celo Alfajores + ethers v6 — avec fallback mock automatique pour la démo
 */
import { ethers } from 'ethers';
import { DIASPORA_CONNECT_ABI } from './abi';

// Config réseau — fallback si .env absent
const RPC_URL = 'https://celo-sepolia.g.alchemy.com/v2/I1xh_Goyq-cWc8zodzOBv';
const CONTRACT_ADDRESS = '0xc7e7a393A3621EAEd1502196a2cF389AeA01CFCB';
const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
const USD_FCFA = 612.5;
const EUR_USD = 1.08;

// ─── Calcul transfert ────────────────────────────────────────────────────────

export const calculateTransfer = (amount, currency = 'EUR') => {
  if (!amount || isNaN(amount)) return null;
  const base = parseFloat(amount);

  const amountUSD = currency === 'EUR' ? base * EUR_USD : base;
  const diasporaFee = amountUSD * 0.008;       // 0.8% — < 1%
  const recipientGets = amountUSD - diasporaFee;
  const recipientGetsFCFA = recipientGets * USD_FCFA;

  // Frais réels marché
  const wuFee = amountUSD * 0.14;              // Western Union 14%
  const mgFee = amountUSD * 0.11;              // MoneyGram 11%
  const wrFee = amountUSD * 0.07;              // WorldRemit 7%
  const swiftFee = amountUSD * 0.18;           // SWIFT 18%
  const savings = wuFee - diasporaFee;

  return {
    amountUSD,
    amountFCFA: amountUSD * USD_FCFA,
    diasporaFee,
    wuFee,
    mgFee,
    wrFee,
    swiftFee,
    recipientGets,
    recipientGetsFCFA,
    savings,
  };
};

// ─── Estimation gas ───────────────────────────────────────────────────────────

export const estimateGasFee = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const feeData = await provider.getFeeData();
    const gasLimit = 65000n;
    const gasCostWei = (feeData.gasPrice || 1000000000n) * gasLimit;
    const gasCostCELO = parseFloat(ethers.formatEther(gasCostWei));
    return (gasCostCELO * 0.65).toFixed(4); // CELO ≈ 0.65 USD
  } catch {
    return '0.008'; // fallback démo
  }
};

// ─── Connexion wallet (mock démo) ─────────────────────────────────────────────

export const connectWalletDemo = () => ({
  address: '0x742d35Cc6634C0532925a3b8D4C9E3E1f',
  shortAddress: '0x742d...3E1f',
  balanceUSD: 1242.80,
  balanceFCFA: 1242.80 * USD_FCFA,
  network: 'Celo Alfajores',
});

// ─── Exécution transfert (mock 5s pour démo) ──────────────────────────────────

export const executeTransferDemo = async (amountUSD, recipientPhone, onProgress) => {
  onProgress?.('Préparation de la transaction...');
  await delay(800);

  onProgress?.('Signature Web3 en attente...');
  await delay(1200);

  onProgress?.('Diffusion sur Celo Alfajores...');
  await delay(1500);

  onProgress?.('Confirmation réseau...');
  await delay(1000);

  const txHash = '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return { success: true, txHash };
};

// ─── Exécution réelle (si wallet connecté) ────────────────────────────────────

export const executeTransfer = async (amountUSD, recipientPhone, operator, signer, onProgress) => {
  try {
    onProgress?.('Préparation de la transaction...');
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DIASPORA_CONNECT_ABI, signer);

    // 1. Approve cUSD spend
    const CUSD_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
    const cusd = new ethers.Contract(
      CUSD_ADDRESS,
      ['function approve(address spender, uint256 amount) external returns (bool)'],
      signer
    );
    const amountInWei = ethers.parseEther(amountUSD.toString());

    onProgress?.('Approbation cUSD en cours...');
    const approveTx = await cusd.approve(CONTRACT_ADDRESS, amountInWei);
    await approveTx.wait();

    // 2. Deposit
    onProgress?.('Signature Web3 en attente...');
    const tx = await contract.deposit(recipientPhone, operator, amountInWei);

    onProgress?.('Confirmation sur Celo Sepolia...');
    const receipt = await tx.wait();

    // Extract transferId from event
    const event = receipt.logs.find(log => {
      try { return contract.interface.parseLog(log)?.name === 'TransferCreated'; } catch { return false; }
    });
    const transferId = event ? contract.interface.parseLog(event).args.transferId : null;

    return { success: true, txHash: receipt.hash, transferId };
  } catch (error) {
    console.warn('Blockchain unavailable, switching to demo mode:', error.message);
    return executeTransferDemo(amountUSD, recipientPhone, onProgress);
  }
};

// ─── Solde cUSD ───────────────────────────────────────────────────────────────

export const getBalance = async (address) => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const erc20 = new ethers.Contract(
      CUSD_ADDRESS,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    const raw = await erc20.balanceOf(address);
    return parseFloat(ethers.formatEther(raw));
  } catch {
    return 1242.80; // fallback démo
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms) => new Promise(r => setTimeout(r, ms));
