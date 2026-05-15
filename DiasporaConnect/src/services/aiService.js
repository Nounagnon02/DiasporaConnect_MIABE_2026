/**
 * DiasporaConnect — AI Service
 * 1. Assistant conversationnel multilingue (FR/EN/FON) — via OpenAI API
 * 2. Prédiction taux de change (heuristique + tendance)
 * 3. Détection de fraude / anomalie comportementale
 * 4. Suggestion intelligente du montant
 * 5. Résumé IA de l'impact social
 */

import { OPENAI_API_KEY, GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

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
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_') || GEMINI_API_KEY.includes('<')) {
    return getOfflineFallback(message, language);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT[language] || SYSTEM_PROMPT.fr,
    });

    const chat = model.startChat({
      history: conversationHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return getOfflineFallback(message, language);
  }
};

// Réponses hors-ligne intelligentes basées sur mots-clés
const getOfflineFallback = (message, language) => {
  const msg = message.toLowerCase();
  const isEn = language === 'en';
  const isFon = language === 'fon';

  if (msg.includes('frais') || msg.includes('fee') || msg.includes('akwɛ') || msg.includes('axɔ')) {
    if (isEn) return 'DiasporaConnect charges less than 1% per transfer. For example, sending $200 costs only $1.80 in fees — vs $28 with Western Union.';
    if (isFon) return 'DiasporaConnect nɔ ɖó akwɛ kpɛví (< 1%) ɖò gbɛ̀ ɖokpo ɖokpo mɛ. É nyɔ́ hú Western Union tawun.';
    return 'DiasporaConnect prélève moins de 1% par transfert. Par exemple, envoyer 200 USD coûte seulement 1,80 USD de frais — contre 28 USD chez Western Union.';
  }
  if (msg.includes('combien') || msg.includes('how much') || msg.includes('nɛ̌') || msg.includes('nabi')) {
    if (isEn) return 'Tell me the amount you want to send and I\'ll calculate exactly what your family will receive in FCFA!';
    if (isFon) return 'Ɖɔ akwɛ nabi é a jló na sɛ́ ɔ nú mì, bo má lɛ́n nǔ é xwédo towe na yí ɔ nú we.';
    return 'Dites-moi le montant que vous souhaitez envoyer et je calcule exactement ce que votre famille recevra en FCFA !';
  }
  if (msg.includes('temps') || msg.includes('time') || msg.includes('rapide') || msg.includes('fast') || msg.includes('yawu')) {
    if (isEn) return 'Transfers are confirmed in less than 60 seconds on the Celo blockchain. Mobile Money withdrawal is instant.';
    if (isFon) return 'Gbɛ̀ ɔ nɔ yì yawu (mɛ́nici 1 mɛ) gbɔn blockchain Celo. Akwɛ yíyí nyí tɛntin.';
    return 'Les transferts sont confirmés en moins de 60 secondes sur la blockchain Celo. Le retrait Mobile Money est instantané.';
  }
  if (msg.includes('sécur') || msg.includes('secure') || msg.includes('safe') || msg.includes('vɛ')) {
    if (isEn) return 'Your funds are locked in an audited smart contract on Celo blockchain. They can only be released to the verified recipient.';
    if (isFon) return 'Akwɛ towe ɖò sísí mɛ ɖò smart contract Celo tɔn mɛ. Mɛ e a sɛ́ dó ɔ jɛ́n dán na yí.';
    return 'Vos fonds sont verrouillés dans un smart contract audité sur Celo. Ils ne peuvent être libérés qu\'au destinataire vérifié.';
  }
  if (msg.includes('mtn') || msg.includes('moov')) {
    if (isEn) return 'We support MTN Money and Moov Money in Benin. More operators coming soon!';
    if (isFon) return 'Mǐ nɔ bɛ́ MTN Money kpo Moov Money kpo ɖò Bénin.';
    return 'Nous supportons MTN Money et Moov Money au Bénin. D\'autres opérateurs arrivent bientôt !';
  }
  if (msg.includes('taux') || msg.includes('rate') || msg.includes('fcfa')) {
    if (isEn) return 'The EUR/FCFA rate is fixed at 655.957 FCFA. We applies this official rate with no hidden markup.';
    if (isFon) return 'Taux EUR/FCFA ɔ nyí 655.957 FCFA. Mǐ nɔ wà azɔ̌ xá taux officiel ɔ.';
    return 'Le taux EUR/FCFA est fixé à 655,957 FCFA. Nous appliquons ce taux officiel sans marge cachée.';
  }

  // Réponse générique
  if (isEn) return 'I\'m Lumière, your DiasporaConnect assistant! I can help you with transfer fees, rates, and security. What would you like to know?';
  if (isFon) return 'Mì nyí Lumière! Mì sixu d\'akpɔ we ɖò akwɛ gbɛ̀ kpo taux kpo wu. Nɛ̌ mì ka sixu d\'alɔ we gbɔn?';
  return 'Je suis Lumière, votre assistante DiasporaConnect ! Je peux vous aider sur les frais, les taux et la sécurité. Que souhaitez-vous savoir ?';
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
      messageFon: 'Taux EUR/USD fannyí 📈 — é nyɔ́ tawun bɔ a na sɛ́ akwɛ!',
      bestTimeHours: 0,
    };
  }
  if (trend < -0.005) {
    return {
      prediction: 'falling',
      confidence: Math.min(0.80, 0.55 + volatility * 10),
      message: 'Taux en baisse 📉 — attendez 2-4h pour un meilleur taux.',
      messageEn: 'Rate is falling 📉 — wait 2-4h for a better rate.',
      messageFon: 'Taux ɔ ɖò we jɛ̀ wɛ́ 📉 — nɔ̀te mɛ́nici 2 abǐ 4 bonú taux ɔ ná nyɔ́.',
      bestTimeHours: 3,
    };
  }
  return {
    prediction: 'stable',
    confidence: 0.65,
    message: 'Taux stable aujourd\'hui — vous pouvez envoyer maintenant.',
    messageEn: 'Rate is stable today — you can send now.',
    messageFon: 'Taux ɔ ɖò tɛ̀n égbé — a sixú sɛ́ akwɛ dìn.',
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
      reasonFon: `Akwɛ nabi é nɔ sésɛ d'àyǐ ǎ (${newTx.amountUSD} USD) wɛ́ a jló na sɛ́ dó mɛ yɔyɔ́ ɖé. Kpɔ́n ganjí hwɛ̌.`,
    };
  }
  if (isLargeAmount && isNewRecipient) {
    return {
      level: 'medium',
      reason: `Ce montant est 3× supérieur à votre moyenne (${avgAmount.toFixed(0)} USD) et le destinataire est nouveau.`,
      reasonEn: `This amount is 3× your average ($${avgAmount.toFixed(0)}) and the recipient is new.`,
      reasonFon: `Akwɛ élɔ́ hú mɛ nabi é a nɔ sɛ́ dó ayǐ (${avgAmount.toFixed(0)} USD) azɔn atɔn, bɔ mɛ ɔ nyí mɛ yɔyɔ́.`,
    };
  }
  if (recentTxs.length >= 2) {
    return {
      level: 'medium',
      reason: 'Plusieurs transferts détectés en peu de temps. Confirmez que c\'est bien vous.',
      reasonEn: 'Multiple transfers detected in a short time. Please confirm this is you.',
      reasonFon: 'Kwɛ́ nabi ɖé wɛ́ a sɛ́ dó ɖò hwangbe kpɛví ɖé mɛ. Ðɔ nú mǐ nú é nyí hwi jɛ́n ɖò blóbló wɛ.',
    };
  }
  if (isLargeAmount) {
    return {
      level: 'low',
      reason: `Montant plus élevé que d'habitude (moyenne : ${avgAmount.toFixed(0)} USD). Tout va bien ?`,
      reasonEn: `Amount higher than usual (average: $${avgAmount.toFixed(0)}). Everything OK?`,
      reasonFon: `Akwɛ élɔ́ hú nǔ é a nɔ bló ɖò bɛ́mɛ (${avgAmount.toFixed(0)} USD). É ɖò ɖagbe à?`,
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
        labelFon: 'Nǔ é a nɔ bló',
        icon: 'repeat',
        reason: `Votre montant le plus envoyé`,
        reasonFon: 'Akwɛ nabi é a nɔ sɛ́ dó tawun é nɛ́',
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
        labelFon: 'Moyenne',
        icon: 'stats-chart',
        reason: `Votre moyenne habituelle`,
        reasonFon: 'Akwɛ nabi é a nɔ sɛ́ dó é bɛ́ bi',
      });
    }
  }

  // Suggestion calendrier — fin de mois
  if (dayOfMonth >= 25 || dayOfMonth <= 5) {
    suggestions.push({
      amount: 200,
      label: 'Fin de mois',
      labelEn: 'Month-end',
      labelFon: 'Sùn sùpù',
      icon: 'calendar',
      reason: 'Période de fin de mois — envoi courant',
      reasonFon: 'Sùn vívɔ̀ sín hwangbe — akwɛ sɛ́sɛ́ nyɔ́',
    });
  }

  // Rentrée scolaire (août-septembre)
  if (month === 7 || month === 8) {
    suggestions.push({
      amount: 300,
      label: 'Rentrée',
      labelEn: 'Back to school',
      labelFon: 'Azɔ̀mɛ́ yìyì',
      icon: 'school',
      reason: 'Période de rentrée scolaire',
      reasonFon: 'Azɔ̀mɛ́ yìyì sín hwangbe',
    });
  }

  // Fêtes de fin d'année
  if (month === 11 || month === 0) {
    suggestions.push({
      amount: 500,
      label: 'Fêtes',
      labelEn: 'Holidays',
      labelFon: 'Agɔnyìnyì',
      icon: 'gift',
      reason: 'Période des fêtes',
      reasonFon: 'Agɔnyìnyì sín hwangbe',
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
        labelFon: 'Solde ×½',
        icon: 'wallet',
        reason: '50% de votre solde disponible',
        reasonFon: 'Akwɛ towe sín vlɔ́ɖó',
      });
    }
  }

  // Toujours proposer des montants ronds standards
  const standards = [50, 100, 200];
  standards.forEach(amt => {
    if (!suggestions.find(s => s.amount === amt) && amt <= balanceUSD) {
      suggestions.push({
        amount: amt,
        label: `${amt} USD`,
        labelEn: `$${amt}`,
        labelFon: `USD ${amt}`,
        icon: 'cash',
        reason: '',
      });
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
    if (totalTransfers === 0) {
      return 'Sɛ́ akwɛ nukɔntɔn ɔ dó bonú a ná mɔ nǔ e é nɔ bló nú xwédo towe ɖò Bénin é.';
    }
    if (totalTransfers < 5) {
      return `Gbɛ̀ ${totalTransfers} mɛ, a ko hwlɛn akwɛ ${totalSavedUSD.toFixed(2)} USD — nǔ e nyɔ́ nú xwédo towe ɖò Bénin é. 🌍`;
    }
    return `Azɔn ${totalTransfers} wɛ́ a ko sɛ́ akwɛ dó, bɔ a hwlɛn $${totalSavedUSD.toFixed(2)} — é sɔ ágbà nú nǔɖuɖu azɔn ${mealsEquivalent} nú xwédo towe ɖò Cotonou. Mi ɖò azɔ̌ ɖagbe bló wɛ! 🌍`;
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
