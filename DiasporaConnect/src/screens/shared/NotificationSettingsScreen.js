/**
 * NotificationSettingsScreen — Préférences de notifications
 */
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';

const NOTIF_SETTINGS = [
  {
    key: 'rateAlert',
    icon: 'trending-up',
    title: 'Alertes taux favorables',
    sub: 'Notifié quand le taux EUR/FCFA est au plus haut',
  },
  {
    key: 'transferSent',
    icon: 'send',
    title: 'Transfert envoyé',
    sub: 'Confirmation après chaque envoi',
  },
  {
    key: 'transferReceived',
    icon: 'wallet',
    title: 'Argent reçu',
    sub: 'Quand le destinataire retire les fonds',
  },
  {
    key: 'recurringReminder',
    icon: 'repeat',
    title: 'Rappels récurrents',
    sub: '24h avant un transfert programmé',
  },
  {
    key: 'securityAlert',
    icon: 'shield-checkmark',
    title: 'Alertes sécurité',
    sub: 'Transactions inhabituelles détectées par l\'IA',
  },
  {
    key: 'weeklyReport',
    icon: 'bar-chart',
    title: 'Rapport hebdomadaire',
    sub: 'Résumé de vos transferts chaque lundi',
  },
];

export default function NotificationSettingsScreen({ navigation }) {
  const { notifSettings, updateNotifSettings } = useStore();

  const toggle = (key) => {
    updateNotifSettings({ [key]: !notifSettings?.[key] });
  };

  const isEnabled = (key) => notifSettings?.[key] !== false; // true par défaut

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroText}>
          Choisissez les alertes que vous souhaitez recevoir.
        </Text>

        <View style={styles.card}>
          {NOTIF_SETTINGS.map((item, index) => (
            <View key={item.key}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.textBlock}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub} numberOfLines={2}>{item.sub}</Text>
                </View>
                <Switch
                  value={isEnabled(item.key)}
                  onValueChange={() => toggle(item.key)}
                  trackColor={{ false: colors.surfaceContainerLow, true: colors.primaryContainer }}
                  thumbColor={isEnabled(item.key) ? colors.primary : colors.outlineVariant}
                />
              </View>
              {index < NOTIF_SETTINGS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Les alertes de taux sont générées par notre IA et envoyées uniquement quand le taux dépasse votre seuil habituel.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  backBtn: { padding: 4, width: 40 },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  heroText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    lineHeight: 21, marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    ...shadows.diffuse, marginBottom: spacing.xl, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  textBlock: { flex: 1 },
  rowTitle: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface, marginBottom: 2 },
  rowSub: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 17 },
  divider: { height: 1, backgroundColor: 'rgba(208,197,178,0.15)', marginLeft: spacing.md + 36 + spacing.md },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.md,
  },
  infoText: {
    flex: 1, fontFamily: fonts.body, fontSize: 12,
    color: colors.onSurfaceVariant, lineHeight: 18,
  },
});
