import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import StepIndicator from '../../../components/ui/StepIndicator';
import LedgerInput from '../../../components/ui/LedgerInput';
import GoldButton from '../../../components/ui/GoldButton';
import SecondaryButton from '../../../components/ui/SecondaryButton';
import { MOCK_CONTACTS } from '../../../services/mockData';
import useStore from '../../../store/useStore';

const STEP_LABELS = ['Montant', 'Destinataire', 'Confirmation', 'Succès'];

export default function Step2Screen({ navigation }) {
  const { transferData, updateTransferData } = useStore();
  const [phone, setPhone] = useState(transferData.recipient?.phone || '');
  const [selected, setSelected] = useState(
    transferData.recipient?.id ? transferData.recipient : null
  );

  const handleContact = (contact) => {
    setSelected(contact);
    setPhone(contact.phone);
    updateTransferData({ recipient: contact, operator: contact.operator });
  };

  const handleNext = () => {
    const recipient = selected || { phone, operator: 'MTN', name: 'Nouveau Destinataire' };
    if (!phone) return Alert.alert('Attention', 'Veuillez renseigner le numéro de téléphone.');
    updateTransferData({ recipient, operator: recipient.operator || 'MTN' });
    navigation.navigate('SendStep3');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Destinataire</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={2} labels={STEP_LABELS} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <LedgerInput
            label="Numéro Mobile Money (+229)"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              setSelected(null);
            }}
            keyboardType="phone-pad"
            placeholder="97 00 00 00"
          />
          <SecondaryButton
            title="Scanner QR Code"
            onPress={() => {}}
            style={{ marginTop: spacing.md }}
          />
        </View>

        <Text style={styles.sectionLabel}>Destinataires récents</Text>

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
              <Text style={styles.contactName} numberOfLines={1} ellipsizeMode="tail">
                {c.name}
              </Text>
              <Text style={styles.contactPhone} numberOfLines={1}>
                {c.phone} · {c.operator}
              </Text>
            </View>
            {selected?.id === c.id && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton title="Continuer" onPress={handleNext} disabled={!phone} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  backIcon: { fontSize: 24, color: colors.primary },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
    ...shadows.diffuse,
  },
  sectionLabel: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  contactCardActive: {
    borderColor: 'rgba(117, 91, 0, 0.3)',
    backgroundColor: colors.surfaceContainerLowest,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  contactInitials: { fontFamily: fonts.title, fontSize: 15 },
  contactInfo: { flex: 1, marginRight: spacing.sm },
  contactName: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 2,
  },
  contactPhone: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectedBadgeText: { color: '#FFF', fontSize: 13, fontFamily: fonts.title },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208, 197, 178, 0.2)',
  },
});
