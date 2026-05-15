// ============================================================
// DIASPORA CONNECT — Global State (Zustand)
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_TRANSACTIONS } from '../services/mockData';
import { fetchLiveRates, getRateAlert } from '../services/ratesService';
import { fetchTransactions } from '../services/apiService';

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
        EUR_USD: 1.08,
        USD_FCFA: 612.5,
        CELO_USD: 0.65,
        lastUpdated: new Date().toISOString(),
        isLive: false,
      },
      rateAlert: null,

      // ---- Beneficiaries ----
      beneficiaries: [
        { id: 'b_001', name: 'Adjoua Adjovi',  phone: '+229 97 45 12 87', operator: 'MTN',  city: 'Cotonou',        initials: 'AA', color: '#C75B39' },
        { id: 'b_002', name: 'Papa Koffi',     phone: '+229 96 23 45 67', operator: 'Moov', city: 'Porto-Novo',     initials: 'PK', color: '#2D5A4A' },
        { id: 'b_003', name: 'Maman Afi',      phone: '+229 97 89 01 23', operator: 'MTN',  city: 'Abomey-Calavi',  initials: 'MA', color: '#D4A574' },
      ],

      // ---- Notification Settings ----
      notifSettings: {
        rateAlert: true,
        transferSent: true,
        transferReceived: true,
        recurringReminder: true,
        securityAlert: true,
        weeklyReport: false,
      },

      // ---- KYC ----
      kycStatus: 'none', // 'none' | 'pending' | 'verified'

      // ---- Offline ----
      isOfflineMode: false,
      offlineQueue: [],

      // ---- Impact Score ----
      impactScore: {
        totalSavedUSD: 187.4,
        totalTransfers: 12,
        familiesHelped: 1,
        badges: ['first_transfer', 'saver_100'],
        co2SavedKg: 0.24,
      },

      // ---- Recurring Transfers ----
      recurringTransfers: [],

      // ---- Referral ----
      referral: {
        code: 'KOFI2026',
        referredCount: 2,
        earnedUSD: 1.0,
        pendingUSD: 0.5,
      },

      // ---- Savings Pool ----
      savingsPool: {
        balanceUSD: 4.80,
        contributions: [
          { date: '2026-04-28', amountUSD: 0.60, txId: 'tx_001' },
          { date: '2026-04-15', amountUSD: 0.50, txId: 'tx_002' },
          { date: '2026-03-30', amountUSD: 1.00, txId: 'tx_003' },
          { date: '2026-03-12', amountUSD: 0.90, txId: 'tx_004' },
          { date: '2026-02-20', amountUSD: 1.80, txId: 'tx_006' },
        ],
        yieldPercent: 4.2,
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

      setLanguage: (lang) => {
        set({ language: lang });
        import('../i18n').then(i18n => i18n.default.changeLanguage(lang));
      },

      setLoading: (val) => set({ isLoading: val }),

      // ---- Rates Actions ----
      refreshRates: async () => {
        try {
          const newRates = await fetchLiveRates();
          const alert = getRateAlert(newRates);
          set({ rates: newRates, rateAlert: alert });
        } catch {}
      },

      dismissRateAlert: () => set({ rateAlert: null }),

      fetchUserTransactions: async () => {
        const { token, userRole } = get();
        if (!token) return;
        set({ isLoading: true });
        try {
          const txs = await fetchTransactions(token, userRole);
          if (txs && txs.length > 0) {
            set({ transactions: txs });
          }
        } catch (e) {
          console.error('Error fetching transactions:', e);
        } finally {
          set({ isLoading: false });
        }
      },

      // ---- Impact Actions ----
      updateImpactScore: (savedUSD) =>
        set(state => {
          const total = state.impactScore.totalSavedUSD + savedUSD;
          const transfers = state.impactScore.totalTransfers + 1;
          const badges = [...state.impactScore.badges];
          if (total >= 100 && !badges.includes('saver_100')) badges.push('saver_100');
          if (total >= 500 && !badges.includes('saver_500')) badges.push('saver_500');
          if (transfers >= 5 && !badges.includes('loyal_5')) badges.push('loyal_5');
          if (transfers >= 10 && !badges.includes('loyal_10')) badges.push('loyal_10');
          return {
            impactScore: {
              ...state.impactScore,
              totalSavedUSD: parseFloat(total.toFixed(2)),
              totalTransfers: transfers,
              co2SavedKg: parseFloat((transfers * 0.02).toFixed(3)),
              badges,
            },
          };
        }),

      // ---- Recurring Actions ----
      addRecurringTransfer: (recurring) =>
        set(state => ({
          recurringTransfers: [
            ...state.recurringTransfers,
            { ...recurring, id: `rec_${Date.now()}`, active: true, createdAt: new Date().toISOString() },
          ],
        })),

      toggleRecurring: (id) =>
        set(state => ({
          recurringTransfers: state.recurringTransfers.map(r =>
            r.id === id ? { ...r, active: !r.active } : r
          ),
        })),

      deleteRecurring: (id) =>
        set(state => ({
          recurringTransfers: state.recurringTransfers.filter(r => r.id !== id),
        })),

      // ---- Savings Pool Actions ----
      addSavingsContribution: (amountUSD, txId) =>
        set(state => ({
          savingsPool: {
            ...state.savingsPool,
            balanceUSD: parseFloat((state.savingsPool.balanceUSD + amountUSD).toFixed(2)),
            contributions: [
              { date: new Date().toISOString(), amountUSD, txId },
              ...state.savingsPool.contributions,
            ],
          },
        })),

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

      // ---- Beneficiaries Actions ----
      addBeneficiary: (b) =>
        set(state => ({
          beneficiaries: [
            ...state.beneficiaries,
            { ...b, id: `b_${Date.now()}` },
          ],
        })),

      updateBeneficiary: (id, data) =>
        set(state => ({
          beneficiaries: state.beneficiaries.map(b =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),

      deleteBeneficiary: (id) =>
        set(state => ({
          beneficiaries: state.beneficiaries.filter(b => b.id !== id),
        })),

      // ---- Notification Settings Actions ----
      updateNotifSettings: (settings) =>
        set(state => ({
          notifSettings: { ...state.notifSettings, ...settings },
        })),

      // ---- KYC Actions ----
      setKYCStatus: (status) => set({ kycStatus: status }),

      // ---- Offline Actions ----
      setOfflineMode: (val) => set({ isOfflineMode: val }),

      addToOfflineQueue: (tx) =>
        set(state => ({ offlineQueue: [...state.offlineQueue, { ...tx, queuedAt: new Date().toISOString() }] })),

      clearOfflineQueue: () => set({ offlineQueue: [] }),
    }),
    {
      name: 'diasporaconnect-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
