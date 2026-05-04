import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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
  prefix,
  suffix,
  onSuffixPress,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  const progress = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  const labelTop = progress.interpolate({ inputRange: [0, 1], outputRange: [20, 6] });
  const labelFontSize = progress.interpolate({ inputRange: [0, 1], outputRange: [16, 11] });

  const labelStyle = {
    top: labelTop,
    fontSize: labelFontSize,
    color: isFocused ? colors.primary : colors.onSurfaceVariant,
  };

  const onFocus = () => {
    setIsFocused(true);
    Animated.timing(progress, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  const onBlur = () => {
    setIsFocused(false);
    if (!value) Animated.timing(progress, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      <View style={[styles.row, isFocused && styles.rowFocused]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.outlineVariant}
          autoCapitalize={autoCapitalize}
        />
        {suffix ? (
          <TouchableOpacity onPress={onSuffixPress} style={styles.suffix}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
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
    justifyContent: 'flex-end',
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    fontFamily: fonts.body,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.4)',
    marginBottom: 4,
  },
  rowFocused: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
    paddingVertical: 6,
  },
  inputFocused: {
    // border handled on row via parent state — override row border
  },
  prefix: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginRight: 4,
  },
  suffix: {
    paddingLeft: spacing.sm,
  },
  suffixText: {
    fontFamily: fonts.label,
    fontSize: 14,
    color: colors.primary,
  },
});
