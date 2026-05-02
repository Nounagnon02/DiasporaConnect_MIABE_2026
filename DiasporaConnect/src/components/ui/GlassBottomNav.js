import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarCore } from '@react-navigation/bottom-tabs'; // Standard tabBar wrapper ? Not necessarily
import { colors, shadows } from '../../theme/theme';

export default function GlassBottomNav(props) {
  // If BlurView doesn't work well on web without proper setup, we fallback gracefully
  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
        <View style={styles.inner}>
          {/* We'll just wrap the standard bottom navigator or map props */}
          {props.children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    ...shadows.glass,
  },
  blurContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // rgba blanc 30%
  },
  inner: {
    flex: 1,
  },
});
