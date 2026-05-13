/**
 * DiasporaConnect — Notification Service
 * expo-notifications : push locale + scheduling pour transferts récurrents
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermission = async () => {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Notification immédiate — ex: transfert reçu côté destinataire
export const sendLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null, // immédiat
  });
};

// Notification programmée — pour les transferts récurrents
export const scheduleRecurringNotification = async (title, body, dayOfMonth) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: 'calendar',
      day: dayOfMonth,
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
  return id;
};

export const cancelNotification = async (id) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};

// Notifications prédéfinies de l'app
export const notifyTransferSent = (recipientName, amountFCFA) =>
  sendLocalNotification(
    '✅ Transfert envoyé',
    `${recipientName} recevra ${new Intl.NumberFormat('fr-FR').format(amountFCFA)} FCFA`
  );

export const notifyTransferReceived = (senderName, amountFCFA) =>
  sendLocalNotification(
    '💰 Argent reçu !',
    `${senderName} vous a envoyé ${new Intl.NumberFormat('fr-FR').format(amountFCFA)} FCFA`
  );

export const notifyRateAlert = (message) =>
  sendLocalNotification('📈 Alerte taux de change', message);

export const notifyRecurringReminder = (recipientName, amountUSD) =>
  sendLocalNotification(
    '🔄 Transfert récurrent',
    `Rappel : envoyer ${amountUSD} USD à ${recipientName} ce mois-ci`
  );

// Notification intelligente taux favorable (IA)
export const notifySmartRateAlert = (prediction) => {
  if (!prediction?.message) return;
  const confidence = Math.round((prediction.confidence || 0.7) * 100);
  sendLocalNotification(
    '✨ IA — Taux favorable détecté',
    `${prediction.message} (Confiance : ${confidence}%)`
  );
};

// Notification rapport hebdomadaire
export const notifyWeeklyReport = (totalSavedUSD, totalTransfers) =>
  sendLocalNotification(
    '📊 Votre rapport de la semaine',
    `${totalTransfers} transfert(s) · ${totalSavedUSD.toFixed(2)} USD économisés en frais cette semaine.`
  );

// Notification sécurité (anomalie IA)
export const notifySecurityAlert = (reason) =>
  sendLocalNotification(
    '🚨 Alerte sécurité DiasporaConnect',
    reason
  );
