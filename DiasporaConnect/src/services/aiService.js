/**
 * DiasporaConnect — AI Service
 * 1. Assistant conversationnel multilingue (FR/EN/FON) — via OpenAI API
 * 2. Prédiction taux de change (heuristique + tendance)
 * 3. Détection de fraude / anomalie comportementale
 * 4. Suggestion intelligente du montant
 * 5. Résumé IA de l'impact social
 */

import { OPENAI_API_KEY } from '@env';

// ─────────────────────────────────────────────
// 1. ASSISTANT CONVERSATIONNEL MULTILINGUE
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = {
  fr: `Tu es Lumière, l'assistante IA de DiasporaConnect — une plateforme de transfert d'argent blockchain pour la diaspora africaine vers le Bénin.
Tu réponds en français, de façon chaleureuse, concise et professionnelle.
Tu connais : les frais (< 1%), le smart contract Celo, MTN Money, Moov Money, le taux EUR/FCFA (~655 FCFA pour 1 EUR).
Si on te demande un calcul de transfert, fais-le directement. Ne dis jamais "je ne sais pas" — propose toujours une alternative utile.`,

  en: `You are Lumière, the AI assistant of DiasporaConnect — a blockchain remittance platform for the African diaspora sending money to Benin.
You respond in English, warmly, concisely and professionally.
You know: fees (< 1%), Celo smart contract, MTN Money, Moov Money, EUR/FCFA rate (~655 FCFA per 1 EUR).
If asked for a transfer calculation, do it directly. Never say "I don't know" — always offer a useful alternative.`,

  fon: `Mì nyí Lumière, azɔnumɛ IA tɔn DiasporaConnect — azɔn gbɛ̀ sín xwé ɖé bló nú mɛ e nɔ nɔ Yɛ̀wópù bo nɔ sɛ́ akwɛ dó Bénin.
Nú mɛ ɖebǔ byɔ we ɖò Fɔngbè mɛ ɔ, xósin ɛ ɖò Fɔngbè mɛ.
Mì tuùn: akwɛ sín dó (< 1%), Celo blockchain, MTN Money, Moov Money.
Bló nǔ e nyɔ́ nú mɛ lɛ tɔn.`,
};

export const askAssistant = async (message, language = 'fr', conversationHistory = []) => {
  // Fallback hors-ligne si pas de clé API
  if (!OPENAI_API_KEY || OPENAI_API_KEY === '<your_openai_key>') {
    return getOfflineFallback(message, language);
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT[language] || SYSTEM_PROMPT.fr },
      ...conversationHistory.slice(-6), // max 6 messages d'historique
      { role: 'user', content: message },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch {
    return getOfflineFallback(message, language);
  }
};

