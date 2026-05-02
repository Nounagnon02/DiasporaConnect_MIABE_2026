import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import useStore from '../../store/useStore';
import TransactionItem from '../../components/ui/TransactionItem';

export default function HistoryScreen() {
  const { transactions } = useStore();
  const [filter, setFilter] = useState('ALL');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique</Text>
      </View>

      <View style={styles.filters}>
        {['ALL', 'SENT', 'RECEIVED'].map(f => (
          <TouchableOpacity 
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'ALL' ? 'Tous' : f === 'SENT' ? 'Envoyés' : 'Reçus'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune transaction pour le moment.</Text>
          </View>
        ) : (
          transactions.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} onPress={() => {}} />
          ))
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    letterSpacing: -0.02,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceContainerLow,
  },
  filterPillActive: {
    backgroundColor: 'rgba(117, 91, 0, 0.1)', // Gold faint
  },
  filterText: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: colors.primary, // Gold
  },
  scroll: {
    paddingHorizontal: spacing.xl,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
  },
});
