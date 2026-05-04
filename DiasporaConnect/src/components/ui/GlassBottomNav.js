import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, fonts } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function GlassBottomNav({ state, descriptors, navigation }) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={Platform.OS === 'ios' ? 60 : 80} tint="light" style={styles.blur}>
        <View style={styles.overlay}>
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

            let iconName;
            if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
            else if (route.name === 'Calculator') iconName = isFocused ? 'send' : 'send-outline';
            else if (route.name === 'History') iconName = isFocused ? 'list' : 'list-outline';
            else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';
            else if (route.name === 'Withdraw') iconName = isFocused ? 'wallet' : 'wallet-outline';
            else iconName = 'ellipse-outline';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={styles.tab}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.primary : colors.onSurfaceVariant}
                />
                <Text style={[styles.label, { color: isFocused ? colors.primary : colors.onSurfaceVariant }]}>
                  {options.tabBarLabel || route.name}
                </Text>
              </TouchableOpacity>
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
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 16,
    right: 16,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  blur: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 10,
  },
});
