/**
 * SkeletonLoader — Composant de chargement skeleton
 * Utilisation : <SkeletonLoader width={200} height={20} borderRadius={4} />
 * Ou variantes prédéfinies : <SkeletonLoader variant="card" /> | "row" | "avatar"
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';

function SkeletonBase({ width, height, borderRadius = 4, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.surfaceContainerLow, opacity },
        style,
      ]}
    />
  );
}

// Variante carte transaction
function TransactionSkeleton() {
  return (
    <View style={styles.txRow}>
      <SkeletonBase width={44} height={44} borderRadius={22} />
      <View style={styles.txContent}>
        <SkeletonBase width={120} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonBase width={80} height={11} borderRadius={4} />
      </View>
      <SkeletonBase width={60} height={16} borderRadius={4} />
    </View>
  );
}

// Variante balance hero
function BalanceSkeleton() {
  return (
    <View style={styles.balanceBlock}>
      <SkeletonBase width={100} height={13} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonBase width={200} height={40} borderRadius={6} style={{ marginBottom: 6 }} />
      <SkeletonBase width={140} height={15} borderRadius={4} />
    </View>
  );
}

// Variante card générique
function CardSkeleton({ lines = 2 }) {
  return (
    <View style={styles.card}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          width={i === 0 ? '80%' : '55%'}
          height={i === 0 ? 16 : 12}
          borderRadius={4}
          style={{ marginBottom: i < lines - 1 ? 10 : 0 }}
        />
      ))}
    </View>
  );
}

export default function SkeletonLoader({ variant, width, height, borderRadius, style }) {
  if (variant === 'transaction') return <TransactionSkeleton />;
  if (variant === 'balance')     return <BalanceSkeleton />;
  if (variant === 'card')        return <CardSkeleton />;
  return <SkeletonBase width={width} height={height} borderRadius={borderRadius} style={style} />;
}

// Export des variantes pour usage direct
export { TransactionSkeleton, BalanceSkeleton, CardSkeleton };

const styles = StyleSheet.create({
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(208,197,178,0.1)',
  },
  txContent: { flex: 1 },
  balanceBlock: { marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
