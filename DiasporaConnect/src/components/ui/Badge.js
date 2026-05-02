import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../theme/theme';

export default function Badge({ status, text }) {
  let bgColor = colors.surfaceContainerLow;
  let textColor = colors.onSurfaceVariant;
  let label = text || 'En cours';

  if (status === 'completed' || status === 'success') {
    bgColor = 'rgba(117, 91, 0, 0.1)'; // Gold faint
    textColor = colors.primary; // Gold
    label = text || 'Succès';
  } else if (status === 'failed' || status === 'error') {
    bgColor = 'rgba(186, 26, 26, 0.1)'; // Error faint
    textColor = colors.error;
    label = text || 'Échec';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.round,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.label,
    fontSize: 12,
  },
});
