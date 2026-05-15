// ============================================================
// DIASPORA CONNECT — TransactionItem & StepIndicator
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/theme';
import Badge from './Badge';

// ---- TransactionItem ----
export const TransactionItem = ({ transaction, onPress, lang = 'fr' }) => {
  const { recipient, amountUSD, amountFCFA, status, date, fee, operator } = transaction;
  const initials = recipient
    ? recipient.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const avatarColors = [COLORS.primary, COLORS.accent, COLORS.secondary, '#6B4226'];
  const colorIndex = (recipient?.charCodeAt(0) || 0) % avatarColors.length;

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(n);

  return (
    <TouchableOpacity style={styles.txItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txRecipient} numberOfLines={1}>{recipient}</Text>
        <Text style={styles.txMeta}>{operator} · {formatDate(date)}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={styles.txAmount}>-${amountUSD}</Text>
        <Text style={styles.txFcfa}>{formatFCFA(amountFCFA)} F</Text>
        <View style={styles.txBadge}>
          <Badge status={status} lang={lang} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ---- StepIndicator ----
export const StepIndicator = ({ totalSteps = 4, currentStep = 1, labels = [] }) => {
  return (
    <View style={styles.stepWrapper}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={i}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={COLORS.onPrimary} />
                ) : (
                  <Text
                    style={[
                      styles.stepNum,
                      isActive && styles.stepNumActive,
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
              {labels[i] && (
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {labels[i]}
                </Text>
              )}
            </View>
            {i < totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // TransactionItem
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.textWhite,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
  },
  txInfo: { flex: 1, marginRight: SPACING.sm },
  txRecipient: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  txMeta: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium,
  },
  txRight: { alignItems: 'flex-end' },
  txAmount: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  txFcfa: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  txBadge: {},

  // StepIndicator
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
  },
  stepItem: { alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  stepCircleCompleted: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent,
  },
  stepNum: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textMuted,
  },
  stepNumActive: { color: COLORS.textWhite },
  stepCheck: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textWhite,
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 4,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.medium,
    maxWidth: 55,
    textAlign: 'center',
  },
  stepLabelActive: { color: COLORS.primary, fontWeight: TYPOGRAPHY.bold },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginBottom: 16,
    maxWidth: 30,
  },
  stepLineCompleted: { backgroundColor: COLORS.accent },
});
