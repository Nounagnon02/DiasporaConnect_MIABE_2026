/**
 * KYCScreen — Flux de vérification d'identité (KYC)
 * Étapes : Intro → Selfie → Pièce d'identité → Vérification → Succès
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import GoldButton from '../../components/ui/GoldButton';

const STEPS = ['intro', 'selfie', 'document', 'verifying', 'success'];

const REQUIREMENTS = [
  { icon: 'sunny-outline',      text: 'Bonne luminosité' },
  { icon: 'eye-outline',        text: 'Visage bien visible' },
  { icon: 'glasses-outline',    text: 'Retirez lunettes de soleil' },
  { icon: 'phone-portrait',     text: 'Téléphone à hauteur des yeux' },
];

const DOCS = [
  { id: 'passport',  icon: 'book-outline',       label: 'Passeport' },
  { id: 'id',        icon: 'card-outline',        label: "Carte d'identité" },
  { id: 'residence', icon: 'home-outline',        label: 'Titre de séjour' },
];

export default function KYCScreen({ navigation }) {
  const { setKYCStatus, language } = useStore();
  const isEn = language === 'en';
  const [step, setStep] = useState('intro');
  const [selectedDoc, setSelectedDoc] = useState('id');
  const [selfieCapturing, setSelfieCapturing] = useState(false);
  const [selfieOk, setSelfieOk] = useState(false);
  const [docCapturing, setDocCapturing] = useState(false);
  const [docOk, setDocOk] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkAnim    = useRef(new Animated.Value(0)).current;
  const faceAnim     = useRef(new Animated.Value(1)).current;

  // Animation pulsation caméra
  useEffect(() => {
    if (step === 'selfie' || step === 'document') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(faceAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(faceAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [step]);

  // Simulation capture selfie
  const captureSelfie = () => {
    setSelfieCapturing(true);
    setTimeout(() => {
      setSelfieCapturing(false);
      setSelfieOk(true);
    }, 2000);
  };

  // Simulation capture document
  const captureDoc = () => {
    setDocCapturing(true);
    setTimeout(() => {
      setDocCapturing(false);
      setDocOk(true);
    }, 2000);
  };

  // Simulation vérification IA
  const startVerification = () => {
    setStep('verifying');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStep('success');
          Animated.spring(checkAnim, { toValue: 1, damping: 10, stiffness: 120, useNativeDriver: true }).start();
          setKYCStatus?.('verified');
        }, 500);
      }
      setVerifyProgress(Math.min(progress, 100));
      Animated.timing(progressAnim, {
        toValue: Math.min(progress, 100) / 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, 400);
  };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEn ? 'Identity Verification' : 'Vérification d\'identité'}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.kycHero}>
          <View style={styles.kycHeroIcon}>
            <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          </View>
          <Text style={styles.kycTitle}>
            {isEn ? 'Verify your identity' : 'Vérifiez votre identité'}
          </Text>
          <Text style={styles.kycSub}>
            {isEn
              ? 'Required to send more than $500 per month. Takes less than 2 minutes.'
              : 'Requis pour envoyer plus de 500 USD/mois. Moins de 2 minutes.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{isEn ? 'What you\'ll need' : 'Ce dont vous aurez besoin'}</Text>
        <View style={styles.requirementsCard}>
          {REQUIREMENTS.map((r, i) => (
            <View key={i} style={[styles.reqRow, i < REQUIREMENTS.length - 1 && styles.reqRowBorder]}>
              <View style={styles.reqIcon}>
                <Ionicons name={r.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.reqText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.privacyBox}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            {isEn
              ? 'Your data is encrypted and never shared with third parties.'
              : 'Vos données sont chiffrées et jamais partagées avec des tiers.'}
          </Text>
        </View>

        <GoldButton
          title={isEn ? 'Start verification' : 'Commencer la vérification'}
          onPress={() => setStep('selfie')}
          style={{ marginTop: spacing.xl }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // ── SELFIE ─────────────────────────────────────────────────────────────────
  if (step === 'selfie') return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep('intro')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEn ? 'Selfie' : 'Selfie'}</Text>
        <Text style={styles.stepCounter}>1 / 2</Text>
      </View>

      <View style={styles.cameraArea}>
        <Animated.View style={[styles.faceFrame, { transform: [{ scale: faceAnim }] }]}>
          {selfieOk ? (
            <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
          ) : selfieCapturing ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Ionicons name="person-outline" size={80} color="rgba(117,91,0,0.3)" />
          )}
        </Animated.View>
        <Text style={styles.cameraHint}>
          {selfieOk
            ? (isEn ? 'Perfect! ✓' : 'Parfait ! ✓')
            : selfieCapturing
            ? (isEn ? 'Analyzing...' : 'Analyse en cours...')
            : (isEn ? 'Center your face in the frame' : 'Centrez votre visage dans le cadre')}
        </Text>
      </View>

      <View style={styles.cameraFooter}>
        {!selfieOk ? (
          <TouchableOpacity
            style={[styles.captureBtn, selfieCapturing && styles.captureBtnDisabled]}
            onPress={captureSelfie}
            disabled={selfieCapturing}
          >
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        ) : (
          <GoldButton
            title={isEn ? 'Continue' : 'Continuer'}
            onPress={() => setStep('document')}
          />
        )}
      </View>
    </SafeAreaView>
  );

  // ── DOCUMENT ───────────────────────────────────────────────────────────────
  if (step === 'document') return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep('selfie')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEn ? 'Document' : 'Document'}</Text>
        <Text style={styles.stepCounter}>2 / 2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.docTitle}>{isEn ? 'Choose your document' : 'Choisissez votre document'}</Text>
        <View style={styles.docTypes}>
          {DOCS.map(doc => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.docCard, selectedDoc === doc.id && styles.docCardActive]}
              onPress={() => setSelectedDoc(doc.id)}
            >
              <Ionicons name={doc.icon} size={24} color={selectedDoc === doc.id ? colors.primary : colors.onSurfaceVariant} />
              <Text style={[styles.docLabel, selectedDoc === doc.id && styles.docLabelActive]}>
                {doc.label}
              </Text>
              {selectedDoc === doc.id && (
                <View style={styles.docCheck}>
                  <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cameraArea}>
          <Animated.View style={[styles.docFrame, { transform: [{ scale: faceAnim }] }]}>
            {docOk ? (
              <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
            ) : docCapturing ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <Ionicons name="card-outline" size={60} color="rgba(117,91,0,0.3)" />
            )}
          </Animated.View>
          <Text style={styles.cameraHint}>
            {docOk
              ? (isEn ? 'Document captured ✓' : 'Document capturé ✓')
              : (isEn ? 'Place your document in the frame' : 'Placez votre document dans le cadre')}
          </Text>
        </View>

        {!docOk ? (
          <TouchableOpacity
            style={[styles.captureBtn, { alignSelf: 'center', marginTop: spacing.xl }, docCapturing && styles.captureBtnDisabled]}
            onPress={captureDoc}
            disabled={docCapturing}
          >
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        ) : (
          <GoldButton
            title={isEn ? 'Verify my identity' : 'Vérifier mon identité'}
            onPress={startVerification}
            style={{ marginTop: spacing.xl }}
          />
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // ── VERIFYING ──────────────────────────────────────────────────────────────
  if (step === 'verifying') return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.verifyingContainer}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: spacing.xl }} />
        <Text style={styles.verifyingTitle}>
          {isEn ? 'Verifying your identity...' : 'Vérification en cours...'}
        </Text>
        <Text style={styles.verifyingSub}>
          {isEn ? 'Our AI is analyzing your documents' : 'Notre IA analyse vos documents'}
        </Text>
        <View style={styles.verifyProgressTrack}>
          <Animated.View style={[styles.verifyProgressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.verifyPercent}>{Math.round(verifyProgress)}%</Text>

        <View style={styles.verifySteps}>
          {[
            isEn ? 'Face detection' : 'Détection du visage',
            isEn ? 'Document reading' : 'Lecture du document',
            isEn ? 'Identity matching' : 'Correspondance identité',
          ].map((s, i) => (
            <View key={i} style={styles.verifyStep}>
              <Ionicons
                name={verifyProgress > (i + 1) * 30 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={verifyProgress > (i + 1) * 30 ? colors.primary : colors.outlineVariant}
              />
              <Text style={styles.verifyStepText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.successContainer}>
        <Animated.View style={[styles.successIcon, { transform: [{ scale: checkAnim }] }]}>
          <LinearGradient colors={['#755B00', '#C9A84C']} style={styles.successGradient}>
            <Ionicons name="shield-checkmark" size={48} color={colors.onPrimary} />
          </LinearGradient>
        </Animated.View>
        <Text style={styles.successTitle}>
          {isEn ? 'Identity verified!' : 'Identité vérifiée !'}
        </Text>
        <Text style={styles.successSub}>
          {isEn
            ? 'You can now send up to $2,000 per transfer. Your account is fully activated.'
            : 'Vous pouvez maintenant envoyer jusqu\'à 2 000 USD par transfert. Votre compte est entièrement activé.'}
        </Text>
        <View style={styles.successBadge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          <Text style={styles.successBadgeText}>KYC Niveau 2 — Vérifié</Text>
        </View>
        <GoldButton
          title={isEn ? 'Back to home' : 'Retour à l\'accueil'}
          onPress={() => navigation.navigate('SenderApp')}
          style={{ marginTop: spacing.xxl, width: '100%' }}
        />
      </View>
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
  stepCounter: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurfaceVariant, width: 40, textAlign: 'right' },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  kycHero: { alignItems: 'center', marginBottom: spacing.xl },
  kycHeroIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  kycTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.onSurface, letterSpacing: -0.52, textAlign: 'center', marginBottom: spacing.sm },
  kycSub: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 21 },

  sectionTitle: { fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  requirementsCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md, ...shadows.glass, marginBottom: spacing.lg, overflow: 'hidden' },
  reqRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  reqRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(208,197,178,0.15)' },
  reqIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(117,91,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  reqText: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurface },
  privacyBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.md },
  privacyText: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },

  cameraArea: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md,
    marginVertical: spacing.xl, padding: spacing.xxl,
    borderWidth: 2, borderColor: 'rgba(117,91,0,0.15)', borderStyle: 'dashed',
  },
  faceFrame: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 3, borderColor: 'rgba(117,91,0,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  docFrame: {
    width: 200, height: 130, borderRadius: radius.md,
    borderWidth: 3, borderColor: 'rgba(117,91,0,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  cameraHint: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center' },
  cameraFooter: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, alignItems: 'center' },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  captureBtnDisabled: { opacity: 0.4 },
  captureBtnInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary },

  docTitle: { fontFamily: fonts.title, fontSize: 17, color: colors.onSurface, marginBottom: spacing.lg },
  docTypes: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  docCard: {
    flex: 1, backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', gap: spacing.xs,
    borderWidth: 1.5, borderColor: 'transparent', ...shadows.glass,
  },
  docCardActive: { borderColor: colors.primary, backgroundColor: 'rgba(117,91,0,0.04)' },
  docLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, textAlign: 'center' },
  docLabelActive: { color: colors.primary, fontFamily: fonts.title },
  docCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  verifyingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  verifyingTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.onSurface, letterSpacing: -0.48, marginBottom: spacing.sm, textAlign: 'center' },
  verifyingSub: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.xl },
  verifyProgressTrack: { width: '100%', height: 6, backgroundColor: colors.surfaceContainerLow, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.sm },
  verifyProgressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  verifyPercent: { fontFamily: fonts.label, fontSize: 13, color: colors.primary, marginBottom: spacing.xl },
  verifySteps: { gap: spacing.sm, width: '100%' },
  verifyStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  verifyStepText: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurface },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  successIcon: { marginBottom: spacing.xl },
  successGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.onSurface, letterSpacing: -0.56, marginBottom: spacing.sm, textAlign: 'center' },
  successSub: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 21, marginBottom: spacing.lg },
  successBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(117,91,0,0.08)', borderRadius: radius.round, paddingHorizontal: spacing.md, paddingVertical: 6 },
  successBadgeText: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },
});
