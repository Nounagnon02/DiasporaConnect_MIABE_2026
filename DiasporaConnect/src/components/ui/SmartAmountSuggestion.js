/**
 * SmartAmountSuggestion — Suggestions IA de montant
 * Basé sur l'historique, le calendrier et le solde
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import { getSmartSuggestions } from '../../services/aiService';
import useStore from '../../store/useStore';

export default function SmartAmountSuggestion({ onSelect }) {
  const { t } = useTranslation();
  const { transactions, language } = useStore();
  const isEn = language === 'en';
  const isFon = language === 'fon';

  const suggestions = getSmartSuggestions(transactions, 1242.80);
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.aiLabel}>
          <Ionicons name="sparkles" size={12} color={colors.onPrimary} />
          <Text style={styles.aiLabelText}>IA</Text>
        </View>
        <Text style={styles.label}>{t('calculator.smartSuggestions')}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {suggestions.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.chip}
            onPress={() => onSelect(s.amount)}
            activeOpacity={0.75}
          >
            <Ionicons name={s.icon} size={18} color={colors.primary} />
            <Text style={styles.chipAmount}>{s.amount} USD</Text>
            <Text style={styles.chipLabel} numberOfLines={1}>
              {isFon ? s.labelFon : isEn ? s.labelEn : s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    fontFamily: fonts.label,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
  },
  aiLabelText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onPrimary,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  row: { gap: spacing.sm, paddingRight: spacing.sm },
  chip: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(117,91,0,0.12)',
    gap: 4,
  },
  chipAmount: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: -0.26,
  },
  chipLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
