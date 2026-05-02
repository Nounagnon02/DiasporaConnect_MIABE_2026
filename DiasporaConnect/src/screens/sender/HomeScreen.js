import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import useStore from '../../store/useStore';
import { MOCK_SENDER_TRANSACTIONS } from '../../services/mockData';
import TransactionItem from '../../components/ui/TransactionItem';

export default function HomeScreen({ navigation }) {
  const { senderUser } = useStore();
  const userName = senderUser?.name || 'Kossi';
  const balanceUSD = 1242.80; // Hardcoded for demo/hero
  const balanceFCFA = balanceUSD * 612.5;

  const formatAmount = (num) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(num);
  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Asymétrique */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {userName}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileInitials}>{userName.charAt(0)}</Text>
          </View>
        </View>

        {/* Hero Balance */}
        <View style={styles.heroSection}>
          <Text style={styles.balanceLabel}>Votre solde</Text>
          <Text style={styles.balanceUSD}>{formatAmount(balanceUSD)} USD</Text>
          <Text style={styles.balanceFCFA}>≈ {formatFCFA(balanceFCFA)} FCFA</Text>
        </View>

        {/* CTA : Faire un transfert (Gold Gradient Card) */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.ctaWrapper}
          onPress={() => navigation.navigate('Calculator')}
        >
          <LinearGradient
            colors={['#755B00', '#C9A84C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Faire un transfert</Text>
              <Text style={styles.ctaSub}>Frais &lt; 1% · Actif sur Celo</Text>
            </View>
            <View style={styles.ctaArrowCircle}>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Économie Folio Card */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsLabel}>Économies réalisées ce mois-ci</Text>
          <Text style={styles.savingsAmount}>41.30 USD</Text>
          <Text style={styles.savingsSub}>Soit environ {formatFCFA(41.30 * 612.5)} FCFA</Text>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transferts récents</Text>
          {MOCK_SENDER_TRANSACTIONS.slice(0, 3).map(tx => (
            <TransactionItem 
              key={tx.id} 
              transaction={tx} 
              onPress={() => navigation.navigate('History')} // En Prod, vers détails
            />
          ))}
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('History')}>
            <Text style={styles.viewAllText}>Voir tout l'historique →</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer for glass nav */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  greeting: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.diffuse,
  },
  profileInitials: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.primary,
  },
  heroSection: {
    marginBottom: spacing.xxl,
  },
  balanceLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  balanceUSD: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.onSurface,
    letterSpacing: letterSpacing.display,
    marginBottom: spacing.xs,
  },
  balanceFCFA: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  ctaWrapper: {
    marginBottom: spacing.xl,
    borderRadius: radius.md,
    ...shadows.diffuse,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  ctaSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ctaArrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrow: {
    fontFamily: fonts.title,
    fontSize: 24,
    color: colors.onPrimary,
  },
  savingsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
    ...shadows.diffuse,
  },
  savingsLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  savingsAmount: {
    fontFamily: fonts.label,
    fontSize: 24,
    color: colors.primary, // Gold highlights
    letterSpacing: letterSpacing.display,
    marginBottom: 2,
  },
  savingsSub: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  transactionsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  viewAllBtn: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  viewAllText: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.primary,
  },
});
