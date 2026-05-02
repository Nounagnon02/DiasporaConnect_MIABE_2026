// ============================================================
// DIASPORA CONNECT — Global State (Zustand)
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TRANSACTIONS } from '../services/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // ---- Auth ----
      isAuthenticated: false,
      userRole: null, // 'sender' | 'recipient'
      token: null,
      senderUser: null,
      recipientUser: null,

      // ---- App State ----
      language: 'fr',
      isLoading: false,

      // ---- Transfer Flow State ----
      transferData: {
        amount: '',
        currency: 'EUR',
        amountUSD: 0,
        amountFCFA: 0,
        fee: 0,
        recipientGets: 0,
        recipientGetsFCFA: 0,
        savings: 0,
        recipient: null,
        operator: 'MTN',
        gasFee: null,
        txHash: null,
        status: null,
      },

      // ---- Transactions ----
      transactions: MOCK_TRANSACTIONS,

      // ---- Rates ----
      rates: {
        USD_FCFA: 612.5,
        EUR_FCFA: 655.957,
        lastUpdated: new Date().toISOString(),
      },

      // ---- Actions ----
      loginSender: (userData, token = null) => {
        set({
          isAuthenticated: true,
          userRole: 'sender',
          senderUser: userData,
          token,
        });
      },

      loginRecipient: (userData, token = null) => {
        set({
          isAuthenticated: true,
          userRole: 'recipient',
          recipientUser: userData,
          token,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          userRole: null,
          token: null,
          senderUser: null,
          recipientUser: null,
        });
      },

      setLanguage: (lang) => set({ language: lang }),

      setLoading: (val) => set({ isLoading: val }),

      updateTransferData: (data) =>
        set(state => ({
          transferData: { ...state.transferData, ...data },
        })),

      resetTransferData: () =>
        set({
          transferData: {
            amount: '',
            currency: 'EUR',
            amountUSD: 0,
            amountFCFA: 0,
            fee: 0,
            recipientGets: 0,
            recipientGetsFCFA: 0,
            savings: 0,
            recipient: null,
            operator: 'MTN',
            gasFee: null,
            txHash: null,
            status: null,
          },
        }),

      addTransaction: (tx) =>
        set(state => ({
          transactions: [tx, ...state.transactions],
        })),

      updateRecipientUser: (data) =>
        set(state => ({
          recipientUser: { ...state.recipientUser, ...data },
        })),

      updateTransactionStatus: (txHash, status) =>
        set(state => ({
          transactions: state.transactions.map(tx =>
            tx.txHash === txHash ? { ...tx, status } : tx
          ),
        })),
    }),
    {
      name: 'diasporaconnect-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
