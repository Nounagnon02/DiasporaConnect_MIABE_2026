/**
 * DiasporaConnect API Service
 * Responsable de la communication avec le backend (Taux, OTP, Transactions, Name Enquiry)
 */
import { API_URL } from '@env';

/**
 * Wrapper interne pour les appels fetch avec gestion d'erreur uniforme
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!response.ok) {
      console.warn(`API Error ${response.status} on ${endpoint}`);
      return { success: false, error: `API_${response.status}` };
    }
    const data = await response.json();
    return { success: true, ...data };
  } catch (e) {
    console.error(`Network Error on ${endpoint}:`, e.message);
    return { success: false, error: 'NETWORK_ERROR' };
  }
};

/**
 * 1. Obtenir les taux de change (USD/XOF, EUR/XOF, etc.)
 */
export const getExchangeRate = async (from = 'USD', to = 'XOF') => {
  const res = await apiCall(`/rates?from=${from}&to=${to}`);
  if (res.success) return res;
  return { rate: 612.5, provider: 'Celo/Binance (Fallback)' };
};

/**
 * 2. Récupérer l'historique des transactions
 */
export const fetchTransactions = async (token, role) => {
  const res = await apiCall(`/transactions?role=${role}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.success ? (res.transactions || []) : [];
};

/**
 * 3. Authentification : Envoi OTP
 */
export const sendOTP = async (phone) => {
  return await apiCall('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
};

/**
 * 4. Authentification : Vérification OTP
 */
export const verifyOTP = async (phone, code) => {
  return await apiCall('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
};

/**
 * 5. Vérification d'identité béninois (Name Enquiry)
 * Simulé pour le hackathon avec logique de délais
 */
export const nameEnquiry = async (phone, operator) => {
  // Simule un appel réseau de 1.5s
  return new Promise((resolve) => {
    setTimeout(() => {
      const isMtn = operator === 'MTN';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      
      // Logique de simulation basée sur les chiffres
      if (cleanPhone.includes('97') || cleanPhone.includes('61') || cleanPhone.includes('96')) {
        resolve({ 
          success: true, 
          name: isMtn ? 'Sèna AHOUANGBÉ' : 'Koffi DJOSSOU',
          operator 
        });
      } else if (cleanPhone.endsWith('00')) {
        resolve({ success: false, error: 'not_found' });
      } else {
        resolve({ success: false, error: 'api_failure' }); // Simule une erreur technique
      }
    }, 1500);
  });
};
