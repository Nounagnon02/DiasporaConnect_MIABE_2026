import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import LedgerInput from '../../components/ui/LedgerInput';
import GoldButton from '../../components/ui/GoldButton';
import { useTranslation } from 'react-i18next';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

const CONTACTS = (t) => [
  {
    icon: 'chatbubble-ellipses-outline',
    label: t('support.whatsapp'),
    value: '+229 97 00 00 00',
    action: () => Linking.openURL('https://wa.me/22997000000'),
  },
  {
    icon: 'mail-outline',
    label: t('support.email'),
    value: 'support@diasporaconnect.app',
    action: () => Linking.openURL('mailto:support@diasporaconnect.app'),
  },
  {
    icon: 'globe-outline',
    label: t('support.web'),
    value: 'diasporaconnect.app',
    action: () => Linking.openURL('https://diasporaconnect.app'),
  },
];

const FAQ = (t) => [
  {
    q: t('support.faq1Q'),
    a: t('support.faq1A'),
  },
  {
    q: t('support.faq2Q'),
    a: t('support.faq2A'),
  },
  {
    q: t('support.faq3Q'),
    a: t('support.faq3A'),
  },
  {
    q: t('support.faq4Q'),
    a: t('support.faq4A'),
  },
];

export default function ContactScreen({ navigation }) {
  const { t } = useTranslation();
  const tabBarHeight = useTabBarHeight();
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const contacts = CONTACTS(t);
  const faq = FAQ(t);

  const CONTACTS = [
    {
      icon: 'chatbubble-ellipses-outline',
      label: t('support.whatsapp'),
      value: '+229 97 00 00 00',
      action: () => Linking.openURL('https://wa.me/22997000000'),
    },
    {
      icon: 'mail-outline',
      label: t('support.email'),
      value: 'support@diasporaconnect.app',
      action: () => Linking.openURL('mailto:support@diasporaconnect.app'),
    },
    {
      icon: 'globe-outline',
      label: t('support.web'),
      value: 'diasporaconnect.app',
      action: () => Linking.openURL('https://diasporaconnect.app'),
    },
  ];

  const FAQ = [
    { q: t('support.faq1Q'), a: t('support.faq1A') },
    { q: t('support.faq2Q'), a: t('support.faq2A') },
    { q: t('support.faq3Q'), a: t('support.faq3A') },
    { q: t('support.faq4Q'), a: t('support.faq4A') },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    Alert.alert(t('support.alertTitle'), t('support.alertBody'));
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support.header')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>{t('support.hero')}</Text>

        {/* Canaux de contact */}
        <View style={styles.contactsCard}>
          {contacts.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.contactRow, i < contacts.length - 1 && styles.contactRowBorder]}
              onPress={c.action}
              activeOpacity={0.8}
            >
              <View style={styles.contactIcon}>
                <Ionicons name={c.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactValue} numberOfLines={1}>{c.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>{t('support.faqTitle')}</Text>
        {faq.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setOpenFaq(openFaq === i ? null : i)}
            activeOpacity={0.85}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ} numberOfLines={openFaq === i ? undefined : 2}>
                {item.q}
              </Text>
              <Ionicons
                name={openFaq === i ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.onSurfaceVariant}
                style={{ flexShrink: 0 }}
              />
            </View>
            {openFaq === i && (
              <Text style={styles.faqA}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Formulaire message */}
        <Text style={styles.sectionTitle}>{t('support.messageTitle')}</Text>
        <View style={styles.formCard}>
          <LedgerInput
            label={t('support.messageLabel')}
            value={message}
            onChangeText={setMessage}
            placeholder={t('support.messagePlaceholder')}
            multiline
            numberOfLines={4}
          />
          <GoldButton
            title={sent ? t('support.messageSent') : t('support.send')}
            onPress={handleSend}
            disabled={!message.trim() || sent}
            style={{ marginTop: spacing.md }}
          />
        </View>

        <View style={{ height: tabBarHeight + 16 }} />
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
  backBtn: { padding: spacing.xs, width: 40, alignItems: 'flex-start' },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  heroTitle: {
    fontFamily: fonts.display, fontSize: 28, color: colors.onSurface,
    letterSpacing: -0.56, lineHeight: 36, marginBottom: spacing.xl, flexShrink: 1,
  },
  contactsCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    marginBottom: spacing.xl, ...shadows.diffuse, overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
  },
  contactRowBorder: {
    borderBottomWidth: 1, borderBottomColor: 'rgba(208,197,178,0.15)',
  },
  contactIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: 'rgba(117,91,0,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface, marginBottom: 2 },
  contactValue: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },
  sectionTitle: {
    fontFamily: fonts.title, fontSize: 17, color: colors.onSurface,
    marginBottom: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.glass,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  faqQ: {
    fontFamily: fonts.title, fontSize: 14, color: colors.onSurface,
    flex: 1, lineHeight: 20,
  },
  faqA: {
    fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant,
    lineHeight: 20, marginTop: spacing.sm,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, ...shadows.diffuse,
  },
});
