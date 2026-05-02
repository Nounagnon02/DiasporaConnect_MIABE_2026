// ============================================================
// DIASPORA CONNECT — FeeComparison Component
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/theme';

const formatCurrency = (n, currency = 'USD') => {
  if (currency === 'FCFA') {
    return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';
  }
  return '$' + parseFloat(n).toFixed(2);
};

const FeeComparison = ({ calcResult, style }) => {
  if (!calcResult) return null;

  const { amountUSD, diasporaFee, comparison, savings } = calcResult;
  const { westernUnion, moneygram, worldremit } = comparison;

  const rows = [
    {
      name: 'Western Union',
      abbr: 'WU',
      fee: westernUnion.fee,
      feePercent: westernUnion.feePercent,
      gets: westernUnion.recipientGets,
      highlight: false,
      negative: true,
    },
    {
      name: 'MoneyGram',
      abbr: 'MG',
      fee: moneygram.fee,
      feePercent: moneygram.feePercent,
      gets: moneygram.recipientGets,
      highlight: false,
      negative: true,
    },
    {
      name: 'WorldRemit',
      abbr: 'WR',
      fee: worldremit.fee,
      feePercent: worldremit.feePercent,
      gets: worldremit.recipientGets,
      highlight: false,
      negative: true,
    },
    {
      name: 'DiasporaConnect',
      abbr: 'DC',
      fee: diasporaFee,
      feePercent: '< 1',
      gets: calcResult.recipientGets,
      highlight: true,
      negative: false,
    },
  ];

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Comparatif des frais</Text>
        {amountUSD > 0 && (
          <Text style={styles.forAmount}>pour ${amountUSD}</Text>
        )}
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        <Text style={[styles.colHeader, { flex: 2 }]}>Service</Text>
        <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>Frais</Text>
        <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Reçoit</Text>
      </View>

      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.row,
            row.highlight && styles.rowHighlight,
          ]}
        >
          {/* Badge */}
          <View style={[styles.badge, row.highlight ? styles.badgeHighlight : styles.badgeNormal]}>
            <Text style={[styles.badgeText, row.highlight && styles.badgeTextHighlight]}>
              {row.abbr}
            </Text>
          </View>
          <Text
            style={[
              styles.rowName,
              { flex: 1.2 },
              row.highlight && styles.rowNameHighlight,
            ]}
            numberOfLines={1}
          >
            {row.name}
          </Text>
          <Text
            style={[
              styles.rowFee,
              row.negative ? styles.feeNegative : styles.feePositive,
            ]}
          >
            {row.feePercent}%
          </Text>
          <Text
            style={[
              styles.rowGets,
              row.highlight && styles.rowGetsHighlight,
            ]}
          >
            ${parseFloat(row.gets).toFixed(0)}
          </Text>

          {row.highlight && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestText}>✓ Meilleur</Text>
            </View>
          )}
        </View>
      ))}

      {/* Savings Banner */}
      {savings > 0 && (
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsIcon}>💰</Text>
          <Text style={styles.savingsText}>
            Vous économisez{' '}
            <Text style={styles.savingsAmount}>${savings.toFixed(2)}</Text>
            {' '}vs Western Union
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  forAmount: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium,
  },
  colHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  colHeader: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    marginBottom: 4,
    backgroundColor: COLORS.bg,
  },
  rowHighlight: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1.5,
    borderColor: COLORS.accent + '40',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  badgeNormal: { backgroundColor: COLORS.bgSecondary },
  badgeHighlight: { backgroundColor: COLORS.accent },
  badgeText: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.extrabold,
    color: COLORS.textMuted,
  },
  badgeTextHighlight: { color: COLORS.textWhite },
  rowName: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
  },
  rowNameHighlight: { color: COLORS.accent, fontWeight: TYPOGRAPHY.bold },
  rowFee: {
    width: 48,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    textAlign: 'center',
  },
  feeNegative: { color: COLORS.error },
  feePositive: { color: COLORS.accent },
  rowGets: {
    flex: 1,
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    textAlign: 'right',
    color: COLORS.textPrimary,
  },
  rowGetsHighlight: { color: COLORS.accent, fontSize: TYPOGRAPHY.base },
  bestBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: SPACING.xs,
  },
  bestText: { fontSize: 9, fontWeight: TYPOGRAPHY.bold, color: COLORS.textWhite },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  savingsIcon: { fontSize: 18, marginRight: SPACING.sm },
  savingsText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textWhite,
    fontWeight: TYPOGRAPHY.medium,
    flex: 1,
  },
  savingsAmount: { fontWeight: TYPOGRAPHY.extrabold },
});

export default FeeComparison;
