import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';


// CHAINS moved inside component for localization

// Formate le numéro de carte avec espaces
const formatCardNumber = (val) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
};

export default function SenderAuthScreen({ navigation }) {
  const { t } = useTranslation();
  const { loginSender, language } = useStore();

  const CHAINS = [
    { id: 'celo',     name: 'Celo',     color: '#F7C500', desc: t('auth.sender.chains.celo') },
    { id: 'ethereum', name: 'Ethereum', color: '#3C82F6', desc: t('auth.sender.chains.ethereum') },
    { id: 'polygon',  name: 'Polygon',  color: '#A259FF', desc: t('auth.sender.chains.polygon') },
  ];

  // Mode : 'card' | 'wallet'
  const [mode, setMode] = useState('card');
  const [loading, setLoading] = useState(false);

  // Carte bancaire
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Wallet crypto
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('celo');

  // ── Connexion carte ──────────────────────────────────────────────────────────

  const handleCardConnect = async () => {
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length < 16) {
      Alert.alert(t('common.attention'), t('auth.card.invalidNumber'));
      return;
    }
    if (!cardName.trim()) {
      Alert.alert(t('common.attention'), t('auth.card.invalidName'));
      return;
    }
    if (expiry.length < 5) {
      Alert.alert(t('common.attention'), t('auth.card.invalidExpiry'));
      return;
    }
    if (cvv.length < 3) {
      Alert.alert(t('common.attention'), t('auth.card.invalidCvv'));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    loginSender({
      id: `sender_card_${digits.slice(-4)}`,
      name: cardName.trim(),
      paymentMethod: 'card',
      cardLast4: digits.slice(-4),
      language: language || 'fr',
    }, 'token_card_auth');
    setLoading(false);
    navigation.replace('SenderApp');
  };

  // ── Connexion wallet ─────────────────────────────────────────────────────────

  const handleWalletConnect = async () => {
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length < 42) {
      Alert.alert(t('common.attention'), t('auth.invalidAddress'));
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    loginSender({
      id: `sender_${walletAddress.slice(2, 8).toLowerCase()}`,
      name: 'Utilisateur',
      paymentMethod: 'wallet',
      walletAddress,
      chain: selectedChain,
      language: language || 'fr',
    }, 'token_wallet_auth');
    setLoading(false);
    navigation.replace('SenderApp');
  };

  // ── Démo ─────────────────────────────────────────────────────────────────────

  const handleDemo = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    loginSender({
      id: 'sender_demo_001',
      name: 'Kossi Mensah',
      paymentMethod: mode === 'wallet' ? 'wallet' : 'card',
      cardLast4: '4242',
      walletAddress: '0x1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b',
      chain: 'celo',
      language: language || 'fr',
    }, 'token_demo');
    setLoading(false);
    navigation.replace('SenderApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('auth.sender.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.sender.subtitle')}</Text>

          {/* ── Toggle mode ── */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'card' && styles.modeBtnActive]}
              onPress={() => setMode('card')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="card"
                size={16}
                color={mode === 'card' ? colors.onPrimary : colors.onSurfaceVariant}
              />
              <Text style={[styles.modeBtnText, mode === 'card' && styles.modeBtnTextActive]}>
                {t('auth.card.tab')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'wallet' && styles.modeBtnActive]}
              onPress={() => setMode('wallet')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="wallet"
                size={16}
                color={mode === 'wallet' ? colors.onPrimary : colors.onSurfaceVariant}
              />
              <Text style={[styles.modeBtnText, mode === 'wallet' && styles.modeBtnTextActive]}>
                {t('auth.wallet.tab')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Formulaire carte ── */}
          {mode === 'card' && (
            <View style={styles.formCard}>
              {/* Visuel carte */}
              <LinearGradient
                colors={['#755B00', '#C9A84C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardVisual}
              >
                <View style={styles.cardVisualTop}>
                  <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: '90deg' }] }} />
                  <Text style={styles.cardVisualBrand}>VISA</Text>
                </View>
                <Text style={styles.cardVisualNumber}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>
                <View style={styles.cardVisualBottom}>
                  <View>
                    <Text style={styles.cardVisualLabel}>{t('auth.card.holder')}</Text>
                    <Text style={styles.cardVisualValue} numberOfLines={1}>
                      {cardName || t('auth.card.holderPlaceholder')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.cardVisualLabel}>{t('auth.card.expires')}</Text>
                    <Text style={styles.cardVisualValue}>{expiry || 'MM/YY'}</Text>
                  </View>
                </View>
              </LinearGradient>

              <LedgerInput
                label={t('auth.card.numberLabel')}
                value={cardNumber}
                onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                keyboardType="number-pad"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <View style={{ height: spacing.md }} />
              <LedgerInput
                label={t('auth.card.nameLabel')}
                value={cardName}
                onChangeText={setCardName}
                placeholder={t('auth.card.namePlaceholder')}
                autoCapitalize="characters"
              />
              <View style={styles.cardRow}>
                <View style={styles.cardRowHalf}>
                  <LedgerInput
                    label={t('auth.card.expiryLabel')}
                    value={expiry}
                    onChangeText={(v) => setExpiry(formatExpiry(v))}
                    keyboardType="number-pad"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </View>
                <View style={styles.cardRowHalf}>
                  <LedgerInput
                    label="CVV"
                    value={cvv}
                    onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    placeholder="•••"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.secureNote}>
                <Ionicons name="lock-closed" size={12} color={colors.onSurfaceVariant} />
                <Text style={styles.secureNoteText}>{t('auth.card.secureNote')}</Text>
              </View>
            </View>
          )}

          {/* ── Formulaire wallet ── */}
          {mode === 'wallet' && (
            <View style={styles.formCard}>
              <Text style={styles.sectionLabel}>{t('auth.sender.chooseNetwork')}</Text>
              {CHAINS.map(chain => (
                <TouchableOpacity
                  key={chain.id}
                  style={[styles.chainCard, selectedChain === chain.id && styles.chainCardActive]}
                  onPress={() => setSelectedChain(chain.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.chainDot, { backgroundColor: chain.color }]} />
                  <View style={styles.chainInfo}>
                    <Text style={[styles.chainName, selectedChain === chain.id && styles.chainNameActive]}>
                      {chain.name}
                    </Text>
                    <Text style={styles.chainDesc} numberOfLines={1}>{chain.desc}</Text>
                  </View>
                  {selectedChain === chain.id && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <View style={{ height: spacing.lg }} />
              <LedgerInput
                label={t('auth.sender.walletLabel')}
                value={walletAddress}
                onChangeText={setWalletAddress}
                placeholder="0x1a3b5c..."
                autoCapitalize="none"
              />
            </View>
          )}

          {/* ── Actions ── */}
          <View style={styles.actionsBlock}>
            <GoldButton
              title={loading ? t('auth.processing') : mode === 'card' ? t('auth.card.connectBtn') : t('auth.sender.connectBtn')}
              onPress={mode === 'card' ? handleCardConnect : handleWalletConnect}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleDemo}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.demoBtnContent}>
                  <Ionicons name="rocket-outline" size={16} color={colors.primary} />
                  <Text style={styles.demoBtnText}>{t('auth.continueDemo')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
  backBtn: { padding: spacing.xs, alignSelf: 'flex-start' },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  title: {
    fontFamily: fonts.display, fontSize: 30, color: colors.onSurface,
    marginBottom: spacing.sm, letterSpacing: -0.6, lineHeight: 38,
  },
  subtitle: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant,
    marginBottom: spacing.xl, lineHeight: 23,
  },

  // Toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xl,
    gap: 4,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, paddingVertical: 10, borderRadius: radius.md - 2,
  },
  modeBtnActive: { backgroundColor: colors.primary, ...shadows.glass },
  modeBtnText: { fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant },
  modeBtnTextActive: { color: colors.onPrimary },

  // Card form
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  cardVisual: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    height: 160,
    justifyContent: 'space-between',
  },
  cardVisualTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardVisualBrand: { fontFamily: fonts.label, fontSize: 18, color: 'rgba(255,255,255,0.9)', letterSpacing: 2 },
  cardVisualNumber: {
    fontFamily: fonts.label, fontSize: 16, color: '#FFF',
    letterSpacing: 3, textAlign: 'center',
  },
  cardVisualBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardVisualLabel: { fontFamily: fonts.body, fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardVisualValue: { fontFamily: fonts.label, fontSize: 13, color: '#FFF', marginTop: 2 },
  cardRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  cardRowHalf: { flex: 1 },
  secureNote: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.md, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(208,197,178,0.2)',
  },
  secureNoteText: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, flex: 1 },

  // Wallet form
  sectionLabel: {
    fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md,
  },
  chainCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1.5, borderColor: 'transparent',
  },
  chainCardActive: { borderColor: colors.primary, backgroundColor: 'rgba(117,91,0,0.04)' },
  chainDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.md, flexShrink: 0 },
  chainInfo: { flex: 1 },
  chainName: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface, marginBottom: 2 },
  chainNameActive: { color: colors.primary },
  chainDesc: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant },
  checkBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  // Actions
  actionsBlock: { gap: spacing.md },
  demoBtn: {
    height: 52, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md,
  },
  demoBtnContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  demoBtnText: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface },
});
