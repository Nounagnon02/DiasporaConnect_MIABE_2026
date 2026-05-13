import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import useStore from '../../store/useStore';
import { MOCK_TRANSACTIONS } from '../../services/mockData';
import TransactionItem from '../../components/ui/TransactionItem';
import { GlassCard } from '../../components/ui/GlassCard';
import ArrowIcon from '../../components/ui/ArrowIcon';
import RatesAlertBanner from '../../components/ui/RatesAlertBanner';
import RateChart from '../../components/ui/RateChart';
import { predictRateTrend } from '../../services/aiService';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import NetworkStatus from '../../components/ui/NetworkStatus';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export default function HomeScreen({ navigation }) {
  const { senderUser, rates, rateAlert, refreshRates, dismissRateAlert, impactScore, transactions, language, isOfflineMode } = useStore();
  const userName = senderUser?.name || 'Kossi';
  const balanceUSD = 1242.80;
  const balanceFCFA = balanceUSD * (rates?.USD_FCFA || 612.5);
  const isEn = language === 'en';
  const [ratesLoading, setRatesLoading] = React.useState(true);

  // Prédiction IA du taux (simulé avec historique mock)
  const ratesHistory = [
    { EUR_USD: 1.06 }, { EUR_USD: 1.07 }, { EUR_USD: 1.075 },
    { EUR_USD: rates?.EUR_USD || 1.08 },
  ];
  const ratePrediction = predictRateTrend(ratesHistory);

  useEffect(() => {
    refreshRates().finally(() => setRatesLoading(false));
  }, []);

  const scale = useRef(new Animated.Value(1)).current;
  const animatedStyle = { transform: [{ scale }] };
  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const formatAmount = (num) =>
    new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(num);
  const formatFCFA = (num) =>
    new Intl.NumberFormat('fr-FR').format(Math.round(num));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingSmall}>Bonjour,</Text>
            <Text style={styles.greeting} numberOfLines={1}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitials}>{userName.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur réseau */}
        <NetworkStatus />

        {/* Bannière taux */}}
        {rateAlert ? (
          <RatesAlertBanner alert={rateAlert} onDismiss={dismissRateAlert} />
        ) : (
          <RatesAlertBanner rates={rates} />
        )}

        {/* Prédiction IA du taux */}
        {ratePrediction?.message && (
          <View style={styles.aiPredictionBanner}>
            <Text style={styles.aiPredictionLabel}>✨ IA</Text>
            <Text style={styles.aiPredictionText} numberOfLines={2}>
              {isEn ? ratePrediction.messageEn : ratePrediction.message}
            </Text>
            {ratePrediction.bestTimeHours > 0 && (
              <View style={styles.aiConfidenceBadge}>
                <Text style={styles.aiConfidenceText}>
                  {Math.round(ratePrediction.confidence * 100)}% confiance
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Hero Balance */}
        {ratesLoading ? (
          <SkeletonLoader variant="balance" />
        ) : (
          <View style={styles.heroSection}>
            <Text style={styles.balanceLabel}>Votre solde</Text>
            <Text style={styles.balanceUSD} adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={1}>
              {formatAmount(balanceUSD)} USD
            </Text>
            <Text style={styles.balanceFCFA} numberOfLines={1}>
              ≈ {formatFCFA(balanceFCFA)} FCFA
            </Text>
          </View>
        )}

        {/* CTA Transfert */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.ctaWrapper}
          onPress={() => navigation.navigate('Calculator')}
        >
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={['#755B00', '#C9A84C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle} numberOfLines={1}>Faire un transfert</Text>
                <Text style={styles.ctaSub} numberOfLines={1}>Frais {'<'} 1 % · Actif sur Celo</Text>
              </View>
              <View style={styles.ctaArrowCircle}>
                <ArrowIcon color="#FFFFFF" size={18} thickness={2} />
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Économies + Score */}
        <GlassCard style={styles.savingsCard}>
          <Text style={styles.savingsLabel}>Économies réalisées ce mois-ci</Text>
          <Text style={styles.savingsAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            41.30 USD
          </Text>
          <Text style={styles.savingsSub} numberOfLines={2}>
            Soit environ {formatFCFA(41.30 * (rates?.USD_FCFA || 612.5))} FCFA économisés
          </Text>
        </GlassCard>

        {/* Raccourcis nouvelles fonctionnalités */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Recurring')}>
            <Ionicons name="repeat" size={20} color={colors.primary} />
            <Text style={styles.shortcutLabel}>Récurrent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Savings')}>
            <Ionicons name="wallet" size={20} color={colors.primary} />
            <Text style={styles.shortcutLabel}>Épargne</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Referral')}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.shortcutLabel}>Parrainage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Impact')}>
            <Ionicons name="earth" size={20} color={colors.primary} />
            <Text style={styles.shortcutLabel}>Impact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcut} onPress={() => navigation.navigate('Beneficiaries')}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.shortcutLabel}>Contacts</Text>
          </TouchableOpacity>
        </View>

        {/* Graphique taux */}
        <RateChart style={{ marginBottom: spacing.xl }} />

        {/* Transactions récentes */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transferts récents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {MOCK_TRANSACTIONS.slice(0, 3).map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerLeft: { flex: 1, marginRight: spacing.md },
  greetingSmall: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant },
  greeting: { fontFamily: fonts.title, fontSize: 20, color: colors.onSurface },
  profileBadge: {
    width: 44, height: 44, borderRadius: radius.round,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    ...shadows.diffuse,
  },
  profileInitials: { fontFamily: fonts.title, fontSize: 16, color: colors.primary },
  heroSection: { marginBottom: spacing.xl },
  balanceLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  balanceUSD: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 34 : 40,
    color: colors.onSurface,
    letterSpacing: letterSpacing.display,
    marginBottom: spacing.xs,
  },
  balanceFCFA: { fontFamily: fonts.label, fontSize: 15, color: colors.onSurfaceVariant },
  ctaWrapper: { marginBottom: spacing.xl, borderRadius: radius.md, ...shadows.diffuse },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg, borderRadius: radius.md,
  },
  ctaTextContainer: { flex: 1, marginRight: spacing.md },
  ctaTitle: { fontFamily: fonts.title, fontSize: isSmall ? 17 : 20, color: colors.onPrimary, marginBottom: spacing.xs },
  ctaSub: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  ctaArrowCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  savingsCard: { marginBottom: spacing.xl, padding: spacing.lg },
  savingsLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  savingsAmount: {
    fontFamily: fonts.label, fontSize: isSmall ? 20 : 24,
    color: colors.primary, letterSpacing: letterSpacing.display, marginBottom: 2,
  },
  savingsSub: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 17 },
  shortcutsRow: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl,
  },
  shortcut: {
    flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.sm, alignItems: 'center', gap: 4, ...shadows.glass,
  },
  shortcutLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.onSurfaceVariant, textAlign: 'center' },
  transactionsSection: { marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.title, fontSize: 17, color: colors.onSurface },
  seeAll: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },

  aiPredictionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(117,91,0,0.06)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryContainer,
  },
  aiPredictionLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
    flexShrink: 0,
  },
  aiPredictionText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 18,
  },
  aiConfidenceBadge: {
    backgroundColor: 'rgba(117,91,0,0.1)',
    borderRadius: radius.round,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  aiConfidenceText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
  },
});
