// ============================================================
// DIASPORA CONNECT — Reusable Button Component
// ============================================================
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'success'
  size = 'md',           // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'right',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getContainerStyle = () => {
    const base = [styles.base, styles[size]];
    if (fullWidth) base.push(styles.fullWidth);
    if (disabled) base.push(styles.disabled);
    else {
      if (variant === 'primary') base.push(styles.primary);
      if (variant === 'secondary') base.push(styles.secondary);
      if (variant === 'ghost') base.push(styles.ghost);
      if (variant === 'success') base.push(styles.success);
    }
    if (style) base.push(style);
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`text_${size}`]];
    if (disabled) base.push(styles.textDisabled);
    else {
      if (variant === 'primary') base.push(styles.textPrimary);
      if (variant === 'secondary') base.push(styles.textSecondary);
      if (variant === 'ghost') base.push(styles.textGhost);
      if (variant === 'success') base.push(styles.textSuccess);
    }
    if (textStyle) base.push(textStyle);
    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? COLORS.primary : COLORS.textWhite}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  // Sizes
  sm: { height: 44, paddingHorizontal: SPACING.base },
  md: { height: 56, paddingHorizontal: SPACING.xl },
  lg: { height: 60, paddingHorizontal: SPACING['2xl'] },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: COLORS.bgSecondary,
  },
  success: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
  },

  // Text
  text: { fontWeight: TYPOGRAPHY.bold, letterSpacing: 0.3 },
  textPrimary: { color: COLORS.textWhite },
  textSecondary: { color: COLORS.primary },
  textGhost: { color: COLORS.textPrimary },
  textSuccess: { color: COLORS.textWhite },
  textDisabled: { color: COLORS.disabledText },

  // Text sizes
  text_sm: { fontSize: TYPOGRAPHY.sm },
  text_md: { fontSize: TYPOGRAPHY.base },
  text_lg: { fontSize: TYPOGRAPHY.lg },

  // Icons
  iconLeft: { marginRight: SPACING.sm },
  iconRight: { marginLeft: SPACING.sm },
});

export default Button;
