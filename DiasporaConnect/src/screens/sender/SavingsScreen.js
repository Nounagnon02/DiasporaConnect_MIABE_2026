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

const ROUND_UP_OPTIONS = [
  { key: 'next_dollar', label: 'Arrondi au dollar supérieur', example: '198.40 → 199 USD (+0.60)' },
  { key: 'next_5', label: 'Arrondi aux 5 USD supérieurs', example: '198.40 → 200 USD (+1.60)' },
  { key: 'fixed_1', label: '1 USD fixe par transfert', example: 'Toujours +1.00 USD' },
];

export default function SavingsScreen({ navigation }) {
  const { savingsPool, addSavingsContribution } = useStore();
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
    new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  const handleWithdraw = () => {
    Alert.alert(
      'Retrait épargne',
      `Retirer ${formatUSD(savingsPool.balanceUSD)} vers votre wallet Celo ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Retirer', onPress: () => Alert.alert('✅ Retrait initié', 'Fonds disponibles dans 2-3 minutes.') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Micro-épargne</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Solde hero */}
        <LinearGradient colors={['#1B1C1A', '#2D2E2B']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Épargne accumulée</Text>
          <Text style={styles.balanceAmount}>{formatUSD(savingsPool.balanceUSD)}</Text>
          <View style={styles.yieldRow}>
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>+{formatUSD(totalYield)}</Text>
              <Text style={styles.yieldLabel}>Intérêts générés</Text>
            </View>
            <View style={styles.yieldDivider} />
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>{savingsPool.yieldPercent}% / an</Text>
              <Text style={styles.yieldLabel}>Taux Celo DeFi</Text>
            </View>
            <View style={styles.yieldDivider} />
            <View style={styles.yieldItem}>
              <Text style={styles.yieldValue}>{formatUSD(projectedAnnual)}</Text>
              <Text style={styles.yieldLabel}>Projection 1 an</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>Retirer l'épargne</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Arrondi automatique */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Arrondi automatique</Text>
          <Switch
            value={roundUpEnabled}
            onValueChange={setRoundUpEnabled}
            trackColor={{ false: colors.surfaceContainerLow, true: 'rgba(117,91,0,0.3)' }}
            thumbColor={roundUpEnabled ? colors.primary : colors.outlineVariant}
          />
        </View>
        <Text style={styles.sectionDesc}>
          À chaque transfert, la différence est automatiquement épargnée sur Celo et génère des intérêts.
        </Text>

        {roundUpEnabled && (
          <View style={styles.optionsCard}>
            {ROUND_UP_OPTIONS.map(opt => (
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
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Historique des contributions</Text>
        {savingsPool.contributions.map((c, i) => (
          <View key={i} style={styles.contribRow}>
            <View style={styles.contribIcon}>
              <Ionicons name="arrow-up" size={14} color={colors.primary} />
            </View>
            <View style={styles.contribInfo}>
              <Text style={styles.contribTx} numberOfLines={1}>Arrondi · {c.txId}</Text>
              <Text style={styles.contribDate}>{formatDate(c.date)}</Text>
            </View>
            <Text style={styles.contribAmount}>+{c.amountUSD.toFixed(2)} USD</Text>
          </View>
        ))}

        {/* Info DeFi */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Les fonds sont déposés sur le protocole Moola Market (Celo). Le taux de 4.2% est indicatif et peut varier selon les conditions du marché.
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
