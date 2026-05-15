import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import useStore from '../../store/useStore';
import { sendOTP, verifyOTP } from '../../services/apiService';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ReceiverAuthScreen({ navigation }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { loginRecipient } = useStore();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSendOTP = async () => {
    if (phone.length < 8) return;
    setLoading(true);
    try {
      const res = await sendOTP(phone);
      setLoading(false);
      if (res.success) {
        setStep(2);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      } else {
        Alert.alert(t('common.error'), res.message || t('auth.loginError'));
      }
    } catch (e) {
      setLoading(false);
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  const handleOtpChange = (val, index) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = cleaned;
    setOtp(next);
    if (cleaned && index < 3) inputRefs[index + 1].current?.focus();
    if (!cleaned && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) return;
    setLoading(true);
    try {
      const res = await verifyOTP(phone, code);
      setLoading(false);
      if (res.success) {
        loginRecipient(res.user, res.token);
        navigation.replace('ReceiverApp');
      } else {
        Alert.alert(t('common.error'), res.message || t('auth.invalidCode'));
      }
    } catch (e) {
      setLoading(false);
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  const handleDemoLogin = () => {
    loginRecipient({
      id: 'receiver_demo',
      firstName: 'Fatou',
      lastName: 'Traoré',
      phone: '+229 97 12 34 56',
      mtnNumber: '+229 97 12 34 56',
      availableFCFA: 119909,
    });
    navigation.replace('ReceiverApp');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => step === 2 ? setStep(1) : navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 ? (
            <>
              <Text style={styles.title}>{t('auth.recipient.title')}</Text>
              <Text style={styles.subtitle}>{t('auth.recipient.subtitle')}</Text>

              <LedgerInput
                label={t('auth.recipient.phoneLabel')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+229 97 00 00 00"
              />

              <View style={styles.actionsBlock}>
                <GoldButton
                  title={loading ? t('auth.processing') : t('auth.recipient.sendCode')}
                  onPress={handleSendOTP}
                  disabled={loading || phone.length < 8}
                  style={styles.btnFull}
                />
                <TouchableOpacity style={styles.demoBtn} onPress={handleDemoLogin}>
                  <View style={styles.demoBtnContent}>
                    <Ionicons name="rocket-outline" size={16} color={colors.primary} />
                    <Text style={styles.demoBtnText}>{t('auth.continueDemo')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{t('auth.verifyTitle')}</Text>
              <Text style={styles.subtitle}>
                {t('auth.codeSent')} {phone}.{'\n'}
                <Text style={styles.hint}>{t('auth.demoCode')}: 4242</Text>
              </Text>

              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={inputRefs[i]}
                    style={[styles.otpBox, digit && styles.otpBoxFilled]}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                ))}
              </View>

              <View style={styles.actionsBlock}>
                <GoldButton
                  title={loading ? t('auth.processing') : t('auth.verifyBtn')}
                  onPress={handleVerify}
                  disabled={loading || otp.join('').length < 4}
                  style={styles.btnFull}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    lineHeight: 38,
    flexShrink: 1,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xl,
    lineHeight: 23,
    flexShrink: 1,
  },
  hint: {
    fontFamily: fonts.label,
    color: colors.primary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  otpBox: {
    flex: 1,
    height: 64,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    fontFamily: fonts.label,
    fontSize: 28,
    color: colors.onSurface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(208,197,178,0.4)',
    ...shadows.glass,
  },
  otpBoxFilled: {
    borderBottomColor: colors.primary,
    backgroundColor: 'rgba(117,91,0,0.04)',
  },
  actionsBlock: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  btnFull: { width: '100%' },
  demoBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
  },
  demoBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  demoBtnText: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
  },
});
