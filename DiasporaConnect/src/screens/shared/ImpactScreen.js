import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import ConnectionAnim from '../../components/animations/ConnectionAnim';
import { generateImpactNarrative } from '../../services/aiService';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

const ALL_BADGES = [
  { key: 'first_transfer', icon: '🚀', label: 'Premier envoi', desc: 'Votre 1er transfert' },
  { key: 'saver_100', icon: '💰', label: 'Économiseur', desc: '100 USD économisés' },
  { key: 'saver_500', icon: '🏆', label: 'Champion', desc: '500 USD économisés' },
  { key: 'loyal_5', icon: '⭐', label: 'Fidèle', desc: '5 transferts effectués' },
  { key: 'loyal_10', icon: '💎', label: 'Diamant', desc: '10 transferts effectués' },
  { key: 'referral_1', icon: '🤝', label: 'Ambassadeur', desc: '1 ami parrainé' },
];

const ODDS = [
  { num: '1', title: 'ODD 1 — Fin de la pauvreté', desc: 'Réduction des frais pour les familles les plus vulnérables.' },
  { num: '8', title: 'ODD 8 — Travail décent', desc: "Nous soutenons l'économie béninoise en ramenant plus d'argent dans les ménages." },
  { num: '10', title: 'ODD 10 — Inégalités réduites', desc: 'Démocratisation des services financiers pour tous, y compris en zones rurales.' },
];

const SCENARIOS = [
  { name: 'Kofi (Paris)', amount: 200, savings: 26.20 },
  { name: 'Adjoa (Bruxelles)', amount: 100, savings: 13.10 },
  { name: 'Séraphin (Lyon)', amount: 500, savings: 65.50 },
];

function CounterDisplay({ target, suffix, prefix, style }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setDisplayed(target); clearInterval(interval); }
      else setDisplayed(Math.floor(current));
    }, 1800 / steps);
    return () => clearInterval(interval);
  }, [target]);
  return (
    <Text style={style} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
      {prefix}{displayed.toLocaleString('fr-FR')}{suffix}
    </Text>
  );
}

export default function ImpactScreen({ navigation }) {
  const { impactScore, language } = useStore();
  const earnedBadges = impactScore?.badges || [];
  const narrative = generateImpactNarrative(impactScore, language);

  const formatUSD = (n) => `${(n || 0).toFixed(2)} USD`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>Notre impact{'\n'}ensemble</Text>

        {/* Résumé IA narratif */}
        <View style={styles.aiNarrativeCard}>
          <View style={styles.aiNarrativeHeader}>
            <Text style={styles.aiLabel}>✨ IA</Text>
            <Text style={styles.aiNarrativeTitle}>Votre impact en mots</Text>
          </View>
          <Text style={styles.aiNarrativeText}>{narrative}</Text>
        </View>

        <View style={styles.animContainer}>
          <ConnectionAnim />
        </View>

        {/* Score personnel */}
        <View style={styles.personalCard}>
          <Text style={styles.personalTitle}>Votre impact personnel</Text>
          <View style={styles.personalStats}>
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{formatUSD(impactScore?.totalSavedUSD)}</Text>
              <Text style={styles.personalLabel}>Économisés vs WU</Text>
            </View>
            <View style={styles.personalDivider} />
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{impactScore?.totalTransfers || 0}</Text>
              <Text style={styles.personalLabel}>Transferts</Text>
            </View>
            <View style={styles.personalDivider} />
            <View style={styles.personalStat}>
              <Text style={styles.personalValue}>{impactScore?.co2SavedKg || 0} kg</Text>
              <Text style={styles.personalLabel}>CO₂ évité</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Vos badges</Text>
        <View style={styles.badgesGrid}>
          {ALL_BADGES.map(badge => {
            const earned = earnedBadges.includes(badge.key);
            return (
              <View key={badge.key} style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
                <Text style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>{badge.icon}</Text>
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
        <Text style={styles.sectionTitle}>Impact global DiasporaConnect</Text>
        <View style={styles.countersRow}>
          <View style={styles.counterCard}>
            <CounterDisplay target={1247} suffix="" prefix="" style={styles.counterValue} />
            <Text style={styles.counterLabel} numberOfLines={2}>familles aidées</Text>
          </View>
          <View style={styles.counterCard}>
            <CounterDisplay target={18653} suffix=" $" prefix="" style={styles.counterValue} />
            <Text style={styles.counterLabel} numberOfLines={2}>économisés en frais</Text>
          </View>
        </View>
        <View style={[styles.counterCard, styles.counterCardFull]}>
          <Text style={styles.counterValueLarge}>{'< 1 %'}</Text>
          <Text style={styles.counterLabel}>de frais moyens par transfert</Text>
        </View>

        {/* ODD */}
        <Text style={styles.sectionTitle}>Objectifs de Développement Durable</Text>
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
        <Text style={styles.sectionTitle}>Scénarios concrets</Text>
        {SCENARIOS.map(s => (
          <View key={s.name} style={styles.scenarioCard}>
            <View style={styles.scenarioLeft}>
              <Text style={styles.scenarioName} numberOfLines={1}>{s.name}</Text>
              <Text style={styles.scenarioAmount}>{s.amount} USD envoyés</Text>
            </View>
            <View style={styles.scenarioRight}>
              <Text style={styles.scenarioSavingsLabel}>Économie vs WU</Text>
              <Text style={styles.scenarioSavings}>+{s.savings.toFixed(2)} USD</Text>
            </View>
          </View>
        ))}

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
  aiLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
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
  badgeIcon: { fontSize: 28, marginBottom: 4 },
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
