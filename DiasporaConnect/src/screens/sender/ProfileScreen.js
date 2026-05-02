import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import useStore from '../../store/useStore';

export default function ProfileScreen({ navigation }) {
  const { senderUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigation.replace('RoleSelect');
  };

  const shortHash = (h) => h ? h.slice(0, 8) + '...' + h.slice(-6) : '0x...';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.headerGeneric}>
        <Text style={styles.headerGenericTitle}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{senderUser?.name}</Text>
          <View style={styles.walletBox}>
            <Text style={styles.walletLabel}>Portefeuille Connecté</Text>
            <Text style={styles.walletAddress}>{shortHash(senderUser?.walletAddress || '0x7a2B...9F1b')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Préférences</Text>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Langue</Text>
          <Text style={styles.settingValue}>Français</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sécurité</Text>
          <Text style={styles.settingValue}>Biométrie activée</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Impact')}>
          <Text style={styles.settingLabel}>Impact</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerGeneric: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerGenericTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
    ...shadows.diffuse,
  },
  profileName: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  walletBox: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  walletLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  walletAddress: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.primary,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.2)',
  },
  settingLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
  },
  settingValue: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.primary,
  },
  logoutBtn: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.error,
  },
});
