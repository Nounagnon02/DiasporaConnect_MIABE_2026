// ============================================================
// DIASPORA CONNECT — Send Flow: Steps 1-4 (The Private Ledger)
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Animated, ActivityIndicator, Alert, Clipboard, Vibration,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, radius, shadows, letterSpacing } from '../../theme/theme';
import StepIndicator from '../../components/ui/StepIndicator';
import LedgerInput from '../../components/ui/LedgerInput';
import GoldButton from '../../components/ui/GoldButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import FeeComparator from '../../components/ui/FeeComparator';
import { useWeb3Modal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import { calculateTransfer, executeTransfer } from '../../services/blockchainService';
import { MOCK_CONTACTS } from '../../services/mockData';
import useStore from '../../store/useStore';

const STEP_LABELS = ['Montant', 'Destinataire', 'Confirmation', 'Succès'];

// ================================================================
// STEP 1 — Amount (This is mostly redundant with Calculator now, but let's keep it as Step 1 of flow)
// ================================================================
export const SendStep1Screen = ({ navigation }) => {
  const { transferData } = useStore();

  // If user went through Calculator, they already did Step 1.
  // We can just automatically forward them to Step 2, or show a recap.
  // For the sake of the UX, let's auto-forward them if amount is set.
  useEffect(() => {
    if (transferData.amountUSD > 0) {
      navigation.replace('SendStep2');
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
    </SafeAreaView>
  );
};

// ================================================================
// STEP 2 — Recipient
// ================================================================
export const SendStep2Screen = ({ navigation }) => {
  const { transferData, updateTransferData } = useStore();
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = useState(null);

  const handleContact = (contact) => {
    setSelected(contact);
    setPhone(contact.phone);
    updateTransferData({ recipient: contact, operator: contact.operator });
  };

  const handleNext = () => {
    const recipient = selected || { phone, operator: 'MTN', name: 'Inconnu' };
    if (!phone && !selected) return Alert.alert('Erreur', 'Veuillez renseigner le numéro');
    updateTransferData({ recipient, operator: recipient.operator });
    navigation.navigate('SendStep3');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Destinataire</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={2} labels={STEP_LABELS} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <LedgerInput
            label="Numéro Mobile Money (+229)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="97 00 00 00"
          />
          <SecondaryButton title="Scanner QR Code" onPress={() => {}} style={{ marginTop: spacing.md }} />
        </View>

        <Text style={styles.sectionLabel}>Destinataires récents</Text>
        
        {MOCK_CONTACTS.slice(0, 3).map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.contactCard, selected?.id === c.id && styles.contactCardActive]}
            onPress={() => handleContact(c)}
            activeOpacity={0.88}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.contactInitials}>{c.initials}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactPhone}>{c.phone} · {c.operator}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton title="Continuer" onPress={handleNext} disabled={!phone} />
      </View>
    </SafeAreaView>
  );
};

