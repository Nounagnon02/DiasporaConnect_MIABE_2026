import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, shadows } from '../../theme/theme';

export const GlassCard = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...shadows.glass,
  },
  blur: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
