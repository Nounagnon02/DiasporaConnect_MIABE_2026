import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import useStore from '../../store/useStore';
import { useWeb3Modal } from '@walletconnect/modal-react-native';

export default function SenderAuthScreen({ navigation }) {
  const { open, isConnected, address } = useWeb3Modal();
  const { loginSender } = useStore();

  React.useEffect(() => {
    if (isConnected && address) {
      loginSender({
        id: `sender_${address.slice(0, 6)}`,
        name: 'Kossi',
        walletAddress: address,
        language: 'fr',
      });
      navigation.replace('SenderApp');
    }
  }, [isConnected, address]);

  const handleWalletConnect = async () => {
    await open();
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
        <Text style={styles.title}>Connectez votre portefeuille</Text>
        <Text style={styles.subtitle}>DiasporaConnect utilise un smart contract sur Celo. Connexion Web3 requise pour l'expéditeur.</Text>

        <View style={styles.walletBox}>
          <Text style={styles.walletIcon}>🦊</Text>
          <Text style={styles.walletName}>MetaMask</Text>
          <Text style={styles.walletDesc}>Connectez votre app MetaMask pour signer les transactions directement.</Text>
        </View>

        <View style={{ flex: 1 }} />

        <GoldButton 
          title={loading ? "Connexion..." : "Connecter MetaMask"} 
          onPress={handleWalletConnect} 
          disabled={loading}
        />
        <View style={styles.secureContainer}>
          <Text style={styles.secureText}>🔒 Connexion chiffrée de bout en bout</Text>
        </View>
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
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  walletBox: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(117, 91, 0, 0.15)',
  },
  walletIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  walletName: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  walletDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  secureContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  secureText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
});
