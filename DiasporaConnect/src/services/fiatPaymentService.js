/**
 * Fiat Payment Service — Mode MOCK (Hackathon)
 * Scénario 1 : Carte Visa/MC → cUSD → XOF → Mobile Money
 *
 * Simule toutes les étapes du flow sans backend ni Stripe réel.
 */

const EUR_TO_XOF = 655.957;
const USD_TO_XOF = 612.5;
const FEE_RATE = 0.008; // 0.8%

// Stockage en mémoire des transferts fiat mock
const _transferStore = new Map();

// ─── Étapes du flow (pour affichage progression UI) ──────────────────────────

export const TRANSFER_STEPS = [
  { key: 'CARD_CHARGED',          label: 'Carte débitée' },
  { key: 'CUSD_PURCHASED',        label: 'cUSD acheté sur Celo' },
  { key: 'BLOCKCHAIN_CONFIRMED',  label: 'Transaction blockchain confirmée' },
  { key: 'PAYOUT_SENT',           label: 'Virement Mobile Money envoyé' },
  { key: 'COMPLETED',             label: 'Fonds reçus par le bénéficiaire' },
];

// ─── Initier un transfert fiat ────────────────────────────────────────────────

/**
 * @param {object} p
 * @param {number} p.amount           - Montant (EUR ou USD)
 * @param {string} p.currency         - "EUR" | "USD"
 * @param {string} p.recipientPhone   - Numéro Mobile Money bénéficiaire
 * @param {string} p.operator         - "MTN" | "MOOV" | "ORANGE" | "WAVE"
 * @param {Function} [p.onStep]       - Callback appelé à chaque étape : onStep(stepKey)
 * @returns {Promise<{success, txRef, amountXOF, amountCUSD, fee, txHash}>}
 */
export const initiateFiatTransfer = async ({
  amount,
  currency = 'EUR',
  recipientPhone,
  operator,
  onStep,
}) => {
  const rate = currency === 'EUR' ? EUR_TO_XOF : USD_TO_XOF;
  const fee = parseFloat((amount * FEE_RATE).toFixed(2));
  const netAmount = amount - fee;
  const amountXOF = Math.round(netAmount * rate);
  const amountCUSD = parseFloat((netAmount * (currency === 'EUR' ? 1.08 : 1)).toFixed(2));
  const txRef = `DC-${Date.now()}`;
  const txHash = '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  _transferStore.set(txRef, {
    status: 'CARD_CHARGED',
    amount, currency, fee, amountXOF, amountCUSD, txHash,
    recipientPhone, operator,
    createdAt: Date.now(),
  });

  // Simule la progression des étapes
  const steps = ['CARD_CHARGED', 'CUSD_PURCHASED', 'BLOCKCHAIN_CONFIRMED', 'PAYOUT_SENT', 'COMPLETED'];
  const delays = [0, 800, 1500, 1000, 1200];

  for (let i = 0; i < steps.length; i++) {
    await _delay(delays[i]);
    _transferStore.set(txRef, { ..._transferStore.get(txRef), status: steps[i] });
    onStep?.(steps[i]);
  }

  return { success: true, txRef, amountXOF, amountCUSD, fee, txHash, mock: true };
};

// ─── Statut d'un transfert ────────────────────────────────────────────────────

export const checkFiatTransferStatus = async (txRef) => {
  const entry = _transferStore.get(txRef);
  if (!entry) return { status: 'NOT_FOUND', txRef };
  return { ...entry, txRef };
};

// ─── Calcul des frais (pour affichage avant confirmation) ─────────────────────

export const calculateFiatFees = (amount, currency = 'EUR') => {
  const rate = currency === 'EUR' ? EUR_TO_XOF : USD_TO_XOF;
  const fee = parseFloat((amount * FEE_RATE).toFixed(2));
  const netAmount = amount - fee;
  return {
    fee,
    feePercent: FEE_RATE * 100,
    amountXOF: Math.round(netAmount * rate),
    rate,
  };
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const _delay = (ms) => new Promise((r) => setTimeout(r, ms));
