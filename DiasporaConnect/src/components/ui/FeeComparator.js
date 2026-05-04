import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme/theme';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

const OPERATORS = [
  { name: 'Western Union', feePct: 0.14, delay: 0 },
  { name: 'MoneyGram',     feePct: 0.11, delay: 120 },
  { name: 'WorldRemit',    feePct: 0.07, delay: 240 },
  { name: 'Banque SWIFT',  feePct: 0.18, delay: 360 },
];

function OperatorRow({ name, fee, received, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 300, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateX }] }]}>
      <Text style={styles.opName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      <Text style={styles.opFee} numberOfLines={1}>−{fee.toFixed(2)}</Text>
      <Text style={styles.opReceived} numberOfLines={1}>{received.toFixed(2)}</Text>
    </Animated.View>
  );
}

export default function FeeComparator({ calcResult, style }) {
  if (!calcResult || calcResult.amountUSD <= 0) return null;

  const { amountUSD, diasporaFee, recipientGets } = calcResult;

  const dcOpacity = useRef(new Animated.Value(0)).current;
  const dcScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(dcOpacity, { toValue: 1, duration: 350, delay: 480, useNativeDriver: true }),
      Animated.timing(dcScale, { toValue: 1, duration: 350, delay: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* En-tête colonnes */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerLabel, styles.colName]}>Opérateur</Text>
        <Text style={[styles.headerLabel, styles.colFee]}>Frais</Text>
        <Text style={[styles.headerLabel, styles.colReceived]}>Reçu (USD)</Text>
      </View>

      {OPERATORS.map((op) => (
        <OperatorRow
          key={op.name}
          name={op.name}
          fee={amountUSD * op.feePct}
          received={amountUSD - amountUSD * op.feePct}
          delay={op.delay}
        />
      ))}

      {/* Ligne DiasporaConnect */}
      <Animated.View style={[styles.dcRow, { opacity: dcOpacity, transform: [{ scale: dcScale }] }]}>
        <View style={styles.dcLeft}>
          <Text style={styles.dcName} numberOfLines={1}>DiasporaConnect</Text>
          <View style={styles.dcBadgeWrap}>
            <Text style={styles.dcBadge}>{'< 1 %'}</Text>
          </View>
        </View>
        <Text style={styles.dcFee} numberOfLines={1}>−{diasporaFee.toFixed(2)}</Text>
        <Text style={styles.dcReceived} numberOfLines={1}>{recipientGets.toFixed(2)}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colName: { flex: 1, marginRight: spacing.sm },
  colFee: { width: isSmall ? 52 : 64, textAlign: 'right' },
  colReceived: { width: isSmall ? 60 : 72, textAlign: 'right' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.sm,
    marginBottom: 2,
    borderRadius: 4,
  },
  opName: {
    fontFamily: fonts.body,
    fontSize: isSmall ? 12 : 13,
    color: colors.onSurfaceVariant,
    flex: 1,
    marginRight: spacing.sm,
  },
  opFee: {
    fontFamily: fonts.label,
    fontSize: isSmall ? 11 : 12,
    color: colors.onSurfaceVariant,
    width: isSmall ? 52 : 64,
    textAlign: 'right',
  },
  opReceived: {
    fontFamily: fonts.label,
    fontSize: isSmall ? 11 : 12,
    color: colors.onSurface,
    width: isSmall ? 60 : 72,
    textAlign: 'right',
  },
  dcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    backgroundColor: 'rgba(117, 91, 0, 0.08)',
    marginHorizontal: spacing.sm,
    marginTop: 2,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dcLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    gap: 6,
    overflow: 'hidden',
  },
  dcName: {
    fontFamily: fonts.title,
    fontSize: isSmall ? 12 : 13,
    color: colors.primary,
    flexShrink: 1,
  },
  dcBadgeWrap: { flexShrink: 0 },
  dcBadge: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    backgroundColor: 'rgba(117, 91, 0, 0.12)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dcFee: {
    fontFamily: fonts.label,
    fontSize: isSmall ? 11 : 12,
    color: colors.primary,
    width: isSmall ? 52 : 64,
    textAlign: 'right',
  },
  dcReceived: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 12 : 14,
    color: colors.primary,
    letterSpacing: -0.3,
    width: isSmall ? 60 : 72,
    textAlign: 'right',
  },
});