// ================================================================
// STEP 3 — Confirmation
// ================================================================
export const SendStep3Screen = ({ navigation }) => {
  const { transferData, senderUser, addTransaction, updateTransferData } = useStore();
  const { provider } = useWeb3Modal();
  const [loading, setLoading] = useState(false);

  const formatFCFA = (num) => new Intl.NumberFormat('fr-FR').format(Math.round(num || 0));

  const handleConfirm = async () => {
    if (!provider) return Alert.alert('Erreur', 'Veuillez reconnecter votre portefeuille.');
    
    setLoading(true);
    try {
      const browserProvider = new ethers.BrowserProvider(provider);
      const signer = await browserProvider.getSigner();

      const result = await executeTransfer(
        transferData.amountUSD,
        transferData.recipient?.phone || transferData.recipient,
        transferData.operator,
        signer,
        () => {}
      );

      if (result.success) {
        updateTransferData({ txHash: result.txHash, status: 'completed' });
        addTransaction({
          id: `tx_${Date.now()}`,
          txHashFull: result.txHash,
          type: 'send',
          amountUSD: transferData.amountUSD,
          amountFCFA: transferData.amountFCFA,
          recipient: transferData.recipient?.name || 'Inconnu',
          date: new Date().toISOString(),
          status: 'completed',
        });
        navigation.navigate('SendStep4');
      } else {
        Alert.alert('Échec', 'Le transfert a échoué.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator totalSteps={4} currentStep={3} labels={STEP_LABELS} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.recapCard}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Montant envoyé</Text>
            <Text style={styles.recapValueSpace}>{transferData.amountUSD} USD</Text>
          </View>
          
          <View style={styles.recapSplitter} />
          
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Frais de réseau Celo (estimés)</Text>
            <Text style={styles.recapValueSpace}>0.002 CELO</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Frais DiasporaConnect</Text>
            <Text style={styles.recapValueGold}>${transferData.fee?.toFixed(2)}</Text>
          </View>

          <View style={styles.recapSplitter} />

          <View style={styles.recapRow}>
            <Text style={styles.recapLabelBold}>Le bénéficiaire recevra</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.recapValueNewsreader}>{formatFCFA(transferData.recipientGetsFCFA)} FCFA</Text>
              <Text style={styles.recapValueSpace}>= ${transferData.recipientGets?.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.recipientCard}>
          <Text style={styles.recipientLabel}>Destinataire</Text>
          <Text style={styles.recipientName}>{transferData.recipient?.name || 'Inconnu'}</Text>
          <Text style={styles.recipientPhone}>{transferData.recipient?.phone} · {transferData.operator}</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <GoldButton 
          title={loading ? "Signature Web3..." : "Confirmer et Envoyer"} 
          onPress={handleConfirm} 
          disabled={loading} 
        />
      </View>
    </SafeAreaView>
  );
};

// ================================================================
// STEP 4 — Success
// ================================================================
export const SendStep4Screen = ({ navigation }) => {
  const { transferData, resetTransferData } = useStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Vibration.vibrate(200);
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
  }, []);

  const shortHash = (h) => h ? h.slice(0, 10) + '...' + h.slice(-6) : '';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surfaceContainerLowest }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.successScroll}>
        
        <Animated.View style={[styles.successIconWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successIconText}>✓</Text>
        </Animated.View>

        <Text style={styles.successTitle}>Transfert envoyé !</Text>
        
        <View style={styles.successBox}>
          <Text style={styles.successLabel}>Hachage Transaction (Celo)</Text>
          <Text style={styles.successHash}>{shortHash(transferData.txHash)}</Text>
          <Text style={styles.successStatus}>En attente de confirmation réseau (~60s)</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <GoldButton 
          title="Nouveau transfert" 
          onPress={() => {
            resetTransferData();
            navigation.navigate('Calculator');
          }} 
          style={{ marginBottom: spacing.md }}
        />
        <SecondaryButton 
          title="Voir le suivi"
          onPress={() => {
            resetTransferData();
            navigation.navigate('History');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

// ================================================================
// SHARED STYLES
// ================================================================
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  headerTitle: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
    ...shadows.diffuse,
  },
  sectionLabel: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contactCardActive: {
    borderColor: 'rgba(117, 91, 0, 0.3)',
    backgroundColor: colors.surfaceContainerLowest,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(117, 91, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactInitials: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurface,
  },
  contactPhone: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(208, 197, 178, 0.2)',
  },
  // Step 3
  recapCard: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    ...shadows.diffuse,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  recapSplitter: {
    height: 1,
    backgroundColor: 'rgba(208, 197, 178, 0.2)',
    marginVertical: spacing.sm,
  },
  recapLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  recapLabelBold: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
  },
  recapValueSpace: {
    fontFamily: fonts.label,
    fontSize: 14,
    color: colors.onSurface,
  },
  recapValueGold: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.primary,
  },
  recapValueNewsreader: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.onSurface,
    letterSpacing: -0.02,
  },
  recipientCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  recipientLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  recipientName: {
    fontFamily: fonts.title,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 2,
  },
  recipientPhone: {
    fontFamily: fonts.label,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  // Step 4
  successScroll: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Gold checkmark, NO GREEN
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
    fontSize: 32,
    color: colors.onSurface,
    letterSpacing: -0.02,
    marginBottom: spacing.xxl,
  },
  successBox: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(208, 197, 178, 0.2)',
  },
  successLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  successHash: {
    fontFamily: fonts.label,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  successStatus: {
    fontFamily: fonts.title,
    fontSize: 12,
    color: colors.primary,
  },
});
