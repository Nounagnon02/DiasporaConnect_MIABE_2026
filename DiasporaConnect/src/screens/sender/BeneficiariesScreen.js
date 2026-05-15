/**
 * BeneficiariesScreen — Gestion des bénéficiaires
 * Ajouter / modifier / supprimer des contacts Mobile Money
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';
import LedgerInput from '../../components/ui/LedgerInput';
import GoldButton from '../../components/ui/GoldButton';

const OPERATORS = ['MTN', 'Moov'];
const AVATAR_COLORS = ['#C75B39', '#2D5A4A', '#D4A574', '#A04428', '#1B4A3A', '#755B00'];

export default function BeneficiariesScreen({ navigation }) {
  const { t } = useTranslation();
  const tabBarHeight = useTabBarHeight();
  const { beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', operator: 'MTN', city: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', phone: '', operator: 'MTN', city: '' });
    setModalVisible(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({ name: b.name, phone: b.phone, operator: b.operator, city: b.city || '' });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert(t('common.attention'), t('beneficiaries.requiredFields'));
      return;
    }
    if (editing) {
      updateBeneficiary(editing.id, form);
    } else {
      const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      addBeneficiary({ ...form, initials, color });
    }
    setModalVisible(false);
  };

  const handleDelete = (b) => {
    Alert.alert(
      t('beneficiaries.delete'),
      t('beneficiaries.deleteConfirm', { name: b.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('beneficiaries.delete'), style: 'destructive', onPress: () => deleteBeneficiary(b.id) },
      ]
    );
  };

  const list = beneficiaries || [];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('beneficiaries.title')}</Text>
        <TouchableOpacity onPress={openAdd} style={styles.addBtn}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.onSurfaceVariant} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>{t('beneficiaries.empty')}</Text>
            <Text style={styles.emptyText}>
              {t('beneficiaries.emptyDesc')}
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={openAdd}>
              <Text style={styles.emptyBtnText}>{t('beneficiaries.addBtn')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          list.map(b => (
            <View key={b.id} style={styles.card}>
              <View style={[styles.avatar, { backgroundColor: (b.color || '#755B00') + '22' }]}>
                <Text style={[styles.avatarText, { color: b.color || colors.primary }]}>
                  {b.initials || b.name?.charAt(0)}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{b.name}</Text>
                <Text style={styles.phone} numberOfLines={1}>{b.phone} · {b.operator}</Text>
                {b.city ? <Text style={styles.city} numberOfLines={1}>{b.city}</Text> : null}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(b)}>
                  <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(b)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: tabBarHeight + 16 }} />
      </ScrollView>

      {/* Modal ajout / édition */}
      <Modal visible={modalVisible} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editing ? t('beneficiaries.edit') : t('beneficiaries.modalTitleAdd')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <LedgerInput
                label={t('beneficiaries.nameLabel')}
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
                placeholder={t('beneficiaries.namePlaceholder')}
              />
              <View style={{ height: spacing.md }} />
              <LedgerInput
                label={t('beneficiaries.phoneLabel')}
                value={form.phone}
                onChangeText={v => setForm(f => ({ ...f, phone: v }))}
                keyboardType="phone-pad"
                placeholder="+229 97 00 00 00"
              />
              <View style={{ height: spacing.md }} />
              <LedgerInput
                label={t('beneficiaries.cityLabel')}
                value={form.city}
                onChangeText={v => setForm(f => ({ ...f, city: v }))}
                placeholder={t('beneficiaries.cityPlaceholder')}
              />

              {/* Opérateur */}
              <Text style={styles.operatorLabel}>{t('beneficiaries.operatorLabel')}</Text>
              <View style={styles.operatorRow}>
                {OPERATORS.map(op => (
                  <TouchableOpacity
                    key={op}
                    style={[styles.operatorBtn, form.operator === op && styles.operatorBtnActive]}
                    onPress={() => setForm(f => ({ ...f, operator: op }))}
                  >
                    <Text style={[styles.operatorText, form.operator === op && styles.operatorTextActive]}>
                      {op}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GoldButton
                title={editing ? t('common.confirm') : t('beneficiaries.add')}
                onPress={handleSave}
                style={{ marginTop: spacing.xl }}
              />
              <View style={{ height: spacing.xl }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  backBtn: { padding: 4, width: 40 },
  addBtn: { padding: 4, width: 40, alignItems: 'flex-end' },
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  emptyState: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },
  emptyTitle: { fontFamily: fonts.title, fontSize: 18, color: colors.onSurface, marginBottom: spacing.sm },
  emptyText: {
    fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl,
  },
  emptyBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
  },
  emptyBtnText: { fontFamily: fonts.title, fontSize: 15, color: colors.onPrimary },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.glass, gap: spacing.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { fontFamily: fonts.title, fontSize: 15 },
  info: { flex: 1 },
  name: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface, marginBottom: 2 },
  phone: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },
  city: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 },
  actions: { flexDirection: 'row', gap: spacing.xs },
  actionBtn: { padding: spacing.sm },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(27,28,26,0.4)' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: spacing.xl, maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.onSurface, letterSpacing: -0.44 },
  operatorLabel: {
    fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.md, marginBottom: spacing.sm,
  },
  operatorRow: { flexDirection: 'row', gap: spacing.sm },
  operatorBtn: {
    flex: 1, padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow, alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  operatorBtnActive: { borderColor: colors.primary, backgroundColor: 'rgba(117,91,0,0.06)' },
  operatorText: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurfaceVariant },
  operatorTextActive: { color: colors.primary },
});
