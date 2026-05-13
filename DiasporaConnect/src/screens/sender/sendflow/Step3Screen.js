import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import StepIndicator from '../../../components/ui/StepIndicator';
import GoldButton from '../../../components/ui/GoldButton';
import useStore from '../../../store/useStore';
import { detectAnomaly } from '../../../services/aiService';
import BiometricGuard from '../../../components/ui/BiometricGuard';
import { Ionicons } from '@expo/vector-icons';
import { executeTransferDemo } from '../../../services/blockchainService';

const { width } = Dimensions.get('window');
const STEP_LABELS = ['Montant', 'Destinataire', 'Confirmation', 'Succès'];

export default function Step3Screen({ navigation }) {
  const { transferData, addTransaction, updateTransferData, senderUser, transactions, language } = useStore();
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const isEn = language === 'en';

  const verifiedName = transferData.verifiedName || transferData.recipient?.name || 'ce destinataire';

  const maskedPhone = (p = '') => {
    const clean = p.replace(/\s/g, '');
    if (clean.length < 6) return p;
    return clean.slice(0, -6) + '••••' + clean.slice(-2);
  };

  // Détection IA d'anomalie
  const anomaly = detectAnomaly(
    { amountUSD: transferData.amountUSD, recipientPhone: transferData.recipient?.phone },
    transactions
  );

  const handleConfirmPress = () => {
    if (!confirmed) {
      Alert.alert('Confirmation requise', `Cochez la case pour confirmer l'envoi à ${verifiedName}.`);
      return;
    }
    setShowBiometric(true);
  };
  const handleBiometricSuccess = () => { setShowBiometric(false); handleConfirm(); };
  const handleBiometricCancel  = () => setShowBiometric(false);

  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await executeTransferDemo(
        transferData.amountUSD,
        transferData.recipient?.phone,
        () => {} // progression gérée par l'UI de loading
      );

      if (!result.success) throw new Error('Transfer failed');

      updateTransferData({ txHash: result.txHash, status: 'completed' });
      addTransaction({
        id: `tx_${Date.now()}`,
        txHashFull: result.txHash,
        txHash: result.txHash.slice(0, 10) + '...' + result.txHash.slice(-8),
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
        gasFeeCELO: '0.003',
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
      <BiometricGuard
        visible={showBiometric}
        onSuccess={handleBiometricSuccess}
        onCancel={handleBiometricCancel}
        reason={isEn ? 'Confirm this transfer' : 'Confirmez ce transfert'}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={3} labels={STEP_LABELS} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Alerte IA fraude/anomalie */}
        {anomaly && (
          <View style={[styles.anomalyBanner, anomaly.level === 'high' && styles.anomalyHigh]}>
            <Text style={styles.anomalyIcon}>
              {anomaly.level === 'high' ? '🚨' : anomaly.level === 'medium' ? '⚠️' : 'ℹ️'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.anomalyTitle}>✨ IA — {anomaly.level === 'high' ? 'Alerte sécurité' : 'Attention'}</Text>
              <Text style={styles.anomalyText}>
                {isEn ? anomaly.reasonEn : anomaly.reason}
              </Text>
            </View>
          </View>
        )}

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

        {/* Bénéficiaire + case à cocher obligatoire */}
        <View style={styles.recipientCard}>
          <Text style={styles.recipientLabel}>Bénéficiaire vérifié</Text>
          <Text style={styles.recipientName} numberOfLines={1}>
            {verifiedName}
          </Text>
          <Text style={styles.recipientPhone} numberOfLines={1}>
            {maskedPhone(transferData.recipient?.phone)} · {transferData.operator || 'MTN'}
          </Text>

          <TouchableOpacity
            style={styles.confirmCheckRow}
            onPress={() => setConfirmed(v => !v)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.confirmCheckText}>
              Je confirme envoyer à <Text style={{ fontFamily: fonts.title }}>{verifiedName}</Text>
            </Text>
          </TouchableOpacity>
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
          onPress={handleConfirmPress}
          disabled={loading || !confirmed}
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
    marginBottom: spacing.md,
  },
  confirmCheckRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(208, 197, 178, 0.3)',
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  confirmCheckText: {
    fontFamily: fonts.body, fontSize: 13, color: colors.onSurface, flex: 1,
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
  anomalyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryContainer,
  },
  anomalyHigh: {
    backgroundColor: 'rgba(186,26,26,0.06)',
    borderLeftColor: colors.error,
  },
  anomalyIcon: { fontSize: 20, flexShrink: 0 },
  anomalyTitle: {
    fontFamily: fonts.title,
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  anomalyText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 18,
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
