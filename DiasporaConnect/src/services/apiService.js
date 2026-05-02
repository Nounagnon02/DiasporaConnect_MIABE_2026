// ============================================================
// DIASPORA CONNECT — API Service
// ============================================================
import { API_URL } from '@env';

const BASE_URL = API_URL || 'https://api.diasporaconnect.africa/v1';

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${BASE_URL}/rates`);
    return await response.json();
  } catch (e) {
    // Fallback in case of network issue
    return { EUR: 655.957, USD: 612.50 };
  }
};

export const requestOTP = async (phone) => {
  const response = await fetch(`${BASE_URL}/auth/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return await response.json();
};

export const verifyOTP = async (phone, code) => {
  const response = await fetch(`${BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur de vérification");
  }
  
  return await response.json(); // Expected { success: true, token: '...', user: {...} }
}

export const fetchTransactions = async (token, role) => {
  const response = await fetch(`${BASE_URL}/transactions?role=${role}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
};
