import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '../../theme/theme';

const TAB_ICONS = {
  Home:       { active: 'home',        inactive: 'home-outline' },
  Calculator: { active: 'paper-plane', inactive: 'paper-plane-outline' },
  History:    { active: 'time',        inactive: 'time-outline' },
  Profile:    { active: 'person',      inactive: 'person-outline' },
  Withdraw:   { active: 'wallet',      inactive: 'wallet-outline' },
};

function TabItem({ route, isFocused, options, onPress }) {
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.85)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.55)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1 : 0.85,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0.55,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const icons = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = isFocused ? icons.active : icons.inactive;
  const label = options.tabBarLabel || route.name;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.tab}
      activeOpacity={0.7}
    >
      {/* Pill indicateur actif */}
      {isFocused && <View style={styles.activePill} />}

      <Animated.View style={{ alignItems: 'center', gap: 4, transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? colors.primary : colors.onSurfaceVariant}
        />
        <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function GlassBottomNav({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom || 0;
  const barHeight = 64 + bottomPad;

  return (
    <View style={[styles.wrapper, { height: barHeight }]}>
      {/* Bordure top subtile */}
      <View style={styles.topBorder} />

      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint="light"
        style={styles.blur}
      >
        <View style={[styles.overlay, { paddingBottom: bottomPad }]}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                key={route.key}
                route={route}
                isFocused={isFocused}
                options={options}
                onPress={onPress}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(208,197,178,0.35)',
    zIndex: 10,
  },
  blur: { flex: 1 },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(250,249,245,0.92)',
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
  },
});
