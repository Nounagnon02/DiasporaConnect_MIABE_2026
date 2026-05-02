import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import useStore from '../../store/useStore';

export default function ReceiverAuthScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { loginRecipient } = useStore();

  const handleSendOTP = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginRecipient({
        id: 'user_receiver_1',
        firstName: 'Adjoua',
        lastName: 'Dossou',
        phone: phone,
        mtnNumber: phone,
        availableFCFA: 82125,
      });
      navigation.replace('ReceiverApp');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Numéro de téléphone</Text>
            <Text style={styles.subtitle}>Saisissez votre numéro Mobile Money actif au Bénin pour accéder à vos fonds.</Text>

            <LedgerInput
              label="Numéro MTN ou Moov"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+229 97 00 00 00"
            />

            <View style={{ flex: 1 }} />
            <GoldButton 
              title={loading ? "Envoi..." : "Recevoir un code SMS"} 
              onPress={handleSendOTP} 
              disabled={loading || phone.length < 8}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Code de vérification</Text>
            <Text style={styles.subtitle}>Saisissez le code à 4 chiffres envoyé au {phone}.</Text>

            <LedgerInput
              label="Code OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              placeholder="1234"
            />

            <View style={{ flex: 1 }} />
            <GoldButton 
              title={loading ? "Vérification..." : "Valider et continuer"} 
              onPress={handleVerifyOTP} 
              disabled={loading || otp.length < 4}
            />
          </>
        )}
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
  backIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.onSurface,
    marginBottom: spacing.sm,
    letterSpacing: -0.02,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
});