// Réponses hors-ligne intelligentes basées sur mots-clés
const getOfflineFallback = (message, language) => {
  const msg = message.toLowerCase();
  const isEn = language === 'en';
  const isFon = language === 'fon';

  if (msg.includes('frais') || msg.includes('fee') || msg.includes('akwɛ')) {
    if (isEn) return 'DiasporaConnect charges less than 1% per transfer. For example, sending $200 costs only $1.80 in fees — vs $28 with Western Union.';
    if (isFon) return 'DiasporaConnect nɔ ɖó akwɛ kpɛví (< 1%) ɖò gbɛ̀ ɖokpo ɖokpo mɛ.';
    return 'DiasporaConnect prélève moins de 1% par transfert. Par exemple, envoyer 200 USD coûte seulement 1,80 USD de frais — contre 28 USD chez Western Union.';
  }
  if (msg.includes('combien') || msg.includes('how much') || msg.includes('nɛ̌')) {
    if (isEn) return 'Tell me the amount you want to send and I\'ll calculate exactly what your family will receive in FCFA!';
    return 'Dites-moi le montant que vous souhaitez envoyer et je calcule exactement ce que votre famille recevra en FCFA !';
  }
  if (msg.includes('temps') || msg.includes('time') || msg.includes('rapide') || msg.includes('fast')) {
    if (isEn) return 'Transfers are confirmed in less than 60 seconds on the Celo blockchain. Mobile Money withdrawal is instant.';
    return 'Les transferts sont confirmés en moins de 60 secondes sur la blockchain Celo. Le retrait Mobile Money est instantané.';
  }
  if (msg.includes('sécur') || msg.includes('secure') || msg.includes('safe')) {
    if (isEn) return 'Your funds are locked in an audited smart contract on Celo blockchain. They can only be released to the verified recipient — or refunded to you after 72h if unclaimed.';
    return 'Vos fonds sont verrouillés dans un smart contract audité sur Celo. Ils ne peuvent être libérés qu\'au destinataire vérifié — ou remboursés après 72h si non réclamés.';
  }
  if (msg.includes('mtn') || msg.includes('moov')) {
    return isEn
      ? 'We support MTN Money and Moov Money in Benin. More operators coming soon!'
      : 'Nous supportons MTN Money et Moov Money au Bénin. D\'autres opérateurs arrivent bientôt !';
  }
  if (msg.includes('taux') || msg.includes('rate') || msg.includes('fcfa')) {
    return isEn
      ? 'The EUR/FCFA rate is fixed by the Bank of France at 655.957 FCFA per 1 EUR. We apply this official rate with no hidden markup.'
      : 'Le taux EUR/FCFA est fixé par la Banque de France à 655,957 FCFA pour 1 EUR. Nous appliquons ce taux officiel sans marge cachée.';
  }

  // Réponse générique
  if (isEn) return 'I\'m Lumière, your DiasporaConnect assistant! I can help you with transfer fees, rates, security, and Mobile Money. What would you like to know?';
  if (isFon) return 'Mì nyí Lumière! Mì sixu d\'akpɔ we ɖò akwɛ gbɛ̀ kpo taux kpo wu. Nɛ̌ mì ka sixu d\'alɔ we gbɔn?';
  return 'Je suis Lumière, votre assistante DiasporaConnect ! Je peux vous aider sur les frais, les taux, la sécurité et Mobile Money. Que souhaitez-vous savoir ?';
};

// ─────────────────────────────────────────────
// 2. PRÉDICTION TAUX DE CHANGE
// ─────────────────────────────────────────────

/**
 * Analyse la tendance des taux sur les dernières valeurs
 * et prédit si le moment est favorable pour envoyer
 */
export const predictRateTrend = (ratesHistory = []) => {
  if (ratesHistory.length < 3) {
    return {
      prediction: 'stable',
      confidence: 0.5,
      message: null,
      bestTimeHours: null,
    };
  }

  const recent = ratesHistory.slice(-5);
  const values = recent.map(r => r.EUR_USD);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const last = values[values.length - 1];
  const trend = (last - values[0]) / values[0]; // variation relative

  // Calcul de la volatilité (écart-type simplifié)
  const variance = values.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / values.length;
  const volatility = Math.sqrt(variance) / avg;

  if (trend > 0.005) {
    return {
      prediction: 'rising',
      confidence: Math.min(0.85, 0.6 + volatility * 10),
      message: 'Le taux EUR/USD est en hausse 📈 — bon moment pour envoyer !',
      messageEn: 'EUR/USD rate is rising 📈 — great time to send!',
      bestTimeHours: 0,
    };
  }
  if (trend < -0.005) {
    return {
      prediction: 'falling',
      confidence: Math.min(0.80, 0.55 + volatility * 10),
      message: 'Taux en baisse 📉 — attendez 2-4h pour un meilleur taux.',
      messageEn: 'Rate is falling 📉 — wait 2-4h for a better rate.',
      bestTimeHours: 3,
    };
  }
  return {
    prediction: 'stable',
    confidence: 0.65,
    message: 'Taux stable aujourd\'hui — vous pouvez envoyer maintenant.',
    messageEn: 'Rate is stable today — you can send now.',
    bestTimeHours: 0,
  };
};

// ─────────────────────────────────────────────
// 3. DÉTECTION DE FRAUDE / ANOMALIE
// ─────────────────────────────────────────────

/**
 * Analyse comportementale d'une transaction avant envoi
 * Retourne null si OK, ou un objet { level, reason } si suspect
 */
