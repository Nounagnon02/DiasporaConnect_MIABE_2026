/**
 * DiasporaConnect API Service
 * Handles exchange rates, OTP and real transactions via backend
 */
import { API_URL } from '@env';

export const getExchangeRate = async (from = 'USD', to = 'XOF') => {
  try {
    // In production: fetch real rate
    // const res = await fetch(`${API_URL}/rates?from=${from}&to=${to}`);
    // return await res.json();
    return { rate: 612.5, provider: 'Celo/Binance' };
  } catch (e) {
    return { rate: 612.5 };
  }
};

export const fetchTransactions = async (token, role) => {
  try {
    const response = await fetch(`${API_URL}/transactions?role=${role}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (e) {
    return [];
  }
};

export const sendOTP = async (phone) => {
  try {
    // const res = await fetch(`${API_URL}/auth/send-otp`, {
    //   method: 'POST',
    //   body: JSON.stringify({ phone })
    // });
    // return await res.json();
    return { success: true, message: 'OTP envoyé' };
  } catch (e) {
    return { success: false };
  }
};

export const verifyOTP = async (phone, code) => {
  try {
    // const res = await fetch(`${API_URL}/auth/verify-otp`, {
    //   method: 'POST',
    //   body: JSON.stringify({ phone, code })
    // });
    // return await res.json();
    return { 
      success: true, 
      token: 'mock_token_jwt',
      user: { firstName: 'Adjoua', lastName: 'Adjovi', phone }
    };
  } catch (e) {
    return { success: false };
  }
};
