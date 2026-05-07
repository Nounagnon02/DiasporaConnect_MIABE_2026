import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import useStore from '../../store/useStore';

const HOW_IT_WORKS = [
  { step: '1', text: 'Partagez votre code unique avec un ami de la diaspora' },
  { step: '2', text: 'Il s\'inscrit et effectue son premier transfert' },
  { step: '3', text: 'Vous recevez 0.50 USD en cUSD sur votre wallet Celo' },
];

export default function ReferralScreen({ navigation }) {
  const { referral, senderUser } = useStore();
  const [copied, setCopied] = useState(false);
  const code = referral?.code || `${(senderUser?.name || 'USER').toUpperCase().slice(0, 4)}2026`;

  const handleCopy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rejoins DiasporaConnect et envoie de l'argent au Bénin avec moins de 1% de frais ! Utilise mon code ${code} pour ton premier transfert. 🌍`,
        title: 'DiasporaConnect — Transfert sans frais',
      });
    } catch {}
  };

  const formatUSD = (n) => `${(n || 0).toFixed(2)} USD`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parrainage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient colors={['#755B00', '#C9A84C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
          <Text style={styles.heroTitle}>Invitez, gagnez</Text>
          <Text style={styles.heroSub}>0.50 USD par ami parrainé{'\n'}directement sur votre wallet Celo</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{referral?.referredCount || 0}</Text>
              <Text style={styles.statLabel}>Amis parrainés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatUSD(referral?.earnedUSD)}</Text>
              <Text style={styles.statLabel}>Gains totaux</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatUSD(referral?.pendingUSD)}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Code */}
        <Text style={styles.sectionTitle}>Votre code unique</Text>
        <View style={styles.codeCard}>
          <Text style={styles.codeText}>{code}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={colors.primary} />
            <Text style={styles.copyText}>{copied ? 'Copié !' : 'Copier'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={18} color="#FFF" />
          <Text style={styles.shareBtnText}>Partager mon code</Text>
        </TouchableOpacity>

        {/* Comment ça marche */}
        <Text style={styles.sectionTitle}>Comment ça marche</Text>
        {HOW_IT_WORKS.map(item => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNum}>{item.step}</Text>
            </View>
            <Text style={styles.stepText}>{item.text}</Text>
          </View>
        ))}

        {/* Info légale */}
        <View style={styles.legalBox}>
          <Text style={styles.legalText}>
            Les récompenses sont créditées en cUSD sur Celo Alfajores après la confirmation du premier transfert de votre filleul (minimum 50 USD).
          </Text>
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
  backBtn: { padding: 4, width: 40 },
  headerTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.onSurface, letterSpacing: -0.4 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  heroCard: {
    borderRadius: radius.md, padding: spacing.xl, marginBottom: spacing.xl, ...shadows.diffuse,
  },
  heroTitle: { fontFamily: fonts.display, fontSize: 28, color: '#FFF', letterSpacing: -0.56, marginBottom: spacing.sm },
  heroSub: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 21, marginBottom: spacing.xl },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fonts.label, fontSize: 18, color: '#FFF', letterSpacing: -0.36 },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },

  sectionTitle: {
    fontFamily: fonts.title, fontSize: 13, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.md,
  },
  codeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, ...shadows.diffuse, marginBottom: spacing.md,
  },
  codeText: { fontFamily: fonts.label, fontSize: 24, color: colors.primary, letterSpacing: 2 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: spacing.sm },
  copyText: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },

  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, gap: spacing.sm, marginBottom: spacing.xl,
  },
  shareBtnText: { fontFamily: fonts.title, fontSize: 15, color: '#FFF' },

  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    marginBottom: spacing.md,
  },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(117,91,0,0.1)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNum: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },
  stepText: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.onSurface, lineHeight: 21 },

  legalBox: {
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.sm,
    padding: spacing.md, marginTop: spacing.md,
  },
  legalText: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant, lineHeight: 17 },
});
