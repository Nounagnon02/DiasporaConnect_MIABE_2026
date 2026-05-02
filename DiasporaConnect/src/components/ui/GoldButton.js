import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadows, radius } from '../../theme/theme';

export default function GoldButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.wrapper, style, disabled && styles.disabled]}
      disabled={disabled}
    >
      <LinearGradient
        colors={['#755B00', '#C9A84C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...shadows.diffuse,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gradient: {
    height: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.onPrimary,
    fontFamily: fonts.title,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
