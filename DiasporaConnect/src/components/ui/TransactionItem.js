import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../theme/theme';
import Badge from './Badge';

export default function TransactionItem({ transaction, onPress }) {
  const isSend = transaction.type === 'send';
  const amountStr = new Intl.NumberFormat('fr-FR').format(transaction.amountFCFA || 0);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isSend ? '↗' : '↙'}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>
            {transaction.recipient || transaction.sender || 'Inconnu'}
          </Text>
          <Text style={styles.date}>
            {new Date(transaction.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isSend ? colors.onSurface : colors.primary }]}>
          {isSend ? '-' : '+'}{amountStr} FCFA
        </Text>
        <Badge status={transaction.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.15)', // outlineVariant 15% 
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontFamily: fonts.label,
    fontSize: 18,
    color: colors.onSurfaceVariant,
  },
  details: {
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 2,
  },
  date: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: fonts.label,
    fontSize: 16,
    letterSpacing: -0.02,
    marginBottom: 4,
  },
});
