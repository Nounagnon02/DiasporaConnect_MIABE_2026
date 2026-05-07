import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import GoldButton from '../../components/ui/GoldButton';
import { MOCK_CONTACTS } from '../../services/mockData';
import { scheduleRecurringNotification, cancelNotification } from '../../services/notificationService';

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const FREQUENCIES = [
  { key: 'monthly', label: 'Mensuel' },
  { key: 'bimonthly', label: 'Bi-mensuel' },
];

export default function RecurringScreen({ navigation }) {
  const { recurringTransfers, addRecurringTransfer, toggleRecurring, deleteRecurring } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('200');
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [frequency, setFrequency] = useState('monthly');

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Montant invalide', 'Entrez un montant valide.');
      return;
    }
    const notifId = await scheduleRecurringNotification(
      '🔄 Transfert récurrent',
      `Rappel : envoyer ${amount} USD à ${selectedContact.name}`,
      dayOfMonth
    );
    addRecurringTransfer({
      amount: parseFloat(amount),
      currency: 'USD',
      contact: selectedContact,
      dayOfMonth,
      frequency,
      notifId,
      nextDate: getNextDate(dayOfMonth),
    });
    setShowForm(false);
    Alert.alert('✅ Programmé', `Transfert de ${amount} USD vers ${selectedContact.name} le ${dayOfMonth} de chaque mois.`);
  };

  const handleDelete = async (rec) => {
    Alert.alert('Supprimer', `Supprimer le transfert vers ${rec.contact.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          if (rec.notifId) await cancelNotification(rec.notifId);
          deleteRecurring(rec.id);
        },
      },
    ]);
  };

  const getNextDate = (day) => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), day);
    if (next <= now) next.setMonth(next.getMonth() + 1);
    return next.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  const formatAmount = (num) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(num);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transferts récurrents</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addBtn}>
          <Ionicons name={showForm ? 'close' : 'add'} size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Formulaire */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Nouveau transfert programmé</Text>

            {/* Montant */}
            <Text style={styles.fieldLabel}>Montant (USD)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="200"
                placeholderTextColor={colors.onSurfaceVariant}
              />
              <Text style={styles.inputSuffix}>USD</Text>
            </View>

            {/* Contact */}
            <Text style={styles.fieldLabel}>Bénéficiaire</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsRow}>
              {MOCK_CONTACTS.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.contactChip, selectedContact.id === c.id && styles.contactChipActive]}
                  onPress={() => setSelectedContact(c)}
                >
                  <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                    <Text style={styles.contactInitials}>{c.initials}</Text>
                  </View>
                  <Text style={[styles.contactName, selectedContact.id === c.id && styles.contactNameActive]} numberOfLines={1}>
                    {c.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Fréquence */}
            <Text style={styles.fieldLabel}>Fréquence</Text>
            <View style={styles.freqRow}>
              {FREQUENCIES.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.freqBtn, frequency === f.key && styles.freqBtnActive]}
                  onPress={() => setFrequency(f.key)}
                >
                  <Text style={[styles.freqText, frequency === f.key && styles.freqTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Jour du mois */}
            <Text style={styles.fieldLabel}>Jour du mois : <Text style={styles.daySelected}>{dayOfMonth}</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
              {DAYS.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayBtn, dayOfMonth === d && styles.dayBtnActive]}
                  onPress={() => setDayOfMonth(d)}
                >
                  <Text style={[styles.dayText, dayOfMonth === d && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                Prochain transfert : <Text style={styles.previewBold}>{getNextDate(dayOfMonth)}</Text>
                {'\n'}{formatAmount(parseFloat(amount) || 0)} USD → {selectedContact.name}
              </Text>
            </View>

            <GoldButton title="Programmer ce transfert" onPress={handleAdd} />
          </View>
        )}

        {/* Liste des récurrents */}
        {recurringTransfers.length === 0 && !showForm ? (
          <View style={styles.emptyState}>
            <Ionicons name="repeat" size={48} color={colors.outlineVariant} />
            <Text style={styles.emptyTitle}>Aucun transfert programmé</Text>
            <Text style={styles.emptyDesc}>
              Automatisez vos envois mensuels. Appuyez sur + pour commencer.
            </Text>
          </View>
        ) : (
          recurringTransfers.map(rec => (
            <View key={rec.id} style={styles.recCard}>
              <View style={styles.recLeft}>
                <View style={[styles.recAvatar, { backgroundColor: rec.contact.color }]}>
                  <Text style={styles.recInitials}>{rec.contact.initials}</Text>
                </View>
                <View style={styles.recInfo}>
                  <Text style={styles.recName} numberOfLines={1}>{rec.contact.name}</Text>
                  <Text style={styles.recDetails}>
                    {rec.amount} USD · le {rec.dayOfMonth} du mois
                  </Text>
                  <Text style={styles.recNext}>Prochain : {rec.nextDate}</Text>
                </View>
              </View>
              <View style={styles.recRight}>
                <Switch
                  value={rec.active}
                  onValueChange={() => toggleRecurring(rec.id)}
                  trackColor={{ false: colors.surfaceContainerLow, true: 'rgba(117,91,0,0.3)' }}
                  thumbColor={rec.active ? colors.primary : colors.outlineVariant}
                />
                <TouchableOpacity onPress={() => handleDelete(rec)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

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
  backBtn: { padding: 4, width: 40 },
  addBtn: { padding: 4, width: 40, alignItems: 'flex-end' },
  headerTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.onSurface, letterSpacing: -0.4 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  formCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.xl, ...shadows.diffuse, gap: spacing.sm,
  },
  formTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface, marginBottom: spacing.sm },
  fieldLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginTop: spacing.sm },
  daySelected: { fontFamily: fonts.label, color: colors.primary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.sm, paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1, fontFamily: fonts.label, fontSize: 20, color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
  inputSuffix: { fontFamily: fonts.label, fontSize: 14, color: colors.onSurfaceVariant },
  contactsRow: { marginVertical: spacing.sm },
  contactChip: {
    alignItems: 'center', marginRight: spacing.sm, padding: spacing.sm,
    borderRadius: radius.md, backgroundColor: colors.surfaceContainerLow, width: 64,
  },
  contactChipActive: { backgroundColor: 'rgba(117,91,0,0.1)', borderWidth: 1, borderColor: colors.primary },
  contactAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  contactInitials: { fontFamily: fonts.label, fontSize: 12, color: '#FFF' },
  contactName: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, textAlign: 'center' },
  contactNameActive: { color: colors.primary, fontFamily: fonts.title },
  freqRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm },
  freqBtn: {
    flex: 1, paddingVertical: spacing.sm, alignItems: 'center',
    borderRadius: radius.sm, backgroundColor: colors.surfaceContainerLow,
  },
  freqBtnActive: { backgroundColor: 'rgba(117,91,0,0.1)', borderWidth: 1, borderColor: colors.primary },
  freqText: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant },
  freqTextActive: { fontFamily: fonts.title, color: colors.primary },
  daysRow: { marginVertical: spacing.sm },
  dayBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    marginRight: 6, backgroundColor: colors.surfaceContainerLow,
  },
  dayBtnActive: { backgroundColor: colors.primary },
  dayText: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurface },
  dayTextActive: { color: '#FFF' },
  previewBox: {
    backgroundColor: 'rgba(117,91,0,0.05)', borderRadius: radius.sm,
    padding: spacing.md, marginVertical: spacing.sm,
  },
  previewText: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 20 },
  previewBold: { fontFamily: fonts.title, color: colors.onSurface },

  emptyState: { alignItems: 'center', paddingTop: spacing.xxl, gap: spacing.md },
  emptyTitle: { fontFamily: fonts.title, fontSize: 17, color: colors.onSurface },
  emptyDesc: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 21 },

  recCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, ...shadows.diffuse,
  },
  recLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md },
  recAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recInitials: { fontFamily: fonts.label, fontSize: 14, color: '#FFF' },
  recInfo: { flex: 1 },
  recName: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurface },
  recDetails: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  recNext: { fontFamily: fonts.body, fontSize: 11, color: colors.primary, marginTop: 2 },
  recRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 0 },
  deleteBtn: { padding: 4 },
});
