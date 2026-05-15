import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Clipboard, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius, shadows } from '../../../theme/theme';
import GoldButton from '../../../components/ui/GoldButton';
import SecondaryButton from '../../../components/ui/SecondaryButton';
import ConfettiEffect from '../../../components/ui/ConfettiEffect';
import useStore from '../../../store/useStore';
import { useTabBarHeight } from '../../../hooks/useTabBarHeight';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function Step4Screen({ navigation }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const bottomPad = Math.max(insets.bottom, 16);
  const { transferData, resetTransferData } = useStore();
  const [confettiActive, setConfettiActive] = React.useState(false);

  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
    // Lancer les confettis après l'animation du check
    setTimeout(() => setConfettiActive(true), 400);
    setTimeout(() => setConfettiActive(false), 3500);
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(progressWidth, { toValue: 100, duration: 60000, useNativeDriver: false }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const checkStyle = { transform: [{ scale: checkScale }], opacity: checkOpacity };
  const contentStyle = { opacity: contentOpacity };
  const progressStyle = {
    width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
  };
  const dotStyle = { opacity: dotOpacity };

  const shortHash = (h) => h ? h.slice(0, 10) + '...' + h.slice(-8) : '0x3f4a...8b2c';

  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    Clipboard.setString(transferData.txHash || '0x3f4a8b2c');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recipientName = transferData.recipient?.name || t('send.yourRecipient');
  const recipientGets = transferData.recipientGets?.toFixed(2) || '198.00';
  const savings = transferData.savings?.toFixed(2) || '26.20';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ConfettiEffect active={confettiActive} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Checkmark animé */}
        <Animated.View style={[styles.checkWrapper, checkStyle]}>
          <Ionicons name="checkmark" size={24} color="#FFF" />
        </Animated.View>

        <Animated.View style={[styles.contentBlock, contentStyle]}>
          <Text style={styles.title}>{t('send.transferSentSuccess')}</Text>
          <Text style={styles.subtitle} numberOfLines={3}>
            <Text style={styles.recipientName}>{recipientName}</Text>
            {' '}{t('send.willReceive')}{' '}
            <Text style={styles.amountInline}>{recipientGets} USD</Text>
          </Text>

          {/* Card détails TX */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('send.txRef')}</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                TX-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-001
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('history.txHash')}</Text>
              <View style={styles.hashRow}>
                <Text style={styles.hashText} numberOfLines={1} ellipsizeMode="middle">
                  {shortHash(transferData.txHash)}
                </Text>
                <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
                  <Text style={styles.copyText}>{copied ? t('common.copied') : t('common.copy')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('history.status')}</Text>
              <View style={styles.statusRow}>
                <Animated.View style={[styles.statusDot, dotStyle]} />
                <Text style={styles.statusText}>{t('tracker.inProgress')}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t('profile.network')}</Text>
              <Text style={styles.rowValue}>Celo Alfajores</Text>
            </View>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t('tracker.confirmed')}</Text>
              <Text style={styles.progressSub}>~60 {t('common.seconds')}</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
          </View>

          {/* Encart économie */}
          <View style={styles.savingsBox}>
            <Text style={styles.savingsText}>
              {t('send.youSaved')}{' '}
              <Text style={styles.savingsAmount}>{savings} USD</Text>
              {' '}vs. Western Union
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: tabBarHeight + 16 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + spacing.md }]}>
        <GoldButton
          title={t('send.newTransfer')}
          onPress={() => {
            resetTransferData();
            navigation.navigate('SenderApp', { screen: 'Calculator' });
          }}
          style={styles.btnFull}
        />
        <View style={{ height: spacing.md }} />
        <SecondaryButton
          title={t('tracker.title')}
          onPress={() => navigation.navigate('TransferTracker')}
        />
        <View style={{ height: spacing.md }} />
        <SecondaryButton
          title={t('history.title')}
          onPress={() => {
            resetTransferData();
            navigation.navigate('SenderApp', { screen: 'History' });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  checkWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.diffuse,
  },
  checkText: {
    fontFamily: fonts.title,
    fontSize: 40,
    color: colors.onPrimary,
  },
  contentBlock: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.onSurface,
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: spacing.sm,
    flexShrink: 1,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 23,
    flexShrink: 1,
    paddingHorizontal: spacing.sm,
  },
  recipientName: {
    fontFamily: fonts.title,
    color: colors.onSurface,
  },
  amountInline: {
    fontFamily: fonts.label,
    color: colors.primary,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(208,197,178,0.15)',
  },
  rowLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flexShrink: 0,
  },
  rowValue: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  hashText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurface,
    flexShrink: 1,
  },
  copyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(117,91,0,0.1)',
    borderRadius: 4,
    flexShrink: 0,
  },
  copyText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.primary,
  },
  progressSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurface,
  },
  progressSub: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  savingsBox: {
    width: '100%',
    backgroundColor: 'rgba(117,91,0,0.06)',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  savingsText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    flexShrink: 1,
  },
  savingsAmount: {
    fontFamily: fonts.label,
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
  },
  btnFull: { width: '100%' },
});
