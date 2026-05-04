import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/theme';

const { width } = Dimensions.get('window');
const W = width * 0.85;
const H = 140;

// Points de la courbe de Bézier quadratique : M 40 80 Q W/2 20 W-40 80
const P0 = { x: 40, y: 80 };
const P1 = { x: W / 2, y: 20 };
const P2 = { x: W - 40, y: 80 };

// Calcul point sur courbe de Bézier quadratique
function bezier(t, p0, p1, p2) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}

export default function ConnectionAnim() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: 2400, useNativeDriver: true })
    ).start();
  }, []);

  const translateX = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      P0.x - 7,
      bezier(0.25, P0, P1, P2).x - 7,
      bezier(0.5, P0, P1, P2).x - 7,
      bezier(0.75, P0, P1, P2).x - 7,
      P2.x - 7,
    ],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      P0.y - 7,
      bezier(0.25, P0, P1, P2).y - 7,
      bezier(0.5, P0, P1, P2).y - 7,
      bezier(0.75, P0, P1, P2).y - 7,
      P2.y - 7,
    ],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  const particleStyle = { transform: [{ translateX }, { translateY }], opacity };

  const path = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;

  return (
    <View style={[styles.container, { width: W, height: H }]}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        {/* Ligne de fond */}
        <Path
          d={path}
          stroke={colors.surfaceContainerLow}
          strokeWidth={3}
          fill="none"
          strokeDasharray="8,6"
        />
        {/* Ligne gold */}
        <Path
          d={path}
          stroke={colors.primaryContainer}
          strokeWidth={2}
          fill="none"
          opacity={0.5}
        />
        {/* Nœud gauche (Europe) */}
        <Circle cx={P0.x} cy={P0.y} r={18} fill={colors.primary} opacity={0.15} />
        <Circle cx={P0.x} cy={P0.y} r={12} fill={colors.primary} />
        <SvgText x={P0.x} y={P0.y + 5} textAnchor="middle" fontSize={12}>🇫🇷</SvgText>
        {/* Nœud droit (Bénin) */}
        <Circle cx={P2.x} cy={P2.y} r={18} fill={colors.primaryContainer} opacity={0.15} />
        <Circle cx={P2.x} cy={P2.y} r={12} fill={colors.primaryContainer} />
        <SvgText x={P2.x} y={P2.y + 5} textAnchor="middle" fontSize={12}>🇧🇯</SvgText>
      </Svg>

      {/* Particule dorée animée */}
      <Animated.View style={[styles.particle, particleStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
