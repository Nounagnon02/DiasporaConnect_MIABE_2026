import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import FeeComparator from '../../components/ui/FeeComparator';
import SmartAmountSuggestion from '../../components/ui/SmartAmountSuggestion';
import { calculateTransfer } from '../../services/blockchainService';
import useStore from '../../store/useStore';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

export default function CalculatorScreen({ navigation }) {
  const { updateTransferData } = useStore();
  const [amount, setAmount] = useState('200');
  const [currency, setCurrency] = useState('EUR');
  const insets = useSafeAreaInsets();

  const calcResult = amount && !isNaN(parseFloat(amount))
    ? calculateTransfer(parseFloat(amount), currency)
    : calculateTransfer(0, currency);

  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num));

  const handleNext = () => {
    if (!calcResult || calcResult.amountUSD <= 0) return;
    updateTransferData({
      amount,
      currency,
      amountUSD: calcResult.amountUSD,
      amountFCFA: calcResult.amountFCFA,
      fee: calcResult.diasporaFee,
      recipientGets: calcResult.recipientGets,
      recipientGetsFCFA: calcResult.recipientGetsFCFA,
      savings: calcResult.savings,
    });
    navigation.navigate('SendFlow', { screen: 'SendStep2' });
  };

  const ctaBottom = insets.bottom + 16;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estimer un transfert</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 + ctaBottom }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input Card */}
        <View style={styles.card}>
          {/* Toggle devise */}
          <View style={styles.currencyToggle}>
            {['EUR', 'USD'].map((cur) => (
              <TouchableOpacity
                key={cur}
                style={[styles.toggleBtn, currency === cur && styles.toggleBtnActive]}
                onPress={() => setCurrency(cur)}
              >
                <Text style={[styles.toggleText, currency === cur && styles.toggleTextActive]}>
                  {cur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <LedgerInput
            label="Montant de l'expédition"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />

          <SmartAmountSuggestion onSelect={(amt) => setAmount(String(amt))} />

          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Le bénéficiaire reçoit environ</Text>
            <Text
              style={styles.resultAmount}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              numberOfLines={1}
            >
              {formatFCFA(calcResult.recipientGetsFCFA)} FCFA
            </Text>
          </View>
        </View>

        {/* Comparateur de frais */}
        {calcResult.amountUSD > 0 && (
          <>
            <FeeComparator calcResult={calcResult} style={styles.feeComp} />

            <View style={styles.savingsBanner}>
              <Text style={styles.savingsIcon}>✨</Text>
              <Text style={styles.savingsText}>
                En envoyant avec DiasporaConnect, vous conservez{' '}
                <Text style={styles.savingsBold}>
                  ${calcResult.savings.toFixed(2)} USD
                </Text>{' '}
                dans la famille vs. le marché.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* CTA flottant */}
      <View style={[styles.bottomCta, { paddingBottom: ctaBottom + spacing.md }]}>
        <GoldButton
          title="Continuer le transfert"
          onPress={handleNext}
          disabled={!calcResult || calcResult.amountUSD <= 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 24 : 28,
    color: colors.onSurface,
    letterSpacing: -0.02,
    flexShrink: 1,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.diffuse,
  },
  currencyToggle: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.sm,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.sm - 2,
  },
  toggleBtnActive: {
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.glass,
  },
  toggleText: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  resultContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208, 197, 178, 0.2)',
  },
  resultLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  resultAmount: {
    fontFamily: fonts.label,
    fontSize: isSmall ? 26 : 32,
    color: colors.onSurface,
    letterSpacing: letterSpacing.amounts,
  },
  feeComp: {
    marginBottom: spacing.xl,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  savingsIcon: {
    fontSize: 22,
    flexShrink: 0,
  },
  savingsText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    flexShrink: 1,
  },
  savingsBold: {
    fontFamily: fonts.title,
    color: colors.primary,
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(250,249,245,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(208,197,178,0.15)',
  },
});
