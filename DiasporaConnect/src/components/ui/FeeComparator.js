import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme/theme';

export default function FeeComparator({ calcResult, style }) {
  if (!calcResult) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Comparatif de frais</Text>
      
      {/* Competitors */}
      <View style={styles.row}>
        <Text style={styles.providerName}>Western Union</Text>
        <Text style={styles.providerFee}>${calcResult.wuFee.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.providerName}>MoneyGram</Text>
        <Text style={styles.providerFee}>${calcResult.mgFee.toFixed(2)}</Text>
      </View>

      {/* Diaspora Connect */}
      <View style={styles.highlightRow}>
        <Text style={styles.dcName}>DiasporaConnect</Text>
        <Text style={styles.dcFee}>${calcResult.diasporaFee.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.2)', // outlineVariant 20%
  },
  providerName: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  providerFee: {
    fontFamily: fonts.label,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(117, 91, 0, 0.05)', // Gold faintly
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  dcName: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.primary, // Gold
  },
  dcFee: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.primary, // Gold
  },
});
