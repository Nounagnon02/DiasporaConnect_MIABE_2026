import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import GoldButton from '../../../components/ui/GoldButton';
import useStore from '../../../store/useStore';

const { width } = Dimensions.get('window');
const API_URL = 'https://api.diasporaconnect.app';

export default function ConfirmScreen({ navigation, route }) {
  const { operator } = route.params || { operator: 'MTN' };
  const { recipientUser, updateRecipientUser, token } = useStore();
  const availableFCFA = recipientUser?.availableFCFA || 131191;
  const [loading, setLoading] = useState(false);

  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/recipient/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: recipientUser?.phone,
          operator,
          amountFCFA: availableFCFA,
        }),
      });
    } catch (e) {
      // Fallback démo
    } finally {
      updateRecipientUser({ availableFCFA: 0 });
      setLoading(false);
      navigation.replace('WithdrawSuccess');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confirmCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Opérateur</Text>
            <Text style={styles.value} numberOfLines={1}>
              {operator === 'MTN' ? '🟡 MTN Money' : '🔵 Moov Money'}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.label}>Numéro de retrait</Text>
            <Text style={styles.valueLabel} numberOfLines={1}>
              {recipientUser?.phone || '+229 97 00 00 00'}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.rowAmount}>
            <Text style={styles.labelBig}>Montant à recevoir</Text>
            <Text
              style={styles.valueNewsreader}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              numberOfLines={1}
            >
              {formatFCFA(availableFCFA)} FCFA
            </Text>
          </View>
        </View>

        <View style={styles.securityBox}>
          <Text style={styles.securityText}>
            🔒 Transaction sécurisée par The Private Ledger. Le montant sera versé sur votre compte mobile money sous 2 minutes.
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          title={loading ? 'Traitement...' : 'Confirmer le retrait'}
          onPress={handleWithdraw}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  confirmCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    ...shadows.diffuse,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rowAmount: {
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(208, 197, 178, 0.15)',
    marginVertical: spacing.xs,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    flexShrink: 0,
  },
  labelBig: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
  },
  value: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  valueLabel: {
    fontFamily: fonts.label,
    fontSize: 15,
    color: colors.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  valueNewsreader: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.onSurface,
    letterSpacing: -0.64,
    marginTop: 4,
  },
  securityBox: {
    padding: spacing.lg,
    backgroundColor: 'rgba(117, 91, 0, 0.05)',
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  securityText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208,197,178,0.15)',
    backgroundColor: colors.surface,
  },
});
