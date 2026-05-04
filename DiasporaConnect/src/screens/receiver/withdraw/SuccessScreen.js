import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Vibration, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import GoldButton from '../../../components/ui/GoldButton';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

const TRUST_ITEMS = [
  { icon: 'flash',       label: 'Instantané' },
  { icon: 'lock-closed', label: 'Sécurisé'   },
  { icon: 'cash',        label: 'Sans frais'  },
];

export default function SuccessScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Vibration.vibrate(200);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.container}>

        {/* Icône succès — Ionicons checkmark */}
        <Animated.View style={[styles.successIconWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons
            name="checkmark"
            size={isSmall ? 40 : 52}
            color={colors.onPrimary}
          />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <Text style={styles.successTitle} numberOfLines={2}>Retrait en cours</Text>
          <Text style={styles.successStatus}>Délai estimé : moins de 2 minutes</Text>

          <View style={styles.box}>
            <Text style={styles.boxText}>
              Votre compte Mobile Money sera crédité dès que le réseau aura validé la sortie des fonds du Private Ledger.
            </Text>
          </View>

          {/* Indicateurs de confiance — Ionicons */}
          <View style={styles.trustRow}>
            {TRUST_ITEMS.map((item) => (
              <View key={item.label} style={styles.trustItem}>
                <View style={styles.trustIconWrap}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.trustLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <GoldButton
          title="Retour à l'accueil"
          onPress={() => navigation.navigate('ReceiverApp', { screen: 'Home' })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surfaceContainerLowest },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconWrapper: {
    width: isSmall ? 80 : 100,
    height: isSmall ? 80 : 100,
    borderRadius: isSmall ? 40 : 50,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xxl,
    ...shadows.diffuse,
  },
  textBlock: { width: '100%', alignItems: 'center' },
  successTitle: {
    fontFamily: fonts.display, fontSize: isSmall ? 26 : 32,
    color: colors.onSurface, letterSpacing: -0.02,
    marginBottom: spacing.sm, textAlign: 'center', flexShrink: 1,
  },
  successStatus: {
    fontFamily: fonts.headline, fontSize: isSmall ? 15 : 17,
    color: colors.onSurfaceVariant, marginBottom: spacing.xl, textAlign: 'center',
  },
  box: {
    backgroundColor: colors.surface, padding: spacing.lg,
    borderRadius: radius.md, width: '100%', marginBottom: spacing.xl,
  },
  boxText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 22, flexShrink: 1,
  },
  trustRow: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'center' },
  trustItem: { alignItems: 'center', gap: 6 },
  trustIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  trustLabel: { fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant },
  footer: {
    paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.lg,
    backgroundColor: colors.surfaceContainerLowest,
  },
});
