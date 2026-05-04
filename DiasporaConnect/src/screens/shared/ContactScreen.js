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

const CONTACTS = [
  {
    icon: 'chatbubble-ellipses-outline',
    label: 'WhatsApp Support',
    value: '+229 97 00 00 00',
    action: () => Linking.openURL('https://wa.me/22997000000'),
  },
  {
    icon: 'mail-outline',
    label: 'Email',
    value: 'support@diasporaconnect.app',
    action: () => Linking.openURL('mailto:support@diasporaconnect.app'),
  },
  {
    icon: 'globe-outline',
    label: 'Site web',
    value: 'diasporaconnect.app',
    action: () => Linking.openURL('https://diasporaconnect.app'),
  },
];

const FAQ = [
  {
    q: 'Combien de temps prend un transfert ?',
    a: 'Moins de 60 secondes sur Celo Alfajores. Le retrait Mobile Money est disponible immédiatement.',
  },
  {
    q: 'Quels sont les frais exacts ?',
    a: 'DiasporaConnect prélève 0,8 % du montant envoyé. Les frais de gas Celo sont inférieurs à 0,01 USD.',
  },
  {
    q: 'Mon argent est-il sécurisé ?',
    a: 'Oui. Les fonds sont verrouillés dans un smart contract audité sur la blockchain Celo jusqu\'au retrait.',
  },
  {
    q: 'Quels opérateurs Mobile Money sont supportés ?',
    a: 'MTN Money et Moov Money au Bénin. D\'autres pays arrivent prochainement.',
  },
];

export default function ContactScreen({ navigation }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    Alert.alert('Message envoyé', 'Notre équipe vous répondra sous 24h.');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroTitle}>Comment pouvons-nous{'\n'}vous aider ?</Text>

        {/* Canaux de contact */}
        <View style={styles.contactsCard}>
          {CONTACTS.map((c, i) => (
            <TouchableOpacity
              key={c.label}
              style={[styles.contactRow, i < CONTACTS.length - 1 && styles.contactRowBorder]}
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
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        {FAQ.map((item, i) => (
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
        <Text style={styles.sectionTitle}>Envoyer un message</Text>
        <View style={styles.formCard}>
          <LedgerInput
            label="Votre message"
            value={message}
            onChangeText={setMessage}
            placeholder="Décrivez votre problème..."
            multiline
            numberOfLines={4}
          />
          <GoldButton
            title={sent ? 'Message envoyé ✓' : 'Envoyer'}
            onPress={handleSend}
            disabled={!message.trim() || sent}
            style={{ marginTop: spacing.md }}
          />
        </View>

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
