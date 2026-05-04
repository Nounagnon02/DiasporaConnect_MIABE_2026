import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import ConnectionAnim from '../../components/animations/ConnectionAnim';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

function CounterDisplay({ target, suffix, prefix, style }) {
  const [displayed, setDisplayed] = React.useState(0);

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayed(target);
        clearInterval(interval);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <Text style={style} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
      {prefix}{displayed.toLocaleString('fr-FR')}{suffix}
    </Text>
  );
}

const ODDS = [
  {
    num: '1',
    title: 'ODD 1 — Fin de la pauvreté',
    desc: 'Réduction des frais pour les familles les plus vulnérables. Chaque USD économisé compte.',
  },
  {
    num: '8',
    title: 'ODD 8 — Travail décent',
    desc: "Nous soutenons l'économie béninoise en ramenant plus d'argent dans les ménages.",
  },
  {
    num: '10',
    title: 'ODD 10 — Inégalités réduites',
    desc: 'Démocratisation des services financiers pour tous, y compris en zones rurales.',
  },
];

const SCENARIOS = [
  { name: 'Kofi (Paris)', amount: 200, savings: 26.20 },
  { name: 'Adjoa (Bruxelles)', amount: 100, savings: 13.10 },
  { name: 'Séraphin (Lyon)', amount: 500, savings: 65.50 },
];

export default function ImpactScreen({ navigation }) {
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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroTitle}>Notre impact{'\n'}ensemble</Text>

        <View style={styles.animContainer}>
          <ConnectionAnim />
        </View>

        {/* Compteurs — 2 colonnes */}
        <View style={styles.countersRow}>
          <View style={styles.counterCard}>
            <CounterDisplay
              target={1247}
              suffix=""
              prefix=""
              style={styles.counterValue}
            />
            <Text style={styles.counterLabel} numberOfLines={2}>familles aidées</Text>
          </View>
          <View style={styles.counterCard}>
            <CounterDisplay
              target={18653}
              suffix=" $"
              prefix=""
              style={styles.counterValue}
            />
            <Text style={styles.counterLabel} numberOfLines={2}>économisés en frais</Text>
          </View>
        </View>

        <View style={[styles.counterCard, styles.counterCardFull]}>
          <Text style={styles.counterValueLarge}>{'< 1 %'}</Text>
          <Text style={styles.counterLabel}>de frais moyens par transfert</Text>
        </View>

        {/* ODD */}
        <Text style={styles.sectionTitle}>Objectifs de Développement Durable</Text>
        {ODDS.map((odd) => (
          <View key={odd.num} style={styles.oddCard}>
            <View style={styles.oddBadge}>
              <Text style={styles.oddNum}>{odd.num}</Text>
            </View>
            <View style={styles.oddText}>
              <Text style={styles.oddTitle} numberOfLines={2}>{odd.title}</Text>
              <Text style={styles.oddDesc}>{odd.desc}</Text>
            </View>
          </View>
        ))}

        {/* Scénarios */}
        <Text style={styles.sectionTitle}>Scénarios concrets</Text>
        {SCENARIOS.map((s) => (
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: 4, width: 40, alignItems: 'flex-start' },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 30 : 36,
    color: colors.onSurface,
    letterSpacing: -0.72,
    marginBottom: spacing.xl,
    lineHeight: isSmall ? 38 : 44,
    flexShrink: 1,
  },
  animContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  countersRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  counterCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.diffuse,
  },
  counterCardFull: {
    flex: 0,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  counterValue: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 22 : 26,
    color: colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  counterValueLarge: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 34 : 40,
    color: colors.primary,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  counterLabel: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: 17,
    color: colors.onSurface,
    marginBottom: spacing.lg,
    flexShrink: 1,
  },
  oddCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  oddBadge: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(117, 91, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  oddNum: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.primary,
  },
  oddText: { flex: 1 },
  oddTitle: {
    fontFamily: fonts.title,
    fontSize: 13,
    color: colors.onSurface,
    marginBottom: 4,
    lineHeight: 18,
  },
  oddDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  scenarioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    ...shadows.diffuse,
    gap: spacing.sm,
  },
  scenarioLeft: { flex: 1 },
  scenarioName: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurface,
    marginBottom: 2,
  },
  scenarioAmount: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  scenarioRight: { alignItems: 'flex-end', flexShrink: 0 },
  scenarioSavingsLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  scenarioSavings: {
    fontFamily: fonts.label,
    fontSize: 15,
    color: colors.primary,
    letterSpacing: -0.32,
  },
});
