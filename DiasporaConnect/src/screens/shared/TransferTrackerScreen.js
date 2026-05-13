/**
 * TransferTrackerScreen — Suivi temps réel d'un transfert
 * Étapes : Signé → Confirmé Celo → Notifié destinataire → Retiré
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';

const STEPS = [
  { key: 'signed',    icon: 'pencil',           label: 'Transaction signée',         sub: 'Wallet Celo autorisé' },
  { key: 'confirmed', icon: 'cube',              label: 'Confirmée sur Celo',          sub: 'Bloc validé par le réseau' },
  { key: 'notified',  icon: 'notifications',     label: 'Destinataire notifié',        sub: 'SMS envoyé au bénéficiaire' },
  { key: 'withdrawn', icon: 'phone-portrait',    label: 'Retrait Mobile Money',        sub: 'Fonds disponibles sur MTN/Moov' },
];

export default function TransferTrackerScreen({ navigation, route }) {
  const { transaction } = route.params || {};
  const { transactions } = useStore();

  // Retrouver la tx la plus récente si pas passée en param
  const tx = transaction || transactions[0];

  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Simulation de progression (en prod : écouter les events blockchain)
  useEffect(() => {
    if (tx?.status === 'completed') {
      setCurrentStep(3);
      return;
    }

    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next === 2)  setCurrentStep(1);
        if (next === 8)  setCurrentStep(2);
        if (next === 15) setCurrentStep(3);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tx]);

  // Animation barre de progression
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / STEPS.length,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Pulsation sur l'étape active
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentStep]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const openExplorer = () => {
    if (tx?.txHashFull) {
      Linking.openURL(`https://alfajores.celoscan.io/tx/${tx.txHashFull}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi du transfert</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Statut global */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>
            {currentStep < 3 ? 'En cours de traitement' : 'Transfert complété ✓'}
          </Text>
          <Text style={styles.statusAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {tx?.amountUSD?.toFixed(2) || '0.00'} USD
          </Text>
          <Text style={styles.statusRecipient} numberOfLines={1}>
            → {tx?.recipient || 'Destinataire'}
          </Text>

          {/* Barre de progression globale */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressLabel}>
            Étape {Math.min(currentStep + 1, STEPS.length)} / {STEPS.length}
          </Text>
        </View>

        {/* Chrono */}
        {currentStep < 3 && (
          <View style={styles.chronoRow}>
            <Ionicons name="time-outline" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.chronoText}>Temps écoulé : {formatTime(elapsed)}</Text>
            <Text style={styles.chronoSub}>· Cible : &lt; 60s</Text>
          </View>
        )}

        {/* Étapes */}
        <Text style={styles.sectionTitle}>Étapes de confirmation</Text>
        {STEPS.map((step, index) => {
          const isDone    = index < currentStep;
          const isActive  = index === currentStep;
          const isPending = index > currentStep;

          return (
            <View key={step.key} style={styles.stepRow}>
              {/* Ligne verticale */}
              {index < STEPS.length - 1 && (
                <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
              )}

              {/* Icône */}
              <Animated.View style={[
                styles.stepIcon,
                isDone    && styles.stepIconDone,
                isActive  && styles.stepIconActive,
                isPending && styles.stepIconPending,
                isActive  && { transform: [{ scale: pulseAnim }] },
              ]}>
                <Ionicons
                  name={isDone ? 'checkmark' : step.icon}
                  size={18}
                  color={isPending ? colors.outlineVariant : colors.onPrimary}
                />
              </Animated.View>

              {/* Texte */}
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, isPending && styles.stepLabelPending]}>
                  {step.label}
                </Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
                {isActive && (
                  <View style={styles.activeChip}>
                    <Text style={styles.activeChipText}>En cours...</Text>
                  </View>
                )}
                {isDone && (
                  <Text style={styles.doneText}>✓ Complété</Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Infos transaction */}
        <Text style={styles.sectionTitle}>Détails blockchain</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Réseau</Text>
            <Text style={styles.detailValue}>Celo Alfajores</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hash TX</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
              {tx?.txHash || '0x...'}
            </Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frais gas</Text>
            <Text style={styles.detailValue}>{tx?.gasFeeCELO || '0.003'} CELO</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Confirmations</Text>
            <Text style={styles.detailValue}>{tx?.confirmations || 0}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.explorerBtn} onPress={openExplorer}>
          <Ionicons name="open-outline" size={16} color={colors.primary} />
          <Text style={styles.explorerBtnText}>Voir sur CeloScan</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  backBtn: { padding: 4, width: 40 },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  statusCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.xl, ...shadows.diffuse, alignItems: 'center',
  },
  statusLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginBottom: spacing.sm },
  statusAmount: {
    fontFamily: fonts.display, fontSize: 36, color: colors.onSurface,
    letterSpacing: -0.72, marginBottom: spacing.xs,
  },
  statusRecipient: { fontFamily: fonts.label, fontSize: 14, color: colors.primary, marginBottom: spacing.lg },
  progressTrack: {
    width: '100%', height: 6, backgroundColor: colors.surfaceContainerLow,
    borderRadius: 3, overflow: 'hidden', marginBottom: spacing.sm,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressLabel: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },

  chronoRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  chronoText: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurface },
  chronoSub: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant },

  sectionTitle: {
    fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: spacing.lg, marginTop: spacing.sm,
  },

  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.md, marginBottom: spacing.lg, position: 'relative',
  },
  stepLine: {
    position: 'absolute', left: 19, top: 40, width: 2, height: 36,
    backgroundColor: colors.surfaceContainerLow, zIndex: 0,
  },
  stepLineDone: { backgroundColor: colors.primary },
  stepIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1,
  },
  stepIconDone:    { backgroundColor: colors.primary },
  stepIconActive:  { backgroundColor: colors.primaryContainer },
  stepIconPending: { backgroundColor: colors.surfaceContainerLow, borderWidth: 1.5, borderColor: colors.outlineVariant },
  stepContent: { flex: 1, paddingTop: spacing.xs },
  stepLabel: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface, marginBottom: 2 },
  stepLabelPending: { color: colors.onSurfaceVariant },
  stepSub: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },
  activeChip: {
    alignSelf: 'flex-start', marginTop: 4,
    backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: radius.round,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  activeChipText: { fontFamily: fonts.label, fontSize: 11, color: colors.primaryContainer },
  doneText: { fontFamily: fonts.label, fontSize: 11, color: colors.primary, marginTop: 4 },

  detailCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, ...shadows.glass, marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm,
  },
  detailDivider: { height: 1, backgroundColor: 'rgba(208,197,178,0.15)' },
  detailLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant },
  detailValue: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurface, flexShrink: 1, textAlign: 'right' },

  explorerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, padding: spacing.md,
    backgroundColor: 'rgba(117,91,0,0.06)', borderRadius: radius.md,
  },
  explorerBtnText: { fontFamily: fonts.title, fontSize: 14, color: colors.primary },
});
