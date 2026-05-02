// ============================================================
// DIASPORA CONNECT — Recipient Screens (The Private Ledger)
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Animated, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import useStore from '../../store/useStore';
import { MOCK_RECIPIENT_TRANSACTIONS } from '../../services/mockData';
import GoldButton from '../../components/ui/GoldButton';
import { fetchTransactions } from '../../services/apiService';
import { Alert } from 'react-native';
import { API_URL } from '@env';

const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

// ================================================================
// RECIPIENT HOME
// ================================================================
export const RecipientHomeScreen = ({ navigation }) => {
  const { recipientUser, token, transactions, addTransaction } = useStore();
  const userName = recipientUser?.firstName || 'Adjoua';
  const availableFCFA = recipientUser?.availableFCFA || 131191;

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        if (token) {
          const txs = await fetchTransactions(token, 'recipient');
          // In real app, we would update the store with txs
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadTransactions();
  }, [token]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header Asymétrique */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {userName}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileInitials}>{userName.charAt(0)}</Text>
          </View>
        </View>

        {/* Hero Balance */}
        <View style={styles.heroSection}>
          <Text style={styles.balanceLabel}>Disponible à retirer</Text>
          <Text style={styles.balanceFCFA}>{formatFCFA(availableFCFA)} FCFA</Text>
        </View>

        {/* CTA : Retirer maintenant (Gold Gradient Card) */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.ctaWrapper}
          onPress={() => navigation.navigate('Withdraw')}
        >
          <LinearGradient
            colors={['#755B00', '#C9A84C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Retirer maintenant</Text>
              <Text style={styles.ctaSub}>Vers MTN ou Moov Money</Text>
            </View>
            <View style={styles.ctaArrowCircle}>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transferts reçus</Text>
          {MOCK_RECIPIENT_TRANSACTIONS.slice(0, 3).map(tx => (
            <TransactionItem 
              key={tx.id} 
              transaction={tx} 
              onPress={() => {}} 
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};


// ================================================================
// WITHDRAW SCREEN (Manages Operator -> Confirm -> Success)
// ================================================================
export const WithdrawScreen = ({ navigation }) => {
  const { recipientUser, updateRecipientUser, token } = useStore();
  const availableFCFA = recipientUser?.availableFCFA || 131191;
  const [operator, setOperator] = useState('MTN');
  const [step, setStep] = useState('OPERATOR'); // OPERATOR, CONFIRM, SUCCESS
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'SUCCESS') {
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
    }
  }, [step]);

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // In production, we call the backend which triggers the Mobile Money payout
      const response = await fetch(`${API_URL}/recipient/withdraw`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          phone: recipientUser?.phone,
          operator,
          amountFCFA: availableFCFA
        }),
      });

      if (!response.ok) throw new Error("Échec du retrait");

      updateRecipientUser({ availableFCFA: 0 }); // Empty balance locally
      setStep('SUCCESS');
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de traiter le retrait pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      
      {step !== 'SUCCESS' && (
        <View style={styles.headerGeneric}>
          <Text style={styles.headerGenericTitle}>Retrait Mobile Money</Text>
        </View>
      )}

      {step === 'OPERATOR' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.instruction}>Où souhaitez-vous recevoir les fonds ?</Text>
          
          <View style={styles.operatorRow}>
            <TouchableOpacity 
              style={[styles.operatorCard, operator === 'MTN' && styles.operatorCardActive]}
              onPress={() => setOperator('MTN')}
            >
              <Text style={styles.operatorEmoji}>🟡</Text>
              <Text style={[styles.operatorName, operator === 'MTN' && styles.operatorNameActive]}>MTN Money</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.operatorCard, operator === 'Moov' && styles.operatorCardActive]}
              onPress={() => setOperator('Moov')}
            >
              <Text style={styles.operatorEmoji}>🔵</Text>
              <Text style={[styles.operatorName, operator === 'Moov' && styles.operatorNameActive]}>Moov Money</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
          <GoldButton title="Continuer" onPress={() => setStep('CONFIRM')} />
        </ScrollView>
      )}

      {step === 'CONFIRM' && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Opérateur</Text>
              <Text style={styles.confirmValue}>{operator === 'MTN' ? '🟡 MTN Money' : '🔵 Moov Money'}</Text>
            </View>
            <View style={styles.confirmSplitter} />
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Numéro de compte</Text>
              <Text style={styles.confirmPhone}>{recipientUser?.phone || '+229 97 00 00 00'}</Text>
            </View>
            <View style={styles.confirmSplitter} />
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabelBold}>Montant à recevoir</Text>
              <Text style={styles.confirmTotal}>{formatFCFA(availableFCFA)} FCFA</Text>
            </View>
          </View>
          
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>Le transfert est instantané et sécurisé par The Private Ledger. Aucun frais additionnel ne sera prélevé.</Text>
          </View>

          <View style={{ height: 40 }} />
          <GoldButton 
            title={loading ? "Traitement..." : "Confirmer le retrait"} 
            onPress={handleWithdraw} 
            disabled={loading} 
          />
          <TouchableOpacity style={{ marginTop: spacing.md, alignItems: 'center' }} onPress={() => setStep('OPERATOR')} disabled={loading}>
            <Text style={{ fontFamily: fonts.title, color: colors.onSurfaceVariant }}>Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 'SUCCESS' && (
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successIconWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.successIconText}>✓</Text>
          </Animated.View>
          
          <Text style={styles.successTitle}>Retrait en cours de traitement</Text>
          <Text style={styles.successStatus}>Délai estimé : moins de 2 minutes</Text>

          <View style={{ marginTop: spacing.xxl, width: '100%' }}>
            <GoldButton title="Retour à l'accueil" onPress={() => { setStep('OPERATOR'); navigation.navigate('ReceiverHome'); }} />
          </View>
        </View>
      )}

      {step !== 'SUCCESS' && <View style={{ height: 120 }} />}
    </SafeAreaView>
  );
};

