// ============================================================
// DIASPORA CONNECT — Card Component
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme';

const Card = ({ children, style, variant = 'default', padding = 'lg' }) => {
  const paddings = {
    none: 0,
    sm: SPACING.md,
    md: SPACING.base,
    lg: SPACING.lg,
    xl: SPACING.xl,
  };

  return (
    <View
      style={[
        styles.card,
        styles[variant],
        { padding: paddings[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    ...SHADOWS.card,
  },
  default: {
    backgroundColor: COLORS.bgCard,
  },
  sand: {
    backgroundColor: COLORS.bgSecondary,
  },
  warm: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  success: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  flat: {
    backgroundColor: COLORS.bgCard,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
});

export default Card;
