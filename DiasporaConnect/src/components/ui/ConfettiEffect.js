/**
 * ConfettiEffect — Animation de confettis pour le succès d'un transfert
 * Implémentation légère sans dépendance externe — particules SVG animées
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const COLORS = ['#755B00', '#C9A84C', '#F5E6C8', '#1B4A3A', '#C75B39', '#D4A574'];
const PARTICLE_COUNT = 28;

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function Particle({ delay }) {
  const startX = randomBetween(0.1, 0.9) * W;
  const y     = useRef(new Animated.Value(-20)).current;
  const rot   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size  = randomBetween(6, 12);
  const isRect = Math.random() > 0.5;

  useEffect(() => {
    const targetY = randomBetween(H * 0.4, H * 0.85);
    const duration = randomBetween(1200, 2200);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(y, { toValue: targetY, duration, useNativeDriver: true }),
        Animated.timing(rot, { toValue: randomBetween(-3, 3) * Math.PI, duration, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(duration * 0.6),
          Animated.timing(opacity, { toValue: 0, duration: duration * 0.4, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const rotate = rot.interpolate({ inputRange: [-10, 10], outputRange: ['-360deg', '360deg'] });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [{ translateX: startX }, { translateY: y }, { rotate }],
          opacity,
          width: isRect ? size : size,
          height: isRect ? size * 0.5 : size,
          borderRadius: isRect ? 2 : size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

export default function ConfettiEffect({ active }) {
  if (!active) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} delay={i * 60} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    top: 0,
  },
});
