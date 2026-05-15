/**
 * DiasporaConnect — Notification Service
 * expo-notifications : push locale + scheduling pour transferts récurrents
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import i18n from '../i18n';

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

// Notification immédiate
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

// Notifications prédéfinies de l'app (Localisées)
export const notifyTransferSent = (recipientName, amountFCFA) => {
  const amountStr = new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'fr-FR').format(amountFCFA);
  sendLocalNotification(
    i18n.t('notifications.transferSentTitle'),
    i18n.t('notifications.transferSentBody', { name: recipientName, amount: amountStr })
  );
};

export const notifyTransferReceived = (senderName, amountFCFA) => {
  const amountStr = new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'fr-FR').format(amountFCFA);
  sendLocalNotification(
    i18n.t('notifications.transferReceivedTitle'),
    i18n.t('notifications.transferReceivedBody', { name: senderName, amount: amountStr })
  );
};

export const notifyRateAlert = (message) =>
  sendLocalNotification(i18n.t('notifications.rateAlertTitle'), message);

export const notifyRecurringReminder = (recipientName, amountUSD) =>
  sendLocalNotification(
    i18n.t('notifications.recurringTitle'),
    i18n.t('notifications.recurringBody', { name: recipientName, amount: amountUSD })
  );

// Notification intelligente taux favorable (IA)
export const notifySmartRateAlert = (prediction) => {
  if (!prediction) return;
  const lang = i18n.language;
  const msg = lang === 'en' ? prediction.messageEn : lang === 'fon' ? (prediction.messageFon || prediction.message) : prediction.message;
  if (!msg) return;

  const confidence = Math.round((prediction.confidence || 0.7) * 100);
  sendLocalNotification(
    i18n.t('notifications.iaRateTitle'),
    `${msg} (${i18n.t('common.confidence')}: ${confidence}%)`
  );
};

// Notification rapport hebdomadaire
export const notifyWeeklyReport = (totalSavedUSD, totalTransfers) =>
  sendLocalNotification(
    i18n.t('notifications.weeklyReportTitle'),
    i18n.t('notifications.weeklyReportBody', { transfers: totalTransfers, savings: totalSavedUSD.toFixed(2) })
  );

// Notification sécurité (anomalie IA)
export const notifySecurityAlert = (reason, reasonEn, reasonFon) => {
  const lang = i18n.language;
  const finalReason = lang === 'en' ? reasonEn : lang === 'fon' ? (reasonFon || reason) : reason;
  sendLocalNotification(
    i18n.t('notifications.securityAlertTitle'),
    finalReason
  );
};
