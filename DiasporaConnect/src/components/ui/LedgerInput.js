import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme/theme';

export default function LedgerInput({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  placeholder = '',
  secureTextEntry = false,
  style,
  autoCapitalize = 'none',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 6],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.onSurfaceVariant, colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelTop,
            fontSize: labelFontSize,
            color: labelColor,
          },
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholder={isFocused ? placeholder : ''}
        placeholderTextColor={colors.outlineVariant}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    height: 64,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: spacing.md,
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    fontFamily: fonts.body,
  },
  input: {
    flex: 1,
    marginTop: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.5)', // outlineVariant + alpha as alternative for shadow
  },
  inputFocused: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
});
