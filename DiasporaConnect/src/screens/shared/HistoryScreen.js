import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import useStore from '../../store/useStore';
import TransactionItem from '../../components/ui/TransactionItem';

const { width } = Dimensions.get('window');

function SkeletonRow() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeletonRow, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '50%', marginTop: 6 }]} />
      </View>
      <View style={styles.skeletonAmount} />
    </Animated.View>
  );
}

function groupByDate(transactions) {
  const now = new Date();
  const today = now.toDateString();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const groups = {
    "Aujourd'hui": [],
    'Cette semaine': [],
    'Ce mois': [],
    'Plus ancien': [],
  };

  transactions.forEach(tx => {
    const d = new Date(tx.date);
    if (d.toDateString() === today) groups["Aujourd'hui"].push(tx);
    else if (d >= weekAgo) groups['Cette semaine'].push(tx);
    else if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear())
      groups['Ce mois'].push(tx);
    else groups['Plus ancien'].push(tx);
  });

  return groups;
}

const FILTERS = [
  ['ALL', 'Tous'],
  ['SENT', 'Envoyés'],
  ['RECEIVED', 'Reçus'],
];

export default function HistoryScreen({ navigation }) {
  const { transactions } = useStore();
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = transactions.filter(tx => {
    if (filter === 'SENT') return tx.type === 'send';
    if (filter === 'RECEIVED') return tx.type === 'receive';
    return true;
  });

  const groups = groupByDate(filtered);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique</Text>
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        {FILTERS.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.pill, filter === key && styles.pillActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.pillText, filter === key && styles.pillTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptyText}>
              Vos transferts apparaîtront ici une fois effectués.
            </Text>
          </View>
        ) : (
          Object.entries(groups).map(([group, txs]) =>
            txs.length === 0 ? null : (
              <View key={group}>
                <Text style={styles.groupLabel}>{group}</Text>
                {txs.map(tx => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
                  />
                ))}
              </View>
            )
          )
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    letterSpacing: -0.56,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerLow,
  },
  pillActive: {
    backgroundColor: 'rgba(117, 91, 0, 0.1)',
  },
  pillText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  pillTextActive: {
    color: colors.primary,
    fontFamily: fonts.title,
  },
  scroll: { paddingHorizontal: spacing.xl },
  groupLabel: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexShrink: 1,
  },
  empty: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerLow,
    flexShrink: 0,
  },
  skeletonContent: { flex: 1 },
  skeletonLine: {
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerLow,
    width: '75%',
  },
  skeletonAmount: {
    width: 64,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerLow,
    flexShrink: 0,
  },
});
