import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';
import ConnectionAnim from '../../components/animations/ConnectionAnim';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const isSmall = height < 700;

// ─── Slide 1 : simulateur interactif ────────────────────────────────────────
function SimulatorIllustration() {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState('100');
  const EUR_USD = 1.08;
  const USD_FCFA = 612.5;
  const parsed = parseFloat(amount) || 0;
  const received = ((parsed * EUR_USD) * (1 - 0.008) * USD_FCFA);
  const wuReceived = ((parsed * EUR_USD) * (1 - 0.14) * USD_FCFA);
  const savings = received - wuReceived;
  const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n));

  return (
    <View style={styles.simContainer}>
      <View style={styles.simInputRow}>
        <Text style={styles.simLabel}>{t('calculator.youSend')}</Text>
        <View style={styles.simInputWrap}>
          <TextInput
            style={styles.simInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            maxLength={6}
            selectTextOnFocus
          />
          <Text style={styles.simCurrency}>EUR</Text>
        </View>
      </View>
      <View style={styles.simArrow}>
        <Ionicons name="arrow-down" size={20} color={colors.primary} />
      </View>
      <View style={styles.simResultCard}>
        <Text style={styles.simResultLabel}>{t('calculator.recipientGets')}</Text>
        <Text style={styles.simResultAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatFCFA(received)} FCFA
        </Text>
        {savings > 0 && (
          <View style={styles.simSavingsRow}>
            <Ionicons name="sparkles" size={12} color={colors.primary} style={styles.simSavingsIcon} />
            <Text style={styles.simSavings}>+{formatFCFA(savings)} FCFA {t('onboarding.vsWU')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Slide 2 : graphique comparaison frais ───────────────────────────────────
function FeeIllustration() {
  const { t } = useTranslation();
  const barAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 1, duration: 900, delay: 200, useNativeDriver: false,
    }).start();
  }, []);

  const W = width * 0.78;
  const bars = [
    { label: 'WU',  pct: 0.14,  color: '#C0392B' },
    { label: 'MG',  pct: 0.11,  color: '#E67E22' },
    { label: 'WR',  pct: 0.07,  color: '#F39C12' },
    { label: 'DC',  pct: 0.008, color: colors.primary },
  ];
  const maxH = isSmall ? 90 : 110;
  const barW = (W - spacing.xl * 2 - spacing.md * 3) / 4;

  return (
    <View style={{ width: W, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: maxH + 32, gap: spacing.md }}>
        {bars.map((b) => {
          const h = barAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, maxH * (b.pct / 0.14)],
          });
          const isDC = b.label === 'DC';
          return (
            <View key={b.label} style={{ alignItems: 'center', width: barW }}>
              <Animated.View style={{
                width: barW, height: h,
                backgroundColor: isDC ? colors.primary : b.color,
                borderRadius: 4,
                opacity: isDC ? 1 : 0.55,
              }} />
              <Text style={{
                fontFamily: fonts.label, fontSize: 11, marginTop: 6,
                color: isDC ? colors.primary : colors.onSurfaceVariant,
                fontWeight: isDC ? '700' : '400',
              }}>
                {b.label}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.feeBadge}>
        <Text style={styles.feeBadgeText}>{'< 1 %'} {t('calculator.fee').toLowerCase()}</Text>
      </View>
    </View>
  );
}

// ─── Slide 3 : sécurité — STATIQUE, pas d'animation ─────────────────────────
function SecurityIllustration() {
  const { t } = useTranslation();
  const S = isSmall ? 110 : 130;
  const pills = [
    { icon: 'shield-checkmark-outline', label: t('onboarding.security.pill1') },
    { icon: 'lock-closed-outline',      label: t('onboarding.security.pill2') },
    { icon: 'people-outline',           label: t('onboarding.security.pill3') },
  ];

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.shieldOuter, { width: S, height: S }]}>
        <View style={[styles.shieldInner, { width: S * 0.65, height: S * 0.65 }]}>
          <Ionicons
            name="lock-closed"
            size={isSmall ? 36 : 44}
            color={colors.primary}
          />
        </View>
      </View>

      <View style={styles.securityPills}>
        {pills.map((p) => (
          <View key={p.label} style={styles.securityPill}>
            <Ionicons name={p.icon} size={14} color={colors.primary} />
            <Text style={styles.securityPillText}>{p.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const SLIDES = [
    {
      id: '1',
      title: t('onboarding.slide1.title') + '\n' + t('onboarding.slide1.titleAccent'),
      description: t('onboarding.slide1.subtitle'),
      illustration: <SimulatorIllustration />,
    },
    {
      id: '2',
      title: t('onboarding.slide2.title') + '\n' + t('onboarding.slide2.titleAccent'),
      description: t('onboarding.slide2.subtitle'),
      illustration: <FeeIllustration />,
    },
    {
      id: '3',
      title: t('onboarding.slide3.title') + '\n' + t('onboarding.slide3.titleAccent'),
      description: t('onboarding.slide3.subtitle'),
      illustration: <SecurityIllustration />,
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('RoleSelect');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>DiasporaConnect</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RoleSelect')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.skip}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <View style={styles.slidesWrapper}>
        <Animated.FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.illustrationLayer}>
                {item.illustration}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp',
            });
            return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
          })}
        </View>
        <GoldButton
          title={currentIndex === SLIDES.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          onPress={scrollToNext}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  brand: { fontFamily: fonts.display, fontSize: 20, color: colors.primary },
  skip: { fontFamily: fonts.title, fontSize: 14, color: colors.onSurfaceVariant, paddingVertical: spacing.xs },
  slidesWrapper: { flex: 1 },
  slide: {
    width, flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustrationLayer: {
    width: '100%',
    height: isSmall ? height * 0.28 : height * 0.32,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: isSmall ? spacing.lg : spacing.xxl,
  },
  textContainer: { width: '100%', paddingBottom: spacing.md },
  title: {
    fontFamily: fonts.display,
    fontSize: isSmall ? 28 : 34,
    color: colors.onSurface,
    lineHeight: isSmall ? 36 : 44,
    letterSpacing: -0.02,
    marginBottom: spacing.md,
    flexShrink: 1,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: isSmall ? 14 : 16,
    color: colors.onSurfaceVariant,
    lineHeight: isSmall ? 22 : 26,
    flexShrink: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: isSmall ? spacing.lg : spacing.xxl,
    paddingTop: spacing.md,
  },
  indicatorContainer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.xl, gap: 6,
  },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  btn: { width: '100%' },

  // FeeIllustration
  feeBadge: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(117,91,0,0.1)',
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radius.round,
  },
  feeBadgeText: { fontFamily: fonts.label, fontSize: 13, color: colors.primary },

  // SimulatorIllustration
  simContainer: { width: '100%', alignItems: 'center' },
  simInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: spacing.sm },
  simLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.onSurfaceVariant },
  simInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1.5, borderColor: 'rgba(117,91,0,0.2)',
  },
  simInput: {
    fontFamily: fonts.label, fontSize: 22, color: colors.primary,
    minWidth: 60, textAlign: 'right', letterSpacing: -0.44,
  },
  simCurrency: { fontFamily: fonts.label, fontSize: 14, color: colors.onSurfaceVariant, marginLeft: 6 },
  simArrow: { marginVertical: spacing.sm },
  simResultCard: {
    width: '100%', backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md, padding: spacing.lg, alignItems: 'center',
    borderLeftWidth: 3, borderLeftColor: colors.primary,
  },
  simResultLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 4 },
  simResultAmount: { fontFamily: fonts.display, fontSize: isSmall ? 22 : 26, color: colors.onSurface, letterSpacing: -0.52, marginBottom: 4 },
  simSavingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  simSavingsIcon: { marginTop: 1 },
  simSavings: { fontFamily: fonts.label, fontSize: 12, color: colors.primary },

  // SecurityIllustration — STATIQUE
  shieldOuter: {
    borderRadius: 999,
    backgroundColor: 'rgba(117,91,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  shieldInner: {
    borderRadius: 999,
    backgroundColor: 'rgba(117,91,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  securityPills: { gap: spacing.sm, alignItems: 'center' },
  securityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md, paddingVertical: 7,
    borderRadius: radius.round,
  },
  securityPillText: { fontFamily: fonts.label, fontSize: 13, color: colors.onSurface },
});
