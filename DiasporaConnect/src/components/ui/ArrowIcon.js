import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';

/**
 * ArrowIcon — flèche rendue en View pure, sans fontFamily.
 * Évite le bug de substitution de glyphe avec PublicSans / Newsreader.
 *
 * Props :
 *   direction : 'right' (défaut) | 'left' | 'up-right' | 'down-left'
 *   color     : string (défaut colors.primary)
 *   size      : number (défaut 16) — longueur totale en px
 *   thickness : number (défaut 2)
 */
export default function ArrowIcon({
  direction = 'right',
  color = colors.primary,
  size = 16,
  thickness = 2,
}) {
  const headSize = Math.round(size * 0.38);

  // Rotation selon direction
  const rotations = {
    right:      '0deg',
    left:       '180deg',
    up:         '-90deg',
    down:       '90deg',
    'up-right': '-45deg',
    'down-left':'135deg',
  };
  const rotate = rotations[direction] || '0deg';

  return (
    <View style={[styles.wrap, { width: size, transform: [{ rotate }] }]}>
      <View style={[styles.shaft, { backgroundColor: color, height: thickness, flex: 1 }]} />
      <View style={[
        styles.head,
        {
          width: headSize,
          height: headSize,
          borderTopWidth: thickness,
          borderRightWidth: thickness,
          borderColor: color,
          marginLeft: -(headSize / 2),
        },
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shaft: {
    borderRadius: 1,
  },
  head: {
    transform: [{ rotate: '45deg' }],
  },
});
