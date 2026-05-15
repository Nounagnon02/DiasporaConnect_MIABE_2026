import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal, ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import StepIndicator from '../../../components/ui/StepIndicator';
import LedgerInput from '../../../components/ui/LedgerInput';
import GoldButton from '../../../components/ui/GoldButton';
import SecondaryButton from '../../../components/ui/SecondaryButton';
import { MOCK_CONTACTS } from '../../../services/mockData';
import useStore from '../../../store/useStore';
import { useTabBarHeight } from '../../../hooks/useTabBarHeight';
import { useTranslation } from 'react-i18next';
import { nameEnquiry } from '../../../services/apiService';

const normalizePhone = (p) => p.replace(/[^0-9]/g, '');

export default function Step2Screen({ navigation }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const bottomPad = tabBarHeight + Math.max(insets.bottom, 0);
  const { transferData, updateTransferData } = useStore();
  const STEP_LABELS = [t('send.step1'), t('send.step2'), t('send.step3'), t('send.step4')];
  const OPERATORS = [
    { id: 'MTN', label: 'MTN Money', color: '#FFCC00', textColor: '#1B1C1A' },
    { id: 'MOOV', label: 'Moov Money', color: '#005BBB', textColor: '#FFFFFF' },
  ];

  const [operator, setOperator] = useState(transferData.operator || null);
  const [phone, setPhone] = useState(transferData.recipient?.phone || '');
  const [selected, setSelected] = useState(
    transferData.recipient?.id ? transferData.recipient : null
  );

  const [enquiryState, setEnquiryState] = useState('idle');
  const [enquiryName, setEnquiryName] = useState(null);
  const [enquiryError, setEnquiryError] = useState(null);
  const [forceConfirmed, setForceConfirmed] = useState(false);

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanning, setQRScanning] = useState(false);

  const enquiryTimer = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

  const handlePhoneChange = (text) => {
    setPhone(text);
    setSelected(null);
    setEnquiryState('idle');
    setEnquiryName(null);
    setEnquiryError(null);
    setForceConfirmed(false);
    fadeAnim.setValue(0);
    if (enquiryTimer.current) clearTimeout(enquiryTimer.current);
    const digits = normalizePhone(text);
    if (!operator) return;
    if (digits.length < 8) return;
    enquiryTimer.current = setTimeout(() => triggerEnquiry(text), 600);
  };

  const triggerEnquiry = async (phoneValue) => {
    if (!operator) {
      Alert.alert(t('common.attention'), t('send.operatorRequired'));
      return;
    }
    setEnquiryState('loading');
    const result = await nameEnquiry(phoneValue, operator);

    if (result.success) {
      setEnquiryState('success');
      setEnquiryName(result.name);
    } else if (result.error === 'not_found') {
      setEnquiryState('error');
      setEnquiryError(t('send.errorNotFound', { operator }));
    } else if (result.error === 'api_failure') {
      setEnquiryState('warning');
      setEnquiryError(t('send.errorApiFailure'));
    } else {
      setEnquiryState('error');
      setEnquiryError(t('send.errorInvalidNum'));
    }
    fadeIn();
  };

  const handleOperatorSelect = (op) => {
    setOperator(op);
    setEnquiryState('idle');
    setEnquiryName(null);
    setEnquiryError(null);
    setForceConfirmed(false);
    fadeAnim.setValue(0);
    if (phone && normalizePhone(phone).length >= 8) {
      setTimeout(() => triggerEnquiry(phone), 300);
    }
  };

  const handleContact = (contact) => {
    setSelected(contact);
    setPhone(contact.phone);
    setOperator(contact.operator);
    setEnquiryState('idle');
    setEnquiryName(null);
    setEnquiryError(null);
    setForceConfirmed(false);
    fadeAnim.setValue(0);
    updateTransferData({ recipient: contact, operator: contact.operator });
    setTimeout(() => triggerEnquiry(contact.phone), 300);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
    setQRScanning(true);
    setTimeout(() => {
      const mockPhone = '+229 97 45 12 87';
      const mockName = 'Adjoua Adjovi';
      const mockContact = { phone: mockPhone, operator: 'MTN', name: mockName };
      setPhone(mockPhone);
      setOperator('MTN');
      setSelected(mockContact);
      updateTransferData({ recipient: mockContact, operator: 'MTN' });
      setQRScanning(false);
      setShowQRScanner(false);
      setTimeout(() => triggerEnquiry(mockPhone), 300);
    }, 2000);
  };

  const canProceed = () => {
    if (!phone || !operator) return false;
    if (enquiryState === 'loading') return false;
    if (enquiryState === 'error') return false;
    if (enquiryState === 'warning' && !forceConfirmed) return false;
    return true;
  };

  const handleNext = () => {
    const recipient = { ...(selected || {}), phone, operator, name: enquiryName || selected?.name || t('send.recipient') };
    updateTransferData({ recipient, operator, verifiedName: enquiryName });
    navigation.navigate('SendStep3');
  };

  const maskedPhone = (p) => {
    const clean = p.replace(/\s/g, '');
    if (clean.length < 6) return p;
    return clean.slice(0, -6) + '••••' + clean.slice(-2);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('send.recipientHeader')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={2} labels={STEP_LABELS} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>{t('send.operatorLabel')}</Text>
        <View style={styles.operatorRow}>
          {OPERATORS.map(op => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorBtn,
                operator === op.id && { borderColor: op.color, borderWidth: 2.5 },
              ]}
              onPress={() => handleOperatorSelect(op.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.operatorDot, { backgroundColor: op.color }]} />
              <Text style={styles.operatorLabel}>{op.label}</Text>
              {operator === op.id && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Saisie numéro ── */}
        <View style={styles.card}>
          <LedgerInput
            label={t('send.phoneLabel')}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            placeholder="97 00 00 00"
            editable={!!operator}
          />
          {!operator && (
            <Text style={styles.hintText}>{t('send.selectOperatorFirst')}</Text>
          )}

          {/* ── Résultat Name Enquiry ── */}
          {enquiryState === 'loading' && (
            <View style={styles.enquiryRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.enquiryLoadingText}>{t('send.verifyingAccount', { operator })}</Text>
            </View>
          )}

          {enquiryState === 'success' && (
            <Animated.View style={[styles.enquirySuccess, { opacity: fadeAnim }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.enquirySuccessName}>{enquiryName}</Text>
                <Text style={styles.enquirySuccessPhone}>
                  {t('send.belongsTo', { name: enquiryName })}
                </Text>
              </View>
            </Animated.View>
          )}

          {enquiryState === 'error' && (
            <Animated.View style={[styles.enquiryError, { opacity: fadeAnim }]}>
              <Ionicons name="close-circle" size={20} color={colors.error} />
              <Text style={[styles.enquiryErrorText, { flex: 1, marginLeft: spacing.sm }]}>
                {enquiryError}
              </Text>
            </Animated.View>
          )}

          {enquiryState === 'warning' && (
            <Animated.View style={[styles.enquiryWarning, { opacity: fadeAnim }]}>
              <Ionicons name="warning" size={20} color="#B45309" />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.enquiryWarningText}>{enquiryError}</Text>
                <TouchableOpacity
                  style={styles.forceConfirmBtn}
                  onPress={() => setForceConfirmed(v => !v)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, forceConfirmed && styles.checkboxChecked]}>
                    {forceConfirmed && <Ionicons name="checkmark" size={12} color="#FFF" />}
                  </View>
                  <Text style={styles.forceConfirmText}>
                    {t('send.forceConfirmText')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          <SecondaryButton
            title={t('send.scanQR')}
            onPress={handleQRScan}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* ── Contacts récents ── */}
        <Text style={styles.sectionLabel}>{t('send.recentRecipients')}</Text>

        {MOCK_CONTACTS.slice(0, 3).map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.contactCard, selected?.id === c.id && styles.contactCardActive]}
            onPress={() => handleContact(c)}
            activeOpacity={0.88}
          >
            <View style={[styles.contactAvatar, { backgroundColor: c.color + '22' }]}>
              <Text style={[styles.contactInitials, { color: c.color }]}>{c.initials}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName} numberOfLines={1}>{c.name}</Text>
              <Text style={styles.contactPhone} numberOfLines={1}>
                {maskedPhone(c.phone)} · {c.operator}
              </Text>
            </View>
            {selected?.id === c.id && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark" size={14} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: tabBarHeight + 16 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + spacing.md }]}>
        <GoldButton
          title={enquiryState === 'loading' ? t('auth.processing') : t('common.continue')}
          onPress={handleNext}
          disabled={!canProceed()}
        />
      </View>

      {/* ── Modal QR Scanner ── */}
      <Modal visible={showQRScanner} transparent animationType="fade" presentationStyle="overFullScreen">
        <View style={styles.qrOverlay}>
          <View style={styles.qrSheet}>
            <View style={styles.qrFrame}>
              {qrScanning
                ? <ActivityIndicator size="large" color={colors.primary} />
                : <Ionicons name="qr-code-outline" size={80} color="rgba(117,91,0,0.3)" />
              }
              <View style={[styles.qrCorner, styles.qrCornerTL]} />
              <View style={[styles.qrCorner, styles.qrCornerTR]} />
              <View style={[styles.qrCorner, styles.qrCornerBL]} />
              <View style={[styles.qrCorner, styles.qrCornerBR]} />
            </View>
            <Text style={styles.qrHint}>
              {qrScanning ? t('send.qrReading') : t('send.qrPoint')}
            </Text>
            <TouchableOpacity
              style={styles.qrCancelBtn}
              onPress={() => { setShowQRScanner(false); setQRScanning(false); }}
            >
              <Text style={styles.qrCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  sectionLabel: {
    fontFamily: fonts.title, fontSize: 16,
    color: colors.onSurface, marginBottom: spacing.md,
  },

  // Opérateur
  operatorRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  operatorBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'transparent',
    ...shadows.diffuse,
  },
  operatorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  operatorLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurface },

  // Card saisie
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg, borderRadius: radius.md,
    marginBottom: spacing.xl, ...shadows.diffuse,
  },
  hintText: {
    fontFamily: fonts.label, fontSize: 12,
    color: colors.onSurfaceVariant, marginTop: spacing.sm,
  },

  // Name Enquiry
  enquiryRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.md, gap: spacing.sm,
  },
  enquiryLoadingText: {
    fontFamily: fonts.label, fontSize: 13, color: colors.onSurfaceVariant,
  },
  enquirySuccess: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: spacing.md, padding: spacing.md,
    backgroundColor: 'rgba(117, 91, 0, 0.06)',
    borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(117, 91, 0, 0.2)',
  },
  enquirySuccessName: {
    fontFamily: fonts.title, fontSize: 15, color: colors.primary, marginBottom: 2,
  },
  enquirySuccessPhone: {
    fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant,
  },
  enquiryError: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: spacing.md, padding: spacing.md,
    backgroundColor: 'rgba(186, 26, 26, 0.06)',
    borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  enquiryErrorText: {
    fontFamily: fonts.body, fontSize: 12, color: colors.error,
  },
  enquiryWarning: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: spacing.md, padding: spacing.md,
    backgroundColor: 'rgba(180, 83, 9, 0.06)',
    borderRadius: radius.md, borderWidth: 1,
    borderColor: 'rgba(180, 83, 9, 0.2)',
  },
  enquiryWarningText: {
    fontFamily: fonts.body, fontSize: 12, color: '#92400E', marginBottom: spacing.sm,
  },
  forceConfirmBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkbox: {
    width: 18, height: 18, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#B45309',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#B45309', borderColor: '#B45309' },
  forceConfirmText: {
    fontFamily: fonts.label, fontSize: 11, color: '#92400E', flex: 1,
  },

  // Contacts
  contactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md, borderRadius: radius.md,
    marginBottom: spacing.sm, borderWidth: 1.5, borderColor: 'transparent',
  },
  contactCardActive: {
    borderColor: 'rgba(117, 91, 0, 0.3)',
    backgroundColor: colors.surfaceContainerLowest,
  },
  contactAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0,
  },
  contactInitials: { fontFamily: fonts.title, fontSize: 15 },
  contactInfo: { flex: 1, marginRight: spacing.sm },
  contactName: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, marginBottom: 2 },
  contactPhone: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },
  selectedBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  selectedBadgeText: { color: '#FFF', fontSize: 13, fontFamily: fonts.title },

  footer: {
    paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: 'rgba(208, 197, 178, 0.2)',
  },

  // QR Scanner
  qrOverlay: {
    flex: 1, backgroundColor: 'rgba(27,28,26,0.85)',
    justifyContent: 'center', alignItems: 'center',
  },
  qrSheet: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.xl, alignItems: 'center', width: '85%',
  },
  qrFrame: {
    width: 200, height: 200, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg, position: 'relative',
  },
  qrCorner: { position: 'absolute', width: 24, height: 24, borderColor: colors.primary, borderWidth: 3 },
  qrCornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  qrCornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  qrCornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  qrCornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  qrHint: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', marginBottom: spacing.xl,
  },
  qrCancelBtn: { padding: spacing.md },
  qrCancelText: { fontFamily: fonts.title, fontSize: 15, color: colors.primary },
});
