import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import FeeComparator from '../../components/ui/FeeComparator';
import { calculateTransfer } from '../../services/blockchainService';
import useStore from '../../store/useStore';

export default function CalculatorScreen({ navigation }) {
  const { updateTransferData } = useStore();
  const [amount, setAmount] = useState('200');
  const [currency, setCurrency] = useState('EUR');
  
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
    navigation.navigate('SendFlow', { screen: 'SendStep2' }); // Jump to Step 2 since Amount is done here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estimer un transfert</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Input Card */}
        <View style={styles.card}>
          <View style={styles.currencyToggle}>
            <TouchableOpacity 
              style={[styles.toggleBtn, currency === 'EUR' && styles.toggleBtnActive]}
              onPress={() => setCurrency('EUR')}
            >
              <Text style={[styles.toggleText, currency === 'EUR' && styles.toggleTextActive]}>EUR</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, currency === 'USD' && styles.toggleBtnActive]}
              onPress={() => setCurrency('USD')}
            >
              <Text style={[styles.toggleText, currency === 'USD' && styles.toggleTextActive]}>USD</Text>
            </TouchableOpacity>
          </View>

          <LedgerInput
            label="Montant de l'expédition"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />

          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Le bénéficiaire reçoit environ</Text>
            <Text style={styles.resultAmount}>{formatFCFA(calcResult.recipientGetsFCFA)} FCFA</Text>
          </View>
        </View>

        {/* Fees Comparison */}
        {calcResult.amountUSD > 0 && (
          <>
            <FeeComparator calcResult={calcResult} style={{ marginBottom: spacing.xl }} />
            
            <View style={styles.savingsBanner}>
              <Text style={styles.savingsIcon}>✨</Text>
              <Text style={styles.savingsText}>
                En envoyant avec DiasporaConnect, vous conservez <Text style={styles.savingsBold}>${calcResult.savings.toFixed(2)} USD</Text> dans la famille par rapport au marché.
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating CTA */}
      <View style={styles.bottomCta}>
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
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    letterSpacing: -0.02,
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
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  resultAmount: {
    fontFamily: fonts.label,
    fontSize: 32,
    color: colors.onSurface,
    letterSpacing: letterSpacing.amounts,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  savingsIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  savingsText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
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
    padding: spacing.xl,
    paddingBottom: 40, // for safe area essentially + glass nav
    backgroundColor: 'transparent',
  },
});
