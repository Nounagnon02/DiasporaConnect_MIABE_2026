import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import StepIndicator from '../../../components/ui/StepIndicator';
import GoldButton from '../../../components/ui/GoldButton';
import useStore from '../../../store/useStore';

const { width } = Dimensions.get('window');
const STEP_LABELS = ['Montant', 'Destinataire', 'Confirmation', 'Succès'];

export default function Step3Screen({ navigation }) {
  const { transferData, addTransaction, updateTransferData, senderUser } = useStore();
  const [loading, setLoading] = useState(false);

  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));

      const mockTxHash = '0x' + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      updateTransferData({ txHash: mockTxHash, status: 'completed' });
      addTransaction({
        id: `tx_${Date.now()}`,
        txHashFull: mockTxHash,
        txHash: mockTxHash.slice(0, 10) + '...' + mockTxHash.slice(-8),
        type: 'send',
        amountUSD: transferData.amountUSD,
        amountFCFA: transferData.amountFCFA,
        fee: transferData.fee,
        recipient: transferData.recipient?.name || transferData.recipient?.phone || 'Inconnu',
        recipientPhone: transferData.recipient?.phone || '',
        operator: transferData.operator || 'MTN',
        date: new Date().toISOString(),
        status: 'completed',
        network: 'Celo Alfajores',
        confirmations: 1,
        savedVsWU: transferData.savings || 0,
      });
      navigation.replace('SendStep4');
    } catch (e) {
      Alert.alert('Erreur', 'Le transfert a échoué. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={3} labels={STEP_LABELS} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Récapitulatif */}
        <View style={styles.recapCard}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Montant envoyé</Text>
            <Text style={styles.recapValueSpace} numberOfLines={1}>
              {transferData.amountUSD?.toFixed(2)} USD
            </Text>
          </View>

          <View style={styles.recapSplitter} />

          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Frais Celo (estimés)</Text>
            <Text style={styles.recapValueSpace}>0.002 CELO</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Frais DiasporaConnect</Text>
            <Text style={styles.recapValueGold}>
              ${transferData.fee?.toFixed(2) || '0.00'}
            </Text>
          </View>

          <View style={styles.recapSplitter} />

          <View style={styles.recapRowAmount}>
            <Text style={styles.recapLabelBold}>Le bénéficiaire recevra</Text>
            <View style={styles.recapAmountBlock}>
              <Text
                style={styles.recapValueNewsreader}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
                numberOfLines={1}
              >
                {formatFCFA(transferData.recipientGetsFCFA)} FCFA
              </Text>
              <Text style={styles.recapValueSpace}>
                = ${transferData.recipientGets?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bénéficiaire */}
        <View style={styles.recipientCard}>
          <Text style={styles.recipientLabel}>Bénéficiaire</Text>
          <Text style={styles.recipientName} numberOfLines={1}>
            {transferData.recipient?.name || 'Inconnu'}
          </Text>
          <Text style={styles.recipientPhone} numberOfLines={1}>
            {transferData.recipient?.phone} · {transferData.operator || 'MTN'}
          </Text>
        </View>

        {/* Info légale */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            En confirmant, vous autorisez le transfert via The Private Ledger sur Celo Alfajores. L'argent sera instantanément disponible pour le retrait au Bénin.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          title={loading ? 'Signature en cours...' : 'Confirmer et Envoyer'}
          onPress={handleConfirm}
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
  backIcon: { fontSize: 24, color: colors.primary },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  recapCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  recapRowAmount: {
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  recapSplitter: {
    height: 1,
    backgroundColor: 'rgba(208, 197, 178, 0.2)',
    marginVertical: spacing.sm,
  },
  recapLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flexShrink: 1,
  },
  recapLabelBold: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
  },
  recapValueSpace: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurface,
    flexShrink: 0,
  },
  recapValueGold: {
    fontFamily: fonts.label,
    fontSize: 15,
    color: colors.primary,
    flexShrink: 0,
  },
  recapAmountBlock: {
    gap: 2,
  },
  recapValueNewsreader: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.onSurface,
    letterSpacing: -0.52,
  },
  recipientCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  recipientLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  recipientName: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 2,
  },
  recipientPhone: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  infoBox: {
    backgroundColor: 'rgba(117, 91, 0, 0.05)',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208, 197, 178, 0.2)',
  },
});
