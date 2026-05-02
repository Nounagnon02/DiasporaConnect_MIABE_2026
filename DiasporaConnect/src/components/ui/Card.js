import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, shadows, radius, spacing } from '../../theme/theme';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.sm, // Or radius.md based on spec max 8px
    padding: spacing.lg, // Minimum 24px padding internal
    ...shadows.diffuse, // Strong 0px 24px 48px diffuse shadow
  },
});
