import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { colors, fonts, spacing } from '../../theme/theme';
import Badge from './Badge';

const { width } = Dimensions.get('window');

// Icône directionnelle en View pure — pas de glyphe Unicode
function DirectionIcon({ isSend }) {
  return (
    <View style={[styles.dirIcon, isSend ? styles.dirSend : styles.dirReceive]}>
      {/* Flèche diagonale : ligne + tête */}
      <View style={[styles.dirShaft, isSend ? styles.dirShaftSend : styles.dirShaftReceive]} />
    </View>
  );
}

export default function TransactionItem({ transaction, onPress }) {
  const isSend = transaction.type === 'send';
  const amountStr = new Intl.NumberFormat('fr-FR').format(transaction.amountFCFA || 0);

  const scale = useRef(new Animated.Value(1)).current;
  const animatedStyle = { transform: [{ scale }] };

  const onPressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Gauche */}
        <View style={styles.left}>
          <View style={[styles.iconContainer, isSend ? styles.iconSend : styles.iconReceive]}>
            <Text style={[styles.iconText, { color: isSend ? colors.onSurfaceVariant : colors.primary }]}>
              {isSend ? 'ENV' : 'REC'}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {transaction.recipient || transaction.sender || 'Inconnu'}
            </Text>
            <Text style={styles.date}>
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Droite */}
        <View style={styles.right}>
          <Text
            style={[styles.amount, { color: isSend ? colors.onSurface : colors.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {isSend ? '-' : '+'}{amountStr} F
          </Text>
          <Badge status={transaction.status} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208, 197, 178, 0.15)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  iconSend: {
    backgroundColor: 'rgba(208, 197, 178, 0.2)',
  },
  iconReceive: {
    backgroundColor: 'rgba(117, 91, 0, 0.08)',
  },
  iconText: {
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  dirIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirSend: {},
  dirReceive: {},
  dirShaft: {
    width: 2,
    height: 12,
    borderRadius: 1,
  },
  dirShaftSend: { backgroundColor: colors.onSurfaceVariant },
  dirShaftReceive: { backgroundColor: colors.primary },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.title,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 2,
  },
  date: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  right: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: width * 0.38,
  },
  amount: {
    fontFamily: fonts.label,
    fontSize: 15,
    letterSpacing: -0.02,
    marginBottom: 4,
    flexShrink: 1,
  },
});
