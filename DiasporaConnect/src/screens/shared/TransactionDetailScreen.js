import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import Badge from '../../components/ui/Badge';
import ArrowIcon from '../../components/ui/ArrowIcon';

const WU_FEE_PCT = 0.14;

function TimelineStep({ label, time, done, last }) {
  return (
    <View style={styles.timelineStep}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, done && styles.timelineDotDone]} />
        {!last && <View style={[styles.timelineLine, done && styles.timelineLineDone]} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineLabel, done && styles.timelineLabelDone]}>{label}</Text>
        {time ? <Text style={styles.timelineTime}>{time}</Text> : null}
      </View>
    </View>
  );
}

export default function TransactionDetailScreen({ navigation, route }) {
  const { transaction } = route.params || {};
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n || 0));
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const savings = transaction.savedVsWU || (transaction.amountUSD * WU_FEE_PCT - (transaction.fee || 0));
  const isCompleted = transaction.status === 'completed';
  const isPending = transaction.status === 'pending';

  const txDate = new Date(transaction.date);
  const confirmDate = new Date(txDate.getTime() + 47000);
  const withdrawDate = new Date(txDate.getTime() + 120000);

  const handleCopy = () => {
    Clipboard.setString(transaction.txHashFull || transaction.txHash || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          {/* Flèche gauche en View pure */}
          <ArrowIcon direction="left" color={colors.primary} size={20} thickness={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du transfert</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Montant hero */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Montant envoyé</Text>
          <Text
            style={styles.amountFCFA}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            numberOfLines={1}
          >
            {formatFCFA(transaction.amountFCFA)} FCFA
          </Text>
          <Text style={styles.amountUSD}>{transaction.amountUSD} USD</Text>
          <Badge status={transaction.status} />
        </View>

        {/* Détails */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Destinataire</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {transaction.recipient || transaction.sender}
            </Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Opérateur</Text>
            <Text style={styles.valueLabel} numberOfLines={1}>{transaction.operator}</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.valueLabel} numberOfLines={1}>{formatDate(transaction.date)}</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Frais DiasporaConnect</Text>
            <Text style={styles.valueLabel}>{transaction.fee?.toFixed(3) || '0.008'} USD</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Économie vs WU</Text>
            <Text style={styles.valueSavings}>+{savings.toFixed(2)} USD</Text>
          </View>
        </View>

        {/* Blockchain */}
        <View style={styles.blockCard}>
          <Text style={styles.blockTitle}>Blockchain</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Réseau</Text>
            <Text style={styles.valueLabel}>Celo Alfajores</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Hash TX</Text>
            <View style={styles.hashRow}>
              <Text style={styles.hashText} numberOfLines={1} ellipsizeMode="middle">
                {(transaction.txHashFull || transaction.txHash || '').slice(0, 16)}…
              </Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
                <Text style={styles.copyText}>{copied ? '✓' : 'Copier'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sep} />
          <View style={styles.row}>
            <Text style={styles.label}>Confirmations</Text>
            <Text style={styles.valueLabel}>{transaction.confirmations || 0}</Text>
          </View>
          {/* Lien CeloScan — flèche en View pure */}
          <TouchableOpacity
            style={styles.explorerBtn}
            onPress={() => Linking.openURL(`https://alfajores.celoscan.io/tx/${transaction.txHashFull}`)}
          >
            <Text style={styles.explorerText}>Voir sur CeloScan</Text>
            <ArrowIcon color={colors.primary} size={14} thickness={1.5} />
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.blockTitle}>Suivi du transfert</Text>
          <TimelineStep
            label="Envoyé"
            time={txDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            done={true}
          />
          <TimelineStep
            label="Confirmé sur Celo"
            time={isCompleted || isPending
              ? confirmDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : null}
            done={isCompleted || isPending}
          />
          <TimelineStep
            label="Retrait Mobile Money"
            time={isCompleted
              ? withdrawDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : null}
            done={isCompleted}
            last
          />
        </View>

        <View style={{ height: 40 }} />
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
  backBtn: { padding: 4, width: 40, alignItems: 'flex-start' },
  headerTitle: {
    fontFamily: fonts.title, fontSize: 16, color: colors.onSurface,
    flex: 1, textAlign: 'center',
  },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  amountCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, ...shadows.diffuse,
  },
  amountLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 8 },
  amountFCFA: {
    fontFamily: fonts.display, fontSize: 34, color: colors.onSurface,
    letterSpacing: -0.68, marginBottom: 4, width: '100%', textAlign: 'center',
  },
  amountUSD: { fontFamily: fonts.label, fontSize: 16, color: colors.onSurfaceVariant, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.lg, ...shadows.diffuse,
  },
  blockCard: {
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md,
    padding: spacing.lg, marginBottom: spacing.lg,
  },
  blockTitle: {
    fontFamily: fonts.label, fontSize: 11, color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.sm,
  },
  sep: { height: 1, backgroundColor: 'rgba(208,197,178,0.15)' },
  label: { fontFamily: fonts.body, fontSize: 13, color: colors.onSurfaceVariant, flexShrink: 0 },
  value: { fontFamily: fonts.title, fontSize: 13, color: colors.onSurface, flex: 1, textAlign: 'right' },
  valueLabel: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurface, flexShrink: 1, textAlign: 'right' },
  valueSavings: { fontFamily: fonts.label, fontSize: 14, color: colors.primary },
  hashRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' },
  hashText: { fontFamily: fonts.label, fontSize: 12, color: colors.primary, flexShrink: 1 },
  copyBtn: {
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: 'rgba(117,91,0,0.1)', borderRadius: 4, flexShrink: 0,
  },
  copyText: { fontFamily: fonts.label, fontSize: 11, color: colors.primary },
  explorerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.md, gap: 6,
  },
  explorerText: { fontFamily: fonts.title, fontSize: 13, color: colors.primary },
  timelineCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    padding: spacing.lg, ...shadows.diffuse,
  },
  timelineStep: { flexDirection: 'row', minHeight: 48 },
  timelineLeft: { alignItems: 'center', width: 24, marginRight: spacing.md },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 2, borderColor: colors.outlineVariant, marginTop: 4,
  },
  timelineDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  timelineLine: {
    flex: 1, width: 2, backgroundColor: colors.surfaceContainerLow, marginTop: 4, marginBottom: -4,
  },
  timelineLineDone: { backgroundColor: colors.primary, opacity: 0.4 },
  timelineContent: { flex: 1, paddingBottom: spacing.md },
  timelineLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant },
  timelineLabelDone: { fontFamily: fonts.title, color: colors.onSurface },
  timelineTime: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
});
