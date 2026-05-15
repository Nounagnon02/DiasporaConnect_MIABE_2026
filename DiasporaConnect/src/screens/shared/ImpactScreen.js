import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import ConnectionAnim from '../../components/animations/ConnectionAnim';
import { generateImpactNarrative } from '../../services/aiService';
import { useTranslation } from 'react-i18next';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export default function ImpactScreen({ navigation }) {
  const { t } = useTranslation();
  const tabBarHeight = useTabBarHeight();
  const { impactScore, language } = useStore();
  const earnedBadges = impactScore?.badges || [];
  const narrative = generateImpactNarrative(impactScore, language);

  const ALL_BADGES = [
    { key: 'first_transfer', icon: 'rocket-outline', label: t('impact.badges.firstTransfer'), desc: t('impact.badges.firstTransferDesc') },
    { key: 'saver_100', icon: 'cash-outline', label: t('impact.badges.saver100'), desc: t('impact.badges.saver100Desc') },
    { key: 'saver_500', icon: 'trophy-outline', label: t('impact.badges.saver500'), desc: t('impact.badges.saver500Desc') },
    { key: 'loyal_5', icon: 'star-outline', label: t('impact.badges.loyal5'), desc: t('impact.badges.loyal5Desc') },
    { key: 'loyal_10', icon: 'diamond-outline', label: t('impact.badges.loyal10'), desc: t('impact.badges.loyal10Desc') },
    { key: 'referral_1', icon: 'hand-left-outline', label: t('impact.badges.ambassador'), desc: t('impact.badges.ambassadorDesc') },
  ];

  const ODDS = [
    { num: '1', title: t('impact.odd1'), desc: t('impact.odd1Desc') },
    { num: '8', title: t('impact.odd8'), desc: t('impact.odd8Desc') },
    { num: '10', title: t('impact.odd10'), desc: t('impact.odd10Desc') },
  ];

  const SCENARIOS = [
    { name: 'Kofi (Paris)', amount: 200, savings: 26.20 },
    { name: 'Adjoa (Bruxelles)', amount: 100, savings: 13.10 },
    { name: 'Séraphin (Lyon)', amount: 500, savings: 65.50 },
  ];

  const formatUSD = (n) => `${(n || 0).toFixed(2)} USD`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('impact.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>{t('impact.title')}{'\n'}{t('impact.together')}</Text>

        {/* Résumé IA narratif */}
        <View style={styles.aiNarrativeCard}>
          <View style={styles.aiNarrativeHeader}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color={colors.onPrimary} />
              <Text style={styles.aiBadgeText}>IA</Text>
            </View>
            <Text style={styles.aiNarrativeTitle}>{t('impact.aiNarrativeTitle')}</Text>
          </View>
          <Text style={styles.aiNarrativeText}>{narrative}</Text>
        </View>

        <View style={styles.animContainer}>
          <ConnectionAnim />
        </View>

        {/* Score personnel */}
        <View style={styles.personalCard}>
          <Text style={styles.personalTitle}>{t('impact.personalImpact')}</Text>
          <View style={styles.personalStats}>
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{formatUSD(impactScore?.totalSavedUSD)}</Text>
              <Text style={styles.personalLabel}>{t('impact.savedVsWU')}</Text>
            </View>
            <View style={styles.personalDivider} />
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{impactScore?.totalTransfers || 0}</Text>
              <Text style={styles.personalLabel}>{t('impact.transfersCount')}</Text>
            </View>
            <View style={styles.personalDivider} />
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{impactScore?.co2SavedKg || 0} kg</Text>
              <Text style={styles.personalLabel}>CO₂ {t('impact.co2Avoided')}</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>{t('impact.yourBadges')}</Text>
        <View style={styles.badgesGrid}>
          {ALL_BADGES.map(badge => {
            const earned = earnedBadges.includes(badge.key);
            return (
              <View key={badge.key} style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
                <View style={[styles.badgeIconWrapper, !earned && styles.badgeIconLocked]}>
                  <Ionicons name={badge.icon} size={22} color={earned ? colors.primary : colors.onSurfaceVariant} />
                </View>
                <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]} numberOfLines={1}>
                  {badge.label}
                </Text>
                <Text style={styles.badgeDesc} numberOfLines={2}>{badge.desc}</Text>
                {!earned && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={12} color={colors.outlineVariant} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Compteurs globaux */}
        <Text style={styles.sectionTitle}>{t('impact.globalImpactTitle')}</Text>
        <View style={styles.countersRow}>
          <View style={styles.counterCard}>
            <CounterDisplay target={1247} suffix="" prefix="" style={styles.counterValue} />
            <Text style={styles.counterLabel} numberOfLines={2}>{t('impact.familiesHelped')}</Text>
          </View>
          <View style={styles.counterCard}>
            <CounterDisplay target={18653} suffix=" $" prefix="" style={styles.counterValue} />
            <Text style={styles.counterLabel} numberOfLines={2}>{t('impact.totalSavedGlobal')}</Text>
          </View>
        </View>
        <View style={[styles.counterCard, styles.counterCardFull]}>
          <Text style={styles.counterValueLarge}>{'< 1 %'}</Text>
          <Text style={styles.counterLabel}>{t('impact.averageFee')}</Text>
        </View>

        {/* ODD */}
        <Text style={styles.sectionTitle}>{t('impact.sdgTitle')}</Text>
        {ODDS.map(odd => (
          <View key={odd.num} style={styles.oddCard}>
            <View style={styles.oddBadge}><Text style={styles.oddNum}>{odd.num}</Text></View>
            <View style={styles.oddText}>
              <Text style={styles.oddTitle} numberOfLines={2}>{odd.title}</Text>
              <Text style={styles.oddDesc}>{odd.desc}</Text>
            </View>
          </View>
        ))}

        {/* Scénarios */}
        <Text style={styles.sectionTitle}>{t('impact.scenariosTitle')}</Text>
        {SCENARIOS.map(s => (
          <View key={s.name} style={styles.scenarioCard}>
            <View style={styles.scenarioLeft}>
              <Text style={styles.scenarioName} numberOfLines={1}>{s.name}</Text>
              <Text style={styles.scenarioAmount}>{s.amount} USD {t('impact.sentLabel')}</Text>
            </View>
            <View style={styles.scenarioRight}>
              <Text style={styles.scenarioSavingsLabel}>{t('impact.savedVsWU_Short')}</Text>
              <Text style={styles.scenarioSavings}>+{s.savings.toFixed(2)} USD</Text>
            </View>
          </View>
        ))}

        <View style={{ height: tabBarHeight + 16 }} />
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
  backBtn: { padding: 4, width: 40, alignItems: 'flex-start' },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  heroTitle: {
    fontFamily: fonts.display, fontSize: isSmall ? 30 : 36, color: colors.onSurface,
    letterSpacing: -0.72, marginBottom: spacing.xl, lineHeight: isSmall ? 38 : 44,
  },
  animContainer: { alignItems: 'center', marginBottom: spacing.xxl },

  aiNarrativeCard: {
    backgroundColor: 'rgba(117,91,0,0.06)',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  aiNarrativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  aiBadgeText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onPrimary,
  },
  aiNarrativeTitle: {
    fontFamily: fonts.title,
    fontSize: 13,
    color: colors.primary,
  },
  aiNarrativeText: {
    fontFamily: fonts.headline,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  personalCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.xl, ...shadows.diffuse,
  },
  personalTitle: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface, marginBottom: spacing.md },
  personalStats: { flexDirection: 'row', alignItems: 'center' },
  personalStat: { flex: 1, alignItems: 'center' },
  personalValue: { fontFamily: fonts.label, fontSize: 14, color: colors.primary, letterSpacing: -0.28 },
  personalLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, marginTop: 2, textAlign: 'center' },
  personalDivider: { width: 1, height: 28, backgroundColor: 'rgba(208,197,178,0.3)' },

  sectionTitle: {
    fontFamily: fonts.title, fontSize: 17, color: colors.onSurface,
    marginBottom: spacing.lg, marginTop: spacing.sm,
  },

  badgesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl,
  },
  badgeCard: {
    width: (width - spacing.xl * 2 - spacing.sm * 2) / 3,
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.sm, alignItems: 'center', ...shadows.diffuse, position: 'relative',
  },
  badgeCardLocked: { opacity: 0.45 },
  badgeIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeIconLocked: { opacity: 0.5 },
  badgeLabel: { fontFamily: fonts.title, fontSize: 11, color: colors.onSurface, textAlign: 'center' },
  badgeLabelLocked: { color: colors.onSurfaceVariant },
  badgeDesc: { fontFamily: fonts.body, fontSize: 10, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 2, lineHeight: 14 },
  lockOverlay: { position: 'absolute', top: 6, right: 6 },

  countersRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  counterCard: { flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md, padding: spacing.md, ...shadows.diffuse },
  counterCardFull: { flex: 0, marginBottom: spacing.xxl, alignItems: 'center', paddingVertical: spacing.lg },
  counterValue: { fontFamily: fonts.display, fontSize: isSmall ? 22 : 26, color: colors.onSurface, letterSpacing: -0.5, marginBottom: 4 },
  counterValueLarge: { fontFamily: fonts.display, fontSize: isSmall ? 34 : 40, color: colors.primary, letterSpacing: -0.8, marginBottom: 4 },
  counterLabel: { fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant, lineHeight: 16 },

  oddCard: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.md, gap: spacing.md,
  },
  oddBadge: { width: 36, height: 36, borderRadius: 4, backgroundColor: 'rgba(117,91,0,0.1)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  oddNum: { fontFamily: fonts.label, fontSize: 16, color: colors.primary },
  oddText: { flex: 1 },
  oddTitle: { fontFamily: fonts.title, fontSize: 13, color: colors.onSurface, marginBottom: 4, lineHeight: 18 },
  oddDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },

  scenarioCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest, padding: spacing.md,
    borderRadius: radius.md, marginBottom: spacing.md, ...shadows.diffuse, gap: spacing.sm,
  },
  scenarioLeft: { flex: 1 },
  scenarioName: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface, marginBottom: 2 },
  scenarioAmount: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },
  scenarioRight: { alignItems: 'flex-end', flexShrink: 0 },
  scenarioSavingsLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, marginBottom: 2 },
  scenarioSavings: { fontFamily: fonts.label, fontSize: 15, color: colors.primary, letterSpacing: -0.32 },
});
