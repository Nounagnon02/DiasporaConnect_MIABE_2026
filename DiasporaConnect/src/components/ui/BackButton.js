import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';
import ArrowIcon from './ArrowIcon';

export default function BackButton({ onPress, color = colors.primary }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.btn}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <ArrowIcon direction="left" color={color} size={22} thickness={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
