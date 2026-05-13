import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import GoldButton from '../../../components/ui/GoldButton';

const { width } = Dimensions.get('window');

export default function OperatorScreen({ navigation }) {
  const [operator, setOperator] = useState('MTN');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retrait</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>Où souhaitez-vous{'\n'}recevoir les fonds ?</Text>

        <View style={styles.operatorRow}>
          {[
            { id: 'MTN', label: 'MTN Money', color: '#FFCC00', textColor: '#1B1C1A' },
            { id: 'Moov', label: 'Moov Money', color: '#005BBB', textColor: '#FFFFFF' },
          ].map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[styles.operatorCard, operator === op.id && styles.operatorCardActive]}
              onPress={() => setOperator(op.id)}
            >
              {operator === op.id && (
                <View style={styles.check}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
              <View style={[styles.logoPlaceholder, { backgroundColor: op.color }]}>
                <Text style={[styles.logoText, { color: op.textColor }]}>{op.id}</Text>
              </View>
              <Text
                style={[styles.operatorName, operator === op.id && styles.operatorNameActive]}
                numberOfLines={2}
              >
                {op.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Les retraits sont instantanés au Bénin. DiasporaConnect ne prélève aucun frais sur le retrait.
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton
          title="Continuer"
          onPress={() => navigation.navigate('WithdrawConfirm', { operator })}
        />
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
  headerTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  instruction: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colors.onSurface,
    marginBottom: spacing.xl,
    lineHeight: 30,
    flexShrink: 1,
  },
  operatorRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  operatorCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadows.diffuse,
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
  },
  operatorCardActive: { borderColor: colors.primary },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontFamily: fonts.title, fontSize: 14 },
  operatorName: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  operatorNameActive: { fontFamily: fonts.title, color: colors.onSurface },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#FFF', fontSize: 12, fontFamily: fonts.title },
  infoBox: {
    padding: spacing.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208,197,178,0.15)',
    backgroundColor: colors.surface,
  },
});
