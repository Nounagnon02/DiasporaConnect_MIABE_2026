/**
 * DiasporaConnect — Rates Service
 * Taux temps réel : CoinGecko (CELO/USD) + ExchangeRate-API (EUR/USD)
 * Fallback automatique sur les valeurs hardcodées si offline
 */

const FALLBACK = { EUR_USD: 1.08, USD_FCFA: 612.5, CELO_USD: 0.65 };

// CoinGecko free — pas de clé requise
const CELO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd';
// ExchangeRate-API free tier
const FOREX_URL = 'https://open.er-api.com/v6/latest/EUR';

export const fetchLiveRates = async () => {
  try {
    const [celoRes, forexRes] = await Promise.allSettled([
      fetch(CELO_URL, { signal: AbortSignal.timeout(5000) }),
      fetch(FOREX_URL, { signal: AbortSignal.timeout(5000) }),
    ]);

    let CELO_USD = FALLBACK.CELO_USD;
    let EUR_USD = FALLBACK.EUR_USD;

    if (celoRes.status === 'fulfilled' && celoRes.value.ok) {
      const data = await celoRes.value.json();
      CELO_USD = data?.celo?.usd ?? FALLBACK.CELO_USD;
    }

    if (forexRes.status === 'fulfilled' && forexRes.value.ok) {
      const data = await forexRes.value.json();
      EUR_USD = data?.rates?.USD ?? FALLBACK.EUR_USD;
    }

    // FCFA est fixé par la Banque de France (parité fixe avec EUR)
    const USD_FCFA = 655.957 / EUR_USD;

    return {
      EUR_USD,
      USD_FCFA: parseFloat(USD_FCFA.toFixed(2)),
      CELO_USD,
      lastUpdated: new Date().toISOString(),
      isLive: true,
    };
  } catch {
    return { ...FALLBACK, lastUpdated: new Date().toISOString(), isLive: false };
  }
};

/**
 * Calcule si le taux actuel est favorable vs la moyenne des 7 derniers jours
 * On simule la moyenne historique avec ±2% de variation
 */
export const getRateAlert = (currentRates, historicalAvg = null) => {
  const avg = historicalAvg ?? { EUR_USD: 1.06, USD_FCFA: 618.0 };
  const eurDiff = ((currentRates.EUR_USD - avg.EUR_USD) / avg.EUR_USD) * 100;
  const fcfaDiff = ((currentRates.USD_FCFA - avg.USD_FCFA) / avg.USD_FCFA) * 100;

  if (eurDiff > 1.5) {
    return {
      type: 'positive',
      message: `Taux EUR/USD favorable aujourd'hui (+${eurDiff.toFixed(1)}% vs moyenne). Bon moment pour envoyer !`,
    };
  }
  if (fcfaDiff > 1.0) {
    return {
      type: 'positive',
      message: `Le FCFA est fort aujourd'hui. Votre famille reçoit plus (+${fcfaDiff.toFixed(1)}%).`,
    };
  }
  if (eurDiff < -1.5) {
    return {
      type: 'warning',
      message: `Taux EUR/USD en baisse (${eurDiff.toFixed(1)}%). Attendez demain si possible.`,
    };
  }
  return null;
};