// ================================================================
// RECIPIENT PROFILE
// ================================================================
export const RecipientProfileScreen = ({ navigation }) => {
  const { recipientUser, logout } = useStore();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.headerGeneric}>
        <Text style={styles.headerGenericTitle}>Profil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{recipientUser?.firstName} {recipientUser?.lastName}</Text>
          <Text style={styles.profilePhone}>{recipientUser?.phone}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => { logout(); navigation.replace('RoleSelect'); }}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ================================================================
// STYLES
// ================================================================
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  headerGeneric: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerGenericTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
  },
  greeting: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.diffuse,
  },
  profileInitials: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.primary,
  },
  heroSection: {
    marginBottom: spacing.xxl,
  },
  balanceLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  balanceFCFA: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.onSurface,
    letterSpacing: letterSpacing.display,
  },
  ctaWrapper: {
    marginBottom: spacing.xl,
    borderRadius: radius.md,
    ...shadows.diffuse,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: fonts.title,
    fontSize: 20,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  ctaSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ctaArrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrow: {
    fontFamily: fonts.title,
    fontSize: 24,
    color: colors.onPrimary,
  },
  transactionsSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  instruction: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  operatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  operatorCard: {
    flex: 0.48,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.diffuse,
  },
  operatorCardActive: {
    borderColor: 'rgba(117, 91, 0, 0.3)', // Gold subtle outline
  },
  operatorEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  operatorName: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  operatorNameActive: {
    fontFamily: fonts.title,
    color: colors.primary, // Gold text
  },
  confirmCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  confirmSplitter: {
    height: 1,
    backgroundColor: 'rgba(208, 197, 178, 0.2)',
    marginVertical: spacing.sm,
  },
  confirmLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  confirmLabelBold: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
  },
  confirmValue: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurface,
  },
  confirmPhone: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.onSurface,
  },
  confirmTotal: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
  },
  infoBanner: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Gold
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.diffuse,
  },
  successIconText: {
    fontFamily: fonts.title,
    fontSize: 40,
    color: colors.onPrimary,
  },
  successTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.02,
  },
  successStatus: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  profileName: {
    fontFamily: fonts.title,
    fontSize: 18,
    color: colors.onSurface,
  },
  profilePhone: {
    fontFamily: fonts.label,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: fonts.title,
    color: colors.error,
  },
});
