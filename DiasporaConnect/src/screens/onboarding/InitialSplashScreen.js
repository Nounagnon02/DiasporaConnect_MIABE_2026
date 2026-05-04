import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, spacing } from '../../theme/theme';
import BeninLogoSVG from '../../components/ui/BeninLogoSVG';

const { width } = Dimensions.get('window');

export default function InitialSplashScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, damping: 14, stiffness: 120, useNativeDriver: true }),
      ]),
    ]).start();
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(1100),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#6B4F00', '#8B6800', '#C9A020', '#E8B800']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Cercles décoratifs d'arrière-plan */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center' }}>
        <View style={styles.logoCard}>
          <BeninLogoSVG width={110} height={110} />
        </View>
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        DiasporaConnect
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        The Private Ledger
      </Animated.Text>

      <Animated.View style={[styles.loadingDots, { opacity: taglineOpacity }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotMid]} />
        <View style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -width * 0.4,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -width * 0.2,
  },
  logoCard: {
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: '#FFFFFF',
    letterSpacing: -0.3,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotMid: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
