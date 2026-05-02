// ============================================================
// DIASPORA CONNECT — Badge Component (status indicators)
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';

const statusConfig = {
  completed: {
    bg: COLORS.accentLight,
    text: COLORS.accent,
    label: { fr: 'Complété', en: 'Completed' },
    dot: COLORS.accent,
  },
  pending: {
    bg: '#FFF3E0',
    text: '#E65100',
    label: { fr: 'En cours', en: 'Pending' },
    dot: '#E65100',
  },
  failed: {
    bg: COLORS.errorBg,
    text: COLORS.errorText,
    label: { fr: 'Échoué', en: 'Failed' },
    dot: COLORS.error,
  },
  available: {
    bg: COLORS.accentLight,
    text: COLORS.accent,
    label: { fr: 'Disponible', en: 'Available' },
    dot: COLORS.accent,
  },
  withdrawn: {
    bg: COLORS.bgSecondary,
    text: COLORS.textSecondary,
    label: { fr: 'Retiré', en: 'Withdrawn' },
    dot: COLORS.textMuted,
  },
  processing: {
    bg: '#FFF3E0',
    text: '#E65100',
    label: { fr: 'Traitement', en: 'Processing' },
    dot: '#E65100',
  },
};

const Badge = ({ status = 'completed', lang = 'fr', style }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const label = config.label[lang] || config.label.fr;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.text, { color: config.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.3,
  },
});

export default Badge;
