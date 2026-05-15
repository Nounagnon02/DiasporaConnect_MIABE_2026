import React, { useEffect } from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing } from '../../../theme/theme';
import useStore from '../../../store/useStore';
import StepIndicator from '../../../components/ui/StepIndicator';
import { useTranslation } from 'react-i18next';

export default function Step1Screen({ navigation }) {
  const { t } = useTranslation();
  const { transferData } = useStore();
  const STEP_LABELS = [t('send.step1'), t('send.step2'), t('send.step3'), t('send.step4')];

  useEffect(() => {
    if (transferData.amountUSD > 0) {
      const timer = setTimeout(() => {
        navigation.replace('SendStep2');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      navigation.replace('Calculator');
    }
  }, [transferData, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('send.initializing')}</Text>
      </View>
      <StepIndicator totalSteps={4} currentStep={1} labels={STEP_LABELS} />
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>{t('send.preparing')}</Text>
      </View>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.body,
    marginTop: spacing.md,
    color: colors.onSurfaceVariant,
  }
});
