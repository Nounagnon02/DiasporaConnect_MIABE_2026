import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Clipboard, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';
import ArrowIcon from '../../components/ui/ArrowIcon';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'fon', label: 'Fon',     flag: '🇧🇯' },
];

export default function ProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { senderUser, recipientUser, logout, language, setLanguage } = useStore();
  const user = senderUser || recipientUser;
  const isSender = !!senderUser;
  const tabBarHeight = useTabBarHeight();
  const [copied, setCopied] = useState(false);

  const shortHash = (h) => h ? h.slice(0, 8) + '...' + h.slice(-6) : '0x742d...3E1f';

  const handleCopy = () => {
    const addr = user?.walletAddress || '0x742d35Cc6634C0532925a3b8D4C9E3E1f';
    Clipboard.setString(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguage = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleLogout = () => {
    Alert.alert(t('profile.logoutTitle'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logoutBtn'),
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.getParent()?.getParent()?.replace('RoleSelect') ||
            navigation.getParent()?.replace('RoleSelect') ||
            navigation.navigate('RoleSelect');
        },
      },
    ]);
  };

  const initials = isSender
    ? (user?.name || 'K').charAt(0).toUpperCase()
    : ((user?.firstName || 'A').charAt(0) + (user?.lastName || '').charAt(0)).toUpperCase();

  const displayName = isSender
    ? (user?.name || 'Kossi')
    : `${user?.firstName || 'Adjoua'} ${user?.lastName || ''}`.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.header')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar + identité */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName} numberOfLines={2}>{displayName}</Text>
          <View style={styles.walletRow}>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>
                {isSender ? t('profile.celoWallet') : t('profile.mobileMoney')}
              </Text>
              <Text style={styles.walletAddress} numberOfLines={1} ellipsizeMode="middle">
                {isSender ? shortHash(user?.walletAddress) : (user?.phone || '+229 97 00 00 00')}
              </Text>
            </View>
            {isSender && (
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              {copied ? (
                <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.copyIcon} />
              ) : (
                <Text style={styles.copyText}>{t('common.copy')}</Text>
              )}
            </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Langue */}
        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        <View style={styles.langCard}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langRow, language === lang.code && styles.langRowActive]}
              onPress={() => handleLanguage(lang.code)}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, language === lang.code && styles.langLabelActive]}>
                {lang.label}
              </Text>
              {language === lang.code && (
                <View style={styles.langCheck}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sécurité */}
        <Text style={styles.sectionTitle}>{t('profile.security')}</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Ionicons name="finger-print" size={16} color={colors.onSurfaceVariant} />
              <Text style={styles.settingLabel} numberOfLines={2}>
                {t('profile.biometricAuth')}
              </Text>
            </View>
            <Text style={styles.settingValue}>{t('common.enabled')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.impactBtn}
          onPress={() => navigation.navigate('Impact')}
        >
          <Ionicons name="earth" size={18} color={colors.primary} />
          <Text style={styles.impactBtnText} numberOfLines={1}>{t('profile.viewImpact')}</Text>
          <ArrowIcon color={colors.primary} size={18} thickness={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.impactBtn, { marginTop: spacing.sm }]}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.primary} />
          <Text style={styles.impactBtnText} numberOfLines={1}>{t('profile.notifications')}</Text>
          <ArrowIcon color={colors.primary} size={18} thickness={2} />
        </TouchableOpacity>

        {isSender && (
          <TouchableOpacity
            style={[styles.impactBtn, { marginTop: spacing.sm }]}
            onPress={() => navigation.navigate('Beneficiaries')}
          >
            <Ionicons name="people-outline" size={18} color={colors.primary} />
            <Text style={styles.impactBtnText} numberOfLines={1}>{t('profile.beneficiaries')}</Text>
            <ArrowIcon color={colors.primary} size={18} thickness={2} />
          </TouchableOpacity>
        )}

        {isSender && (
          <TouchableOpacity
            style={[styles.impactBtn, { marginTop: spacing.sm }]}
            onPress={() => navigation.navigate('KYC')}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={styles.impactBtnText} numberOfLines={1}>{t('profile.kyc')}</Text>
            <ArrowIcon color={colors.primary} size={18} thickness={2} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.impactBtn, { marginTop: spacing.sm }]}
          onPress={() => navigation.navigate('Contact')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
          <Text style={styles.impactBtnText} numberOfLines={1}>{t('profile.support')}</Text>
          <ArrowIcon color={colors.primary} size={18} thickness={2} />
        </TouchableOpacity>

        {/* À propos */}
        <Text style={styles.sectionTitle}>{t('profile.about')}</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('profile.version')}</Text>
            <Text style={styles.settingValueLabel} numberOfLines={1}>1.0.0 — MIABE 2026</Text>
          </View>
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <Text style={styles.settingLabel}>{t('profile.network')}</Text>
            <Text style={styles.settingValueLabel}>Celo Alfajores</Text>
          </View>
        </View>

        <View style={{ height: spacing.xl }} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={16} color={colors.onSurface} style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>{t('profile.logoutBtn')}</Text>
        </TouchableOpacity>

        <View style={{ height: tabBarHeight + 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  headerTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.onSurface, letterSpacing: -0.56 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl, ...shadows.diffuse,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { fontFamily: fonts.display, fontSize: 24, color: colors.primary },
  profileName: {
    fontFamily: fonts.display, fontSize: 20, color: colors.onSurface,
    marginBottom: spacing.md, letterSpacing: -0.4, textAlign: 'center', flexShrink: 1,
  },
  walletRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow, borderRadius: 6, padding: spacing.md, width: '100%',
  },
  walletInfo: { flex: 1, marginRight: spacing.sm },
  walletLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, marginBottom: 2 },
  walletAddress: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },
  copyBtn: {
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    backgroundColor: 'rgba(117,91,0,0.1)', borderRadius: 4, flexShrink: 0,
  },
  copyText: { fontFamily: fonts.label, fontSize: 12, color: colors.primary },
  copyIcon: { marginVertical: 2 },
  sectionTitle: {
    fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },
  langCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    overflow: 'hidden', ...shadows.diffuse,
  },
  langRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  langRowActive: { backgroundColor: 'rgba(117,91,0,0.05)' },
  langFlag: { fontSize: 20, flexShrink: 0 },
  langLabel: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.onSurface },
  langLabelActive: { fontFamily: fonts.title, color: colors.primary },
  langCheck: {
    width: 22, height: 22, borderRadius: 4, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  settingCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, ...shadows.diffuse,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm,
  },
  settingLabelRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1,
  },
  settingRowBorder: { borderTopWidth: 1, borderTopColor: 'rgba(208,197,178,0.15)' },
  settingLabel: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurface, flexShrink: 1 },
  settingValue: { fontFamily: fonts.label, fontSize: 13, color: colors.primary, flexShrink: 0 },
  settingValueLabel: {
    fontFamily: fonts.label, fontSize: 13, color: colors.onSurfaceVariant,
    flexShrink: 0, textAlign: 'right',
  },
  impactBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(117,91,0,0.06)', borderRadius: radius.md,
    padding: spacing.lg, marginTop: spacing.lg,
  },
  impactBtnText: {
    fontFamily: fonts.title, fontSize: 15, color: colors.primary, flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.md,
  },
  logoutText: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface },
});
