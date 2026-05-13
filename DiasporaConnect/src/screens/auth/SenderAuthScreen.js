import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import LedgerInput from '../../components/ui/LedgerInput';
import useStore from '../../store/useStore';

const CHAINS = [
  { id: 'celo', name: 'Celo', emoji: '🟡', desc: 'Réseau principal DiasporaConnect' },
  { id: 'ethereum', name: 'Ethereum', emoji: '🔷', desc: 'Compatible EVM' },
  { id: 'polygon', name: 'Polygon', emoji: '🟣', desc: 'Frais réduits' },
];

export default function SenderAuthScreen({ navigation }) {
  const [selectedChain, setSelectedChain] = useState('celo');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSender } = useStore();

  const handleConnect = async () => {
    if (!walletAddress || walletAddress.length < 10) {
      Alert.alert('Attention', 'Veuillez saisir une adresse de portefeuille valide.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      loginSender({
        id: `sender_${walletAddress.slice(0, 6)}`,
        name: 'Kossi',
        walletAddress,
        chain: selectedChain,
        language: 'fr',
      });
      navigation.replace('SenderApp');
    } catch (e) {
      Alert.alert('Erreur', 'Connexion impossible. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoConnect = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    loginSender({
      id: 'sender_demo_001',
      name: 'Kossi',
      walletAddress: '0x1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b',
      chain: selectedChain,
      language: 'fr',
    });
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
        {/* Header fixe */}
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
          <Text style={styles.title}>Connecter votre{'\n'}portefeuille</Text>
          <Text style={styles.subtitle}>
            DiasporaConnect utilise la blockchain Celo pour des transferts sécurisés et transparents.
          </Text>

          <Text style={styles.sectionLabel}>Choisir le réseau</Text>
          {CHAINS.map(chain => (
            <TouchableOpacity
              key={chain.id}
              style={[styles.chainCard, selectedChain === chain.id && styles.chainCardActive]}
              onPress={() => setSelectedChain(chain.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.chainEmoji}>{chain.emoji}</Text>
              <View style={styles.chainInfo}>
                <Text
                  style={[styles.chainName, selectedChain === chain.id && styles.chainNameActive]}
                  numberOfLines={1}
                >
                  {chain.name}
                </Text>
                <Text style={styles.chainDesc} numberOfLines={2}>{chain.desc}</Text>
              </View>
              {selectedChain === chain.id && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou saisir manuellement</Text>
            <View style={styles.dividerLine} />
          </View>

          <LedgerInput
            label="Adresse du portefeuille (0x...)"
            value={walletAddress}
            onChangeText={setWalletAddress}
            placeholder="0x1a3b5c..."
            autoCapitalize="none"
          />

          <View style={styles.actionsBlock}>
            <GoldButton
              title={loading ? 'Connexion...' : 'Connecter le portefeuille'}
              onPress={handleConnect}
              disabled={loading}
              style={styles.btnPrimary}
            />

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleDemoConnect}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.demoBtnText}>🚀 Continuer en mode démo</Text>
              )}
            </TouchableOpacity>

            <View style={styles.secureContainer}>
              <Text style={styles.secureText}>🔒 Connexion chiffrée de bout en bout</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs, alignSelf: 'flex-start' },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.onSurface,
    marginBottom: spacing.sm,
    letterSpacing: -0.02,
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
  sectionLabel: {
    fontFamily: fonts.title,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.glass,
  },
  chainCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(117, 91, 0, 0.04)',
  },
  chainEmoji: { fontSize: 26, marginRight: spacing.md, flexShrink: 0 },
  chainInfo: { flex: 1, marginRight: spacing.sm },
  chainName: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 2,
  },
  chainNameActive: { color: colors.primary },
  chainDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 17,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkText: { color: '#FFF', fontSize: 13, fontFamily: fonts.title },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(208, 197, 178, 0.3)' },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginHorizontal: spacing.md,
    flexShrink: 1,
  },
  actionsBlock: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  btnPrimary: {
    width: '100%',
  },
  demoBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
  },
  demoBtnText: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
  },
  secureContainer: { alignItems: 'center', paddingVertical: spacing.sm },
  secureText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
