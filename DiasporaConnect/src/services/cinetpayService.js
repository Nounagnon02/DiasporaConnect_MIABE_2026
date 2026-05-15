/**
 * CinetPay Service — Mode MOCK (Hackathon)
 * CINETPAY_SANDBOX=mock → 100% local, aucune clé requise.
 *
 * Simule fidèlement :
 *  - sendMobileMoneyPayout  → payout XOF vers Mobile Money
 *  - checkPayoutStatus      → statut PENDING → SUCCESS
 *  - webhookPayload         → payload webhook CinetPay réel
 */

const CUSD_TO_XOF = 612.5;

// Stockage en mémoire des payouts mock (reset à chaque restart)
const _mockStore = new Map();

// ─── Payout ───────────────────────────────────────────────────────────────────

/**
 * @param {object} p
 * @param {string} p.phone          - ex: "22961000000"
 * @param {string} p.operator       - "MTN" | "MOOV" | "ORANGE" | "WAVE"
 * @param {number} p.amountCUSD     - montant en cUSD
 * @param {string} p.txRef          - référence unique
 * @param {string} [p.recipientName]
 * @returns {Promise<{success, payoutId, amountXOF, operator, mock}>}
 */
export const sendMobileMoneyPayout = async ({
  phone,
  operator,
  amountCUSD,
  txRef,
  recipientName = 'Bénéficiaire',
}) => {
  await _delay(1200); // simule latence réseau CinetPay

  const amountXOF = Math.round(amountCUSD * CUSD_TO_XOF);

  _mockStore.set(txRef, {
    status: 'PENDING',
    phone,
    operator,
    amountXOF,
    recipientName,
    createdAt: Date.now(),
  });

  // Simule la confirmation asynchrone après 3s (comme un vrai webhook)
  setTimeout(() => {
    const entry = _mockStore.get(txRef);
    if (entry) _mockStore.set(txRef, { ...entry, status: 'SUCCESS' });
  }, 3000);

  return { success: true, payoutId: txRef, amountXOF, operator, mock: true };
};

// ─── Statut ───────────────────────────────────────────────────────────────────

/**
 * Statuts possibles : "PENDING" | "SUCCESS" | "FAILED"
 */
export const checkPayoutStatus = async (txRef) => {
  await _delay(300);

  const entry = _mockStore.get(txRef);
  if (!entry) return { status: 'PENDING', txRef };

  return {
    status: entry.status,
    txRef,
    amountXOF: entry.amountXOF,
    operator: entry.operator,
    mock: true,
  };
};

// ─── Webhook payload (pour tester la réception côté backend) ─────────────────

/**
 * Génère un payload identique à ce que CinetPay envoie en production.
 * Utile pour tester le handler webhook sans serveur CinetPay.
 */
export const generateMockWebhookPayload = (txRef) => {
  const entry = _mockStore.get(txRef) || {};
  return {
    cpm_trans_id: txRef,
    cpm_site_id: 'MOCK_SITE_ID',
    cpm_trans_date: new Date().toISOString(),
    cpm_amount: String(entry.amountXOF || 0),
    cpm_currency: 'XOF',
    cpm_payid: `PAY-${Date.now()}`,
    cpm_payment_config: 'SINGLE',
    cpm_page_action: 'PAYMENT',
    cpm_version: 'V1',
    cpm_payment_date: new Date().toISOString(),
    cpm_error_message: '',
    cpm_result: '00',       // "00" = succès chez CinetPay
    cpm_trans_status: 'ACCEPTED',
    cpm_designation: `DiasporaConnect - ${entry.recipientName || ''}`,
    cpm_custom: JSON.stringify({ operator: entry.operator, phone: entry.phone }),
  };
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const _delay = (ms) => new Promise((r) => setTimeout(r, ms));
