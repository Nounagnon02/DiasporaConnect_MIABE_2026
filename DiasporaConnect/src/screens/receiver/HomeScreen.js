import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import useStore from '../../store/useStore';
import { MOCK_RECIPIENT_TRANSACTIONS } from '../../services/mockData';
import TransactionItem from '../../components/ui/TransactionItem';
import ArrowIcon from '../../components/ui/ArrowIcon';

const { width } = Dimensions.get('window');
const isSmall = width < 380;
const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

const INFO_ITEMS = [
  { icon: 'flash',        label: 'Instantané' },
  { icon: 'lock-closed',  label: 'Sécurisé'   },
  { icon: 'cash',         label: 'Sans frais'  },
];

export default function ReceiverHomeScreen({ navigation }) {
  const { recipientUser } = useStore();
  const userName = recipientUser?.firstName || 'Adjoua';
  const availableFCFA = recipientUser?.availableFCFA || 131191;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingSmall}>Bonjour,</Text>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitials}>{userName.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero solde */}
        <View style={styles.heroSection}>
          <Text style={styles.balanceLabel}>Disponible à retirer</Text>
          <Text
            style={styles.balanceFCFA}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            numberOfLines={1}
          >
            {formatFCFA(availableFCFA)} FCFA
          </Text>
        </View>

        {/* CTA Retrait */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.ctaWrapper}
          onPress={() => navigation.navigate('Withdraw', { screen: 'WithdrawOperator' })}
        >
          <LinearGradient
            colors={['#755B00', '#C9A84C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaCard}
          >
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle} numberOfLines={1}>Retirer maintenant</Text>
              <Text style={styles.ctaSub} numberOfLines={1}>Vers MTN ou Moov Money</Text>
            </View>
            <View style={styles.ctaArrowCircle}>
              <ArrowIcon color="#FFFFFF" size={18} thickness={2} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info rapide — Ionicons */}
        <View style={styles.infoRow}>
          {INFO_ITEMS.map((item) => (
            <View key={item.label} style={styles.infoCard}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Transactions reçues */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transferts reçus</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {MOCK_RECIPIENT_TRANSACTIONS.map(tx => (
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
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.xl,
  },
  headerLeft: { flex: 1, marginRight: spacing.md },
  greetingSmall: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant },
  userName: { fontFamily: fonts.display, fontSize: isSmall ? 20 : 24, color: colors.onSurface },
  profileBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    ...shadows.diffuse,
  },
  profileInitials: { fontFamily: fonts.title, fontSize: 18, color: colors.primary },
  heroSection: { marginBottom: spacing.xl },
  balanceLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginBottom: spacing.xs },
  balanceFCFA: {
    fontFamily: fonts.display, fontSize: isSmall ? 32 : 40,
    color: colors.onSurface, letterSpacing: letterSpacing.display,
  },
  ctaWrapper: { marginBottom: spacing.lg, borderRadius: radius.md, ...shadows.diffuse },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.lg, borderRadius: radius.md,
  },
  ctaTextContainer: { flex: 1, marginRight: spacing.md },
  ctaTitle: { fontFamily: fonts.title, fontSize: isSmall ? 17 : 20, color: colors.onPrimary, marginBottom: 2 },
  ctaSub: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  ctaArrowCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  infoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  infoCard: {
    flex: 1, backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', gap: 6,
  },
  infoLabel: { fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant, textAlign: 'center' },
  transactionsSection: { marginTop: spacing.sm },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: fonts.title, fontSize: 17, color: colors.onSurface },
  seeAll: { fontFamily: fonts.label, fontSize: 12, color: colors.primary },
});
