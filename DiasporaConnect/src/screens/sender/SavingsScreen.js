import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';

const ROUND_UP_OPTIONS = (t) => [
  { key: 'next_dollar', label: t('savingsPage.option1'), example: t('savingsPage.option1Ex') },
  { key: 'next_5',      label: t('savingsPage.option2'), example: t('savingsPage.option2Ex') },
  { key: 'fixed_1',     label: t('savingsPage.option3'), example: t('savingsPage.option3Ex') },
];

export default function SavingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { savingsPool, addSavingsContribution, language } = useStore();
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState('next_dollar');

  const totalYield = parseFloat(
    ((savingsPool.balanceUSD * savingsPool.yieldPercent) / 100).toFixed(2)
  );
  const projectedAnnual = parseFloat(
    (savingsPool.balanceUSD * (1 + savingsPool.yieldPercent / 100)).toFixed(2)
  );

  const formatUSD = (n) => `${(n || 0).toFixed(2)} USD`;
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' });

  const handleWithdraw = () => {
    Alert.alert(
      t('savingsPage.withdrawTitle'),
      t('savingsPage.withdrawConfirm', { amount: formatUSD(savingsPool.balanceUSD) }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => Alert.alert(t('savingsPage.withdrawSuccess'), t('savingsPage.withdrawSuccessDesc')) },
      ]
    );
  };

  const options = ROUND_UP_OPTIONS(t);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('savingsPage.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Solde hero */}
        <LinearGradient colors={['#1B1C1A', '#2D2E2B']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('savingsPage.accumulated')}</Text>
          <Text style={styles.balanceAmount}>{formatUSD(savingsPool.balanceUSD)}</Text>
          <View style={styles.yieldRow}>
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>+{formatUSD(totalYield)}</Text>
              <Text style={styles.yieldLabel}>{t('savingsPage.yieldGenerated')}</Text>
            </View>
            <View style={styles.yieldDivider} />
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>{savingsPool.yieldPercent}% / an</Text>
              <Text style={styles.yieldLabel}>{t('savingsPage.celoYield')}</Text>
            </View>
            <View style={styles.yieldDivider} />
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>{formatUSD(projectedAnnual)}</Text>
              <Text style={styles.yieldLabel}>{t('savingsPage.projection')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>{t('savingsPage.withdrawBtn')}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Arrondi automatique */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('savingsPage.autoRound')}</Text>
          <Switch
            value={roundUpEnabled}
            onValueChange={setRoundUpEnabled}
            trackColor={{ false: colors.surfaceContainerLow, true: 'rgba(117,91,0,0.3)' }}
            thumbColor={roundUpEnabled ? colors.primary : colors.outlineVariant}
          />
        </View>
        <Text style={styles.sectionDesc}>
          {t('savingsPage.autoRoundDesc')}
        </Text>

        {roundUpEnabled && (
          <View style={styles.optionsCard}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionRow, selectedOption === opt.key && styles.optionRowActive]}
                onPress={() => setSelectedOption(opt.key)}
              >
                <View style={styles.optionLeft}>
                  <Text style={[styles.optionLabel, selectedOption === opt.key && styles.optionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.optionExample}>{opt.example}</Text>
                </View>
                {selectedOption === opt.key && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Historique contributions */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>{t('savingsPage.history')}</Text>
        {savingsPool.contributions.map((c, i) => (
          <View key={i} style={styles.contribRow}>
            <View style={styles.contribIcon}>
              <Ionicons name="arrow-up" size={14} color={colors.primary} />
            </View>
            <View style={styles.contribInfo}>
              <Text style={styles.contribTx} numberOfLines={1}>{t('savingsPage.roundUp')} · {c.txId}</Text>
              <Text style={styles.contribDate}>{formatDate(c.date)}</Text>
            </View>
            <Text style={styles.contribAmount}>+{c.amountUSD.toFixed(2)} USD</Text>
          </View>
        ))}

        {/* Info DeFi */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.infoText}>
            {t('savingsPage.defiNote')}
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
  headerTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.onSurface, letterSpacing: -0.4 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  balanceCard: {
    borderRadius: radius.md, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.diffuse,
  },
  balanceLabel: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: spacing.xs },
  balanceAmount: { fontFamily: fonts.display, fontSize: 36, color: '#FFF', letterSpacing: -0.72, marginBottom: spacing.xl },
  yieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  yieldItem: { flex: 1, alignItems: 'center' },
  yieldValue: { fontFamily: fonts.label, fontSize: 14, color: '#FFF' },
  yieldLabel: { fontFamily: fonts.body, fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2, textAlign: 'center' },
  yieldDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  withdrawBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.sm,
    paddingVertical: spacing.sm, alignItems: 'center',
  },
  withdrawText: { fontFamily: fonts.title, fontSize: 14, color: '#FFF' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  sectionTitle: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface },
  sectionDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 19, marginBottom: spacing.md },

  optionsCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    overflow: 'hidden', ...shadows.diffuse, marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(208,197,178,0.15)',
  },
  optionRowActive: { backgroundColor: 'rgba(117,91,0,0.05)' },
  optionLeft: { flex: 1 },
  optionLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurface },
  optionLabelActive: { fontFamily: fonts.title, color: colors.primary },
  optionExample: { fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant, marginTop: 2 },

  contribRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(208,197,178,0.1)',
  },
  contribIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(117,91,0,0.1)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  contribInfo: { flex: 1 },
  contribTx: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurface },
  contribDate: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 },
  contribAmount: { fontFamily: fonts.label, fontSize: 13, color: colors.primary, flexShrink: 0 },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.sm,
    padding: spacing.md, marginTop: spacing.xl,
  },
  infoText: { flex: 1, fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, lineHeight: 17 },
});
