import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../theme/theme';

export default function ImpactScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impact</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heroStat}>1 247</Text>
        <Text style={styles.heroLabel}>Familles accompagnées</Text>

        <View style={styles.savingsCard}>
          <Text style={styles.savingsAmount}>18 653 USD</Text>
          <Text style={styles.savingsLabel}>Réinjectés dans l'économie béninoise grâce aux frais évités</Text>
        </View>

        <Text style={styles.sectionTitle}>Objectifs de Développement Durable</Text>

        <View style={styles.oddCard}>
          <Text style={styles.oddIcon}>🏚</Text>
          <View style={styles.oddText}>
            <Text style={styles.oddTitle}>ODD 1 : Pas de pauvreté</Text>
            <Text style={styles.oddDesc}>Réduction des frais pour les plus vulnérables.</Text>
          </View>
        </View>

        <View style={styles.oddCard}>
          <Text style={styles.oddIcon}>⚖️</Text>
          <View style={styles.oddText}>
            <Text style={styles.oddTitle}>ODD 10 : Inégalités réduites</Text>
            <Text style={styles.oddDesc}>Démocratisation des services financiers.</Text>
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  headerTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  heroStat: {
    fontFamily: fonts.display,
    fontSize: 64,
    color: colors.onSurface,
    letterSpacing: -0.02,
    textAlign: 'center',
  },
  heroLabel: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  savingsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.diffuse,
  },
  savingsAmount: {
    fontFamily: fonts.label,
    fontSize: 32,
    color: colors.primary, // Gold
    letterSpacing: letterSpacing.amounts,
    marginBottom: spacing.sm,
  },
  savingsLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.onSurface,
    marginBottom: spacing.lg,
  },
  oddCard: {
    backgroundColor: colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  oddIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  oddText: {
    flex: 1,
  },
  oddTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 4,
  },
  oddDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
});