export const detectAnomaly = (newTx, transactionHistory = []) => {
  if (transactionHistory.length === 0) return null;

  const completedTxs = transactionHistory.filter(tx => tx.status === 'completed');
  if (completedTxs.length === 0) return null;

  const amounts = completedTxs.map(tx => tx.amountUSD);
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const maxAmount = Math.max(...amounts);

  const knownRecipients = new Set(completedTxs.map(tx => tx.recipientPhone));
  const isNewRecipient = newTx.recipientPhone && !knownRecipients.has(newTx.recipientPhone);
  const isLargeAmount = newTx.amountUSD > avgAmount * 3;
  const isVeryLarge = newTx.amountUSD > maxAmount * 2;

  // Vérification fréquence (2 transferts en moins de 10 min)
  const recentTxs = transactionHistory.filter(tx => {
    const diff = (Date.now() - new Date(tx.date).getTime()) / 1000 / 60;
    return diff < 10;
  });

  if (isVeryLarge && isNewRecipient) {
    return {
      level: 'high',
      reason: `Montant inhabituel (${newTx.amountUSD} USD) vers un nouveau destinataire. Vérifiez avant de confirmer.`,
      reasonEn: `Unusual amount ($${newTx.amountUSD}) to a new recipient. Please verify before confirming.`,
    };
  }
  if (isLargeAmount && isNewRecipient) {
    return {
      level: 'medium',
      reason: `Ce montant est 3× supérieur à votre moyenne (${avgAmount.toFixed(0)} USD) et le destinataire est nouveau.`,
      reasonEn: `This amount is 3× your average ($${avgAmount.toFixed(0)}) and the recipient is new.`,
    };
  }
  if (recentTxs.length >= 2) {
    return {
      level: 'medium',
      reason: 'Plusieurs transferts détectés en peu de temps. Confirmez que c\'est bien vous.',
      reasonEn: 'Multiple transfers detected in a short time. Please confirm this is you.',
    };
  }
  if (isLargeAmount) {
    return {
      level: 'low',
      reason: `Montant plus élevé que d'habitude (moyenne : ${avgAmount.toFixed(0)} USD). Tout va bien ?`,
      reasonEn: `Amount higher than usual (average: $${avgAmount.toFixed(0)}). Everything OK?`,
    };
  }

  return null;
};

// ─────────────────────────────────────────────
// 4. SUGGESTION INTELLIGENTE DU MONTANT
// ─────────────────────────────────────────────

/**
 * Suggère des montants basés sur l'historique et le calendrier
 */
export const getSmartSuggestions = (transactionHistory = [], balanceUSD = 0) => {
  const suggestions = [];
  const now = new Date();
  const dayOfMonth = now.getDate();
  const month = now.getMonth(); // 0-11

  // Montants fréquents de l'historique
  if (transactionHistory.length > 0) {
    const amounts = transactionHistory
      .filter(tx => tx.status === 'completed')
      .map(tx => tx.amountUSD);

    // Montant le plus fréquent
    const freq = {};
    amounts.forEach(a => { freq[a] = (freq[a] || 0) + 1; });
    const mostFrequent = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (mostFrequent) {
      suggestions.push({
        amount: parseFloat(mostFrequent[0]),
        label: 'Habituel',
        labelEn: 'Usual',
        icon: '🔄',
        reason: `Votre montant le plus envoyé`,
      });
    }

    // Moyenne arrondie
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const roundedAvg = Math.round(avg / 50) * 50;
    if (roundedAvg > 0 && roundedAvg !== parseFloat(mostFrequent?.[0])) {
      suggestions.push({
        amount: roundedAvg,
        label: 'Moyenne',
        labelEn: 'Average',
        icon: '📊',
        reason: `Votre moyenne habituelle`,
      });
    }
  }

  // Suggestion calendrier — fin de mois
  if (dayOfMonth >= 25 || dayOfMonth <= 5) {
    suggestions.push({
      amount: 200,
      label: 'Fin de mois',
      labelEn: 'Month-end',
      icon: '📅',
      reason: 'Période de fin de mois — envoi courant',
    });
  }

  // Rentrée scolaire (août-septembre)
  if (month === 7 || month === 8) {
    suggestions.push({
      amount: 300,
      label: 'Rentrée',
      labelEn: 'Back to school',
      icon: '🎒',
      reason: 'Période de rentrée scolaire',
    });
  }

  // Fêtes de fin d'année
  if (month === 11 || month === 0) {
    suggestions.push({
      amount: 500,
      label: 'Fêtes',
      labelEn: 'Holidays',
      icon: '🎉',
      reason: 'Période des fêtes',
    });
  }

  // Suggestion basée sur le solde (50% du solde, arrondi)
  if (balanceUSD > 100) {
    const halfBalance = Math.round((balanceUSD * 0.5) / 50) * 50;
    if (!suggestions.find(s => s.amount === halfBalance)) {
      suggestions.push({
        amount: halfBalance,
        label: 'Solde ×½',
        labelEn: 'Half balance',
        icon: '💰',
        reason: '50% de votre solde disponible',
      });
    }
  }

  // Toujours proposer des montants ronds standards
  const standards = [50, 100, 200];
  standards.forEach(amt => {
    if (!suggestions.find(s => s.amount === amt) && amt <= balanceUSD) {
      suggestions.push({ amount: amt, label: `${amt} USD`, labelEn: `$${amt}`, icon: '💵', reason: '' });
    }
  });

  return suggestions.slice(0, 4); // max 4 suggestions
};

