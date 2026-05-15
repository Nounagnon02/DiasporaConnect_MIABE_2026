import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import ArrowIcon from '../../components/ui/ArrowIcon';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function RoleSelectScreen({ navigation }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowIcon direction="left" color={colors.primary} size={22} thickness={2} />
        </TouchableOpacity>
        <Text style={styles.brand}>DiasporaConnect</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero — emojis conservés */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['rgba(117,91,0,0.07)', 'rgba(201,168,76,0.11)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBg}
          >
            <View style={styles.heroIconsRow}>
              <View style={styles.heroNode}>
                <Text style={styles.heroEmoji}>🌍</Text>
                <Text style={styles.heroNodeLabel}>{t('roles.diasporaLabel')}</Text>
              </View>

              <View style={styles.heroArrowTrack}>
                <View style={styles.heroArrowLine} />
                <View style={styles.heroArrowDot} />
                <View style={styles.heroArrowLine} />
              </View>

              <View style={styles.heroNode}>
                <Text style={styles.heroEmoji}>🇧🇯</Text>
                <Text style={styles.heroNodeLabel}>{t('roles.beninLabel')}</Text>
              </View>
            </View>

            <Text
              style={styles.heroCaption}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {t('roles.heroCaption')}
            </Text>
          </LinearGradient>
        </View>

        {/* Titre */}
        <Text style={styles.title}>{t('roles.title')}</Text>
        <Text style={styles.subtitle}>{t('roles.subtitle')}</Text>

        {/* Card Expéditeur */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('SenderAuth')}
        >
          <View style={styles.cardIconWrap}>
            <Text style={styles.cardEmoji}>🌍</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{t('roles.sender.title')}</Text>
            <Text style={styles.cardDesc}>{t('roles.sender.desc')}</Text>
          </View>
          <ArrowIcon direction="right" color={colors.primary} size={20} thickness={2} />
        </TouchableOpacity>

        {/* Card Destinataire */}
        <TouchableOpacity
          style={styles.cardSecondary}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('ReceiverAuth')}
        >
          <View style={styles.cardIconWrap}>
            <Text style={styles.cardEmoji}>🇧🇯</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{t('roles.recipient.title')}</Text>
            <Text style={styles.cardDesc}>{t('roles.recipient.desc')}</Text>
          </View>
          <ArrowIcon direction="right" color={colors.primary} size={20} thickness={2} />
        </TouchableOpacity>

        {/* Note sécurité */}
        <View style={styles.footNote}>
          <Ionicons name="lock-closed" size={12} color={colors.onSurfaceVariant} />
          <Text style={styles.footNoteText}>{t('auth.securityPromise')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: fonts.display, fontSize: 17, color: colors.primary },
  placeholder: { width: 36 },

  // Scroll
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },

  // Hero
  heroContainer: { marginBottom: spacing.xl },
  heroBg: {
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  heroIconsRow: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', marginBottom: spacing.md,
  },
  heroNode: { alignItems: 'center', gap: 4 },
  heroEmoji: { fontSize: 36 },
  heroNodeLabel: { fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant },
  heroArrowTrack: {
    flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md,
  },
  heroArrowLine: { flex: 1, height: 2, backgroundColor: colors.primaryContainer, opacity: 0.6 },
  heroArrowDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary, marginHorizontal: 4,
  },
  heroCaption: {
    fontFamily: fonts.label, fontSize: 13, color: colors.primary,
    letterSpacing: 0.2, textAlign: 'center', width: '100%',
  },

  // Textes
  title: {
    fontFamily: fonts.display, fontSize: 32, color: colors.onSurface,
    marginBottom: spacing.sm, letterSpacing: -0.5, lineHeight: 40,
  },
  subtitle: {
    fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant,
    marginBottom: spacing.xl, lineHeight: 24,
  },

  // Cards
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(117, 91, 0, 0.15)',
    ...shadows.diffuse,
  },
  cardSecondary: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(208, 197, 178, 0.3)',
  },
  cardIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(117,91,0,0.06)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0,
  },
  cardEmoji: { fontSize: 28 },
  cardText: { flex: 1, marginRight: spacing.md },
  cardTitle: { fontFamily: fonts.title, fontSize: 16, color: colors.onSurface, marginBottom: 4 },
  cardDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 20 },

  // Footer
  footNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, marginTop: spacing.lg,
  },
  footNoteText: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant },
});
