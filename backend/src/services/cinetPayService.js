/**
 * CinetPay Service — virement FCFA vers MTN/Moov Bénin
 * Sandbox : https://client.cinetpay.com/v1/
 * Docs    : https://docs.cinetpay.com
 */

const BASE_URL = 'https://client.cinetpay.com/v1';
const API_KEY  = process.env.CINETPAY_API_KEY;
const SITE_ID  = process.env.CINETPAY_SITE_ID;
const TIMEOUT_MS = 10_000;

// ── Auth : token CinetPay (valable 20 min) ────────────────────────────────────

let _token = null;
let _tokenExpiry = 0;

const getToken = async () => {
  if (_token && Date.now() < _tokenExpiry) return _token;

  if (!API_KEY || !SITE_ID) {
    console.warn('[CinetPay] Clés absentes — token mock utilisé');
    _token = 'mock_token';
    _tokenExpiry = Date.now() + 20 * 60 * 1000;
    return _token;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apikey: API_KEY, password: SITE_ID }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (data.code !== '0') throw new Error(data.message || 'CinetPay auth failed');
    _token = data.data.token;
    _tokenExpiry = Date.now() + 19 * 60 * 1000; // 19 min de marge
    return _token;
  } finally {
    clearTimeout(timer);
  }
};

const request = async (method, endpoint, body = null) => {
  const token = await getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await res.json();
    if (data.code !== '0') throw new Error(data.message || `CinetPay error ${res.status}`);
    return data.data;
  } finally {
    clearTimeout(timer);
  }
};

// ── Mapping opérateur → code CinetPay ────────────────────────────────────────

const OPERATOR_CODES = {
  MTN:  'MTN_BENIN',
  MOOV: 'MOOV_BENIN',
};

// ── MODULE 2A : Name Enquiry — vérifier un compte Momo ───────────────────────

export const verifyAccount = async (phoneNumber, operator) => {
  const operatorCode = OPERATOR_CODES[operator.toUpperCase()];
  if (!operatorCode) throw new Error(`Opérateur inconnu : ${operator}`);

  if (!API_KEY || !SITE_ID) {
    // Mock sandbox : numéros connus retournent un nom
    const MOCK_ACCOUNTS = {
      '22997451287': 'ADJOVI Adjoua',
      '22996234567': 'KOFFI Papa',
      '22997890123': 'AFI Maman',
      '22996567890': 'SEKOU Oncle',
      '22997345678': 'ROSINE Tante',
    };
    const digits = phoneNumber.replace(/\D/g, '');
    const name = MOCK_ACCOUNTS[digits] || MOCK_ACCOUNTS['229' + digits];
    if (name) return { valid: true, name, phoneNumber, operator };
    return { valid: false, name: null, phoneNumber, operator, error: 'not_found' };
  }

  try {
    const data = await request('POST', '/transfer/check/user', {
      prefix:  '229',
      phone:   phoneNumber.replace(/\D/g, '').replace(/^229/, ''),
      network: operatorCode,
    });
    return {
      valid:       true,
      name:        data.name,
      phoneNumber,
      operator,
    };
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('invalid')) {
      return { valid: false, name: null, phoneNumber, operator, error: 'not_found' };
    }
    // Échec API → avertissement (pas bloquant)
    return { valid: null, name: null, phoneNumber, operator, error: 'api_failure' };
  }
};

// ── MODULE 2B : Envoyer un virement FCFA vers Momo ───────────────────────────

export const sendTransfer = async ({ phoneNumber, operator, amountFCFA, transferId, recipientName }) => {
  const operatorCode = OPERATOR_CODES[operator.toUpperCase()];
  if (!operatorCode) throw new Error(`Opérateur inconnu : ${operator}`);

  // Les montants FCFA sont des entiers
  const amount = Math.round(amountFCFA);
  if (amount <= 0) throw new Error('Montant FCFA invalide');

  if (!API_KEY || !SITE_ID) {
    console.warn('[CinetPay] Mock virement — ID fictif retourné');
    return {
      cinetPayId: `cp_mock_${transferId.slice(2, 10)}`,
      status:     'pending',
      amountFCFA: amount,
    };
  }

  const data = await request('POST', '/transfer/money/send/contact', {
    transaction_id: transferId,
    amount,
    currency:       'XOF',
    prefix:         '229',
    phone:          phoneNumber.replace(/\D/g, '').replace(/^229/, ''),
    network:        operatorCode,
    name:           recipientName || 'Destinataire',
    notify_url:     `${process.env.API_URL}/webhook/cinetpay`,
  });

  return {
    cinetPayId: data.transaction_id,
    status:     data.status,           // pending | completed | failed
    amountFCFA: amount,
  };
};

// ── MODULE 2C : Statut d'un virement ─────────────────────────────────────────

export const getTransferStatus = async (cinetPayTransferId) => {
  if (!API_KEY || !SITE_ID || cinetPayTransferId.startsWith('cp_mock_')) {
    return { cinetPayId: cinetPayTransferId, status: 'completed' };
  }

  const data = await request('POST', '/transfer/check/money', {
    transaction_id: cinetPayTransferId,
  });

  return {
    cinetPayId: cinetPayTransferId,
    status:     data.status,           // pending | completed | failed
    message:    data.comment || null,
  };
};

// ── Taux de change cUSD → FCFA ──────────────────────────────────────────────
// CinetPay applique le taux du marché au moment du virement
// On expose un endpoint pour l'affichage temps réel dans l'app

export const getExchangeRate = async () => {
  // En prod : appeler l'API CinetPay pour le taux live
  // Pour le sandbox : taux fixe
  const rate = parseFloat(process.env.EXCHANGE_RATE || '612.5');
  return { rate, currency: 'XOF', provider: 'CinetPay', mock: !API_KEY };
};

// ── MODULE 4 : Solde float FCFA chez CinetPay ────────────────────────────────

export const getFloatBalance = async () => {
  if (!API_KEY || !SITE_ID) {
    return { balanceFCFA: 2_500_000, currency: 'XOF', mock: true };
  }

  const data = await request('POST', '/transfer/check/balance', {});
  return {
    balanceFCFA: Math.round(data.available || 0),
    currency:    'XOF',
  };
};