// ─────────────────────────────────────────────
// 5. RÉSUMÉ IA DE L'IMPACT SOCIAL
// ─────────────────────────────────────────────

/**
 * Génère un résumé narratif personnalisé de l'impact
 * Fonctionne 100% hors-ligne avec des templates riches
 */
export const generateImpactNarrative = (impactScore, language = 'fr') => {
  const { totalSavedUSD = 0, totalTransfers = 0, co2SavedKg = 0 } = impactScore || {};

  // Équivalences concrètes
  const mealsEquivalent = Math.round(totalSavedUSD / 2.5); // ~2.5 USD par repas familial
  const schoolDays = Math.round(totalSavedUSD / 1.2); // ~1.2 USD par jour d'école
  const monthsGroceries = (totalSavedUSD / 45).toFixed(1); // ~45 USD/mois courses famille

  const savedFCFA = Math.round(totalSavedUSD * 612.5).toLocaleString('fr-FR');

  if (language === 'en') {
    if (totalTransfers === 0) {
      return 'Make your first transfer and discover the real impact on your family\'s life in Benin.';
    }
    if (totalTransfers < 3) {
      return `In ${totalTransfers} transfer${totalTransfers > 1 ? 's' : ''}, you've already saved $${totalSavedUSD.toFixed(2)} in fees — enough for ${mealsEquivalent} family meals in Cotonou.`;
    }
    return `Over ${totalTransfers} transfers, you've saved $${totalSavedUSD.toFixed(2)} in fees — the equivalent of ${schoolDays} school days or ${monthsGroceries} months of groceries for a Beninese family. Your blockchain commitment is making a real difference. 🌍`;
  }

  if (language === 'fon') {
    return `Gbɛ̀ ${totalTransfers} mɛ, a ko hwlɛn akwɛ ${totalSavedUSD.toFixed(2)} USD — nǔ e nyɔ́ nú xwédo towe ɖò Bénin. 🌍`;
  }

  // Français — narratif riche
  if (totalTransfers === 0) {
    return 'Faites votre premier transfert et découvrez l\'impact réel sur la vie de votre famille au Bénin.';
  }
  if (totalTransfers === 1) {
    return `Dès votre 1er transfert, vous avez économisé ${totalSavedUSD.toFixed(2)} USD en frais — soit ${savedFCFA} FCFA qui restent dans la poche de votre famille plutôt que chez Western Union.`;
  }
  if (totalTransfers < 5) {
    return `En ${totalTransfers} transferts, vous avez économisé ${totalSavedUSD.toFixed(2)} USD en frais — l'équivalent de ${mealsEquivalent} repas familiaux à Cotonou. Chaque envoi compte.`;
  }
  if (totalTransfers < 10) {
    return `Vos ${totalTransfers} transferts ont généré ${totalSavedUSD.toFixed(2)} USD d'économies — soit ${schoolDays} jours d'école ou ${monthsGroceries} mois de courses pour une famille béninoise. Vous faites partie des pionniers de la finance inclusive. 🌍`;
  }
  return `En ${totalTransfers} transferts, vous avez économisé ${totalSavedUSD.toFixed(2)} USD (${savedFCFA} FCFA) en frais bancaires. C'est l'équivalent de ${monthsGroceries} mois de courses pour une famille béninoise — et ${co2SavedKg} kg de CO₂ évités vs les circuits traditionnels. Vous êtes un ambassadeur de la finance décentralisée africaine. 🏆🌍`;
};
