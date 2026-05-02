import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius } from '../../theme/theme';

export default function RoleSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brand}>DiasporaConnect</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Quel est votre rôle ?</Text>
        <Text style={styles.subtitle}>Sélectionnez votre profil pour continuer l'inscription ou la connexion.</Text>

        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.88}
          onPress={() => navigation.navigate('SenderAuth')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>🌍</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Expéditeur (Diaspora)</Text>
              <Text style={styles.cardDesc}>J'envoie de l'argent vers le Bénin depuis l'étranger.</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cardSecondary} 
          activeOpacity={0.88}
          onPress={() => navigation.navigate('ReceiverAuth')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>🇧🇯</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Destinataire (Bénin)</Text>
              <Text style={styles.cardDesc}>Je reçois de l'argent sur mon compte Mobile Money (MTN/Moov).</Text>
            </View>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backBtn: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(117, 91, 0, 0.15)', // light gold border
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardSecondary: {
    backgroundColor: colors.surfaceContainerLow, // Non-primary flow gets low surface
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.md,
  },
  icon: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  arrow: {
    fontFamily: fonts.title,
    fontSize: 24,
    color: colors.primary,
  },
});
