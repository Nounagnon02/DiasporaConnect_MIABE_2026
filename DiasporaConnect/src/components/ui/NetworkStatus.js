/**
 * NetworkStatus — Indicateur de connectivité + bannière hors-ligne
 * Utilise @react-native-community/netinfo
 */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import useStore from '../../store/useStore';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const { setOfflineMode, offlineQueue } = useStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(connected);
      setOfflineMode?.(!connected);

      if (!connected) {
        setWasOffline(true);
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      } else if (connected && wasOffline) {
        setShowReconnected(true);
        Animated.timing(slideAnim, { toValue: -60, duration: 300, useNativeDriver: true }).start();
        setTimeout(() => setShowReconnected(false), 3000);
      }
    });
    return () => unsubscribe();
  }, [wasOffline]);

  const queueCount = offlineQueue?.length || 0;

  if (isConnected && !showReconnected) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        isConnected ? styles.bannerOnline : styles.bannerOffline,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Ionicons
        name={isConnected ? 'wifi' : 'wifi-outline'}
        size={16}
        color={isConnected ? '#2D5A4A' : colors.onPrimary}
      />
      <Text style={[styles.bannerText, isConnected && styles.bannerTextOnline]}>
        {isConnected
          ? `Reconnecté${queueCount > 0 ? ` · ${queueCount} transfert(s) en attente envoyé(s)` : ''}`
          : `Hors-ligne${queueCount > 0 ? ` · ${queueCount} transfert(s) en file d'attente` : ' · Mode calculateur disponible'}`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    marginHorizontal: spacing.xl, marginBottom: spacing.sm,
    borderRadius: radius.md,
  },
  bannerOffline: { backgroundColor: colors.onSurface },
  bannerOnline:  { backgroundColor: 'rgba(45,90,74,0.12)', borderWidth: 1, borderColor: 'rgba(45,90,74,0.2)' },
  bannerText: { fontFamily: fonts.label, fontSize: 12, color: colors.onPrimary, flex: 1 },
  bannerTextOnline: { color: '#2D5A4A' },
});
