import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../theme/theme';

export default function RatesAlertBanner({ alert, onDismiss, rates }) {
  if (!alert && !rates) return null;

  const isPositive = alert?.type === 'positive';
  const bgColor = isPositive ? 'rgba(117,91,0,0.08)' : 'rgba(186,26,26,0.06)';
  const borderColor = isPositive ? colors.primary : colors.error;
  const iconName = isPositive ? 'trending-up' : 'trending-down';
  const iconColor = isPositive ? colors.primary : colors.error;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      <Ionicons name={iconName} size={16} color={iconColor} style={styles.icon} />
      <View style={styles.content}>
        {alert ? (
          <Text style={styles.message}>{alert.message}</Text>
        ) : (
          <Text style={styles.message}>
            1 EUR = {rates.USD_FCFA ? (rates.USD_FCFA * rates.EUR_USD).toFixed(0) : '655'} FCFA
            {rates.isLive ? ' · En direct' : ' · Estimé'}
          </Text>
        )}
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={14} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  icon: { flexShrink: 0 },
  content: { flex: 1 },
  message: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 17,
  },
  closeBtn: { padding: 4, flexShrink: 0 },
});
