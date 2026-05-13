/**
 * BiometricGuard — Authentification biométrique (Face ID / Touch ID)
 * Utilise expo-local-authentication
 * Usage : <BiometricGuard onSuccess={fn} onCancel={fn} />
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';

export default function BiometricGuard({ visible, onSuccess, onCancel, reason }) {
  const { language } = useStore();
  const isEn = language === 'en';
  const [status, setStatus] = useState('idle'); // idle | checking | success | failed | unavailable
  const [biometricType, setBiometricType] = useState(null);

  useEffect(() => {
    if (visible) {
      checkAndAuthenticate();
    }
  }, [visible]);

  const checkAndAuthenticate = async () => {
    setStatus('checking');
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled  = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setStatus('unavailable');
        // Pas de biométrie dispo → on laisse passer directement
        setTimeout(() => onSuccess?.(), 800);
        return;
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else {
        setBiometricType('fingerprint');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || (isEn ? 'Confirm your identity' : 'Confirmez votre identité'),
        fallbackLabel: isEn ? 'Use PIN' : 'Utiliser le PIN',
        cancelLabel: isEn ? 'Cancel' : 'Annuler',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setStatus('success');
        setTimeout(() => onSuccess?.(), 400);
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('unavailable');
      setTimeout(() => onSuccess?.(), 500);
    }
  };

  const iconName = biometricType === 'face' ? 'scan' : 'finger-print';

  return (
    <Modal visible={visible} transparent animationType="fade" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Icône biométrique */}
          <View style={[
            styles.iconCircle,
            status === 'success' && styles.iconCircleSuccess,
            status === 'failed'  && styles.iconCircleFailed,
          ]}>
            {status === 'checking' ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : status === 'success' ? (
              <Ionicons name="checkmark" size={40} color={colors.onPrimary} />
            ) : status === 'failed' ? (
              <Ionicons name="close" size={40} color={colors.onPrimary} />
            ) : (
              <Ionicons name={iconName} size={40} color={colors.primary} />
            )}
          </View>

          <Text style={styles.title}>
            {status === 'success'     ? (isEn ? 'Verified ✓' : 'Vérifié ✓')
            : status === 'failed'     ? (isEn ? 'Failed' : 'Échec')
            : status === 'unavailable'? (isEn ? 'Biometrics unavailable' : 'Biométrie indisponible')
            : biometricType === 'face'? (isEn ? 'Face ID' : 'Face ID')
            : (isEn ? 'Touch ID' : 'Touch ID')}
          </Text>

          <Text style={styles.sub}>
            {status === 'failed'
              ? (isEn ? 'Authentication failed. Try again.' : 'Authentification échouée. Réessayez.')
              : status === 'unavailable'
              ? (isEn ? 'Proceeding without biometrics.' : 'Passage sans biométrie.')
              : (reason || (isEn ? 'Confirm to authorize this transfer' : 'Confirmez pour autoriser ce transfert'))}
          </Text>

          {status === 'failed' && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.retryBtn} onPress={checkAndAuthenticate}>
                <Text style={styles.retryText}>{isEn ? 'Retry' : 'Réessayer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>{isEn ? 'Cancel' : 'Annuler'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'idle' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{isEn ? 'Cancel' : 'Annuler'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(27,28,26,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.xxl, alignItems: 'center', width: '100%',
    ...shadows.diffuse,
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconCircleSuccess: { backgroundColor: colors.primary },
  iconCircleFailed:  { backgroundColor: colors.error },
  title: {
    fontFamily: fonts.display, fontSize: 24, color: colors.onSurface,
    letterSpacing: -0.48, marginBottom: spacing.sm, textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl,
  },
  btnRow: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  retryBtn: {
    flex: 1, backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center',
  },
  retryText: { fontFamily: fonts.title, fontSize: 15, color: colors.onPrimary },
  cancelBtn: {
    flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center',
  },
  cancelText: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface },
});
