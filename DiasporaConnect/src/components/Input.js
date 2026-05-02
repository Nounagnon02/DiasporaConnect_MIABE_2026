// ============================================================
// DIASPORA CONNECT — Input Component (Floating Label)
// ============================================================
import React, { useState, useRef } from 'react';
import {
  View, TextInput, Text, StyleSheet, TouchableOpacity, Animated
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  secureTextEntry = false,
  rightElement = null,
  leftElement = null,
  error = null,
  style,
  inputStyle,
  multiline = false,
  editable = true,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animVal = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animVal, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocusProp && onFocusProp();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animVal, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlurProp && onBlurProp();
  };

  const labelTop = animVal.interpolate({ inputRange: [0, 1], outputRange: [18, 6] });
  const labelSize = animVal.interpolate({ inputRange: [0, 1], outputRange: [16, 11] });
  const labelColor = isFocused ? COLORS.secondary : COLORS.textMuted;

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          !editable && styles.containerDisabled,
        ]}
      >
        {leftElement && <View style={styles.leftEl}>{leftElement}</View>}
        <View style={styles.inputWrapper}>
          <Animated.Text
            style={[
              styles.label,
              { top: labelTop, fontSize: labelSize, color: labelColor },
            ]}
          >
            {label}
          </Animated.Text>
          <TextInput
            style={[
              styles.input,
              leftElement ? styles.inputWithLeft : null,
              rightElement ? styles.inputWithRight : null,
              multiline && styles.inputMultiline,
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? placeholder : ''}
            placeholderTextColor={COLORS.textMuted}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            editable={editable}
            autoCapitalize="none"
          />
        </View>
        {rightElement && <View style={styles.rightEl}>{rightElement}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: 56,
    paddingHorizontal: SPACING.base,
    overflow: 'hidden',
  },
  containerFocused: { borderColor: COLORS.borderFocus },
  containerError: { borderColor: COLORS.error },
  containerDisabled: { backgroundColor: COLORS.bgSecondary, opacity: 0.7 },
  inputWrapper: { flex: 1, position: 'relative' },
  label: {
    position: 'absolute',
    left: 0,
    fontWeight: TYPOGRAPHY.medium,
    zIndex: 1,
  },
  input: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    paddingTop: 18,
    paddingBottom: 6,
    paddingHorizontal: 0,
    fontWeight: TYPOGRAPHY.medium,
  },
  inputWithLeft: { paddingLeft: SPACING.sm },
  inputWithRight: { paddingRight: SPACING.sm },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  leftEl: { marginRight: SPACING.sm },
  rightEl: { marginLeft: SPACING.sm },
  error: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: TYPOGRAPHY.medium,
  },
});

export default Input;
