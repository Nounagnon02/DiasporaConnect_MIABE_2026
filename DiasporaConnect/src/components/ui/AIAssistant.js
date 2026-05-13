/**
 * AIAssistant — Chatbot flottant "Lumière"
 * Support FR / EN / FON — fonctionne offline avec fallback
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, KeyboardAvoidingView, Platform, Animated,
  ActivityIndicator, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';
import { askAssistant } from '../../services/aiService';
import useStore from '../../store/useStore';

const QUICK_QUESTIONS = {
  fr: ['Quels sont les frais ?', 'Combien de temps ?', 'C\'est sécurisé ?', 'Taux EUR/FCFA ?'],
  en: ['What are the fees?', 'How long does it take?', 'Is it secure?', 'EUR/FCFA rate?'],
  fon: ['Akwɛ sín dó ɔ?', 'Hwenu ɖé?', 'Ɛ nyɔ́ à?', 'Taux EUR/FCFA?'],
};

export default function AIAssistant() {
  const { language } = useStore();
  const lang = ['fr', 'en', 'fon'].includes(language) ? language : 'fr';

  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      text: lang === 'en'
        ? 'Hello! I\'m Lumière ✨ How can I help you today?'
        : lang === 'fon'
        ? 'Ah kɛ́kɛ́! Mì nyí Lumière ✨ Nɛ̌ mì ka sixu d\'alɔ we?'
        : 'Bonjour ! Je suis Lumière ✨ Comment puis-je vous aider ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation pulsation du bouton flottant
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), role: 'user', text: userText };
    const history = messages.map(m => ({ role: m.role, content: m.text }));

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const reply = await askAssistant(userText, lang, history);
    setLoading(false);

    setMessages(prev => [
      ...prev,
      { id: (Date.now() + 1).toString(), role: 'assistant', text: reply },
    ]);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {!isUser && <Text style={styles.assistantName}>Lumière ✨</Text>}
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <>
      {/* Bouton flottant */}
      <Animated.View style={[styles.fab, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity onPress={() => setVisible(true)} style={styles.fabInner} activeOpacity={0.85}>
          <Text style={styles.fabEmoji}>✨</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal chatbot */}
      <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>✨</Text>
                </View>
                <View>
                  <Text style={styles.headerName}>Lumière</Text>
                  <Text style={styles.headerSub}>Assistant IA DiasporaConnect</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Indicateur de frappe */}
            {loading && (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>Lumière réfléchit...</Text>
              </View>
            )}

            {/* Questions rapides */}
            <View style={styles.quickRow}>
              {QUICK_QUESTIONS[lang].map(q => (
                <TouchableOpacity
                  key={q}
                  style={styles.quickChip}
                  onPress={() => sendMessage(q)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.quickChipText} numberOfLines={1}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder={lang === 'en' ? 'Ask Lumière...' : lang === 'fon' ? 'Byɔ Lumière...' : 'Posez votre question...'}
                placeholderTextColor={colors.onSurfaceVariant}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
                onPress={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <Ionicons name="send" size={18} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xl,
    zIndex: 999,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.diffuse,
  },
  fabEmoji: { fontSize: 24 },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(27,28,26,0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208,197,178,0.2)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(117,91,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },
  headerName: { fontFamily: fonts.title, fontSize: 15, color: colors.onSurface },
  headerSub: { fontFamily: fonts.body, fontSize: 11, color: colors.onSurfaceVariant },
  closeBtn: { padding: spacing.xs },

  messagesList: { padding: spacing.lg, gap: spacing.sm },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  bubbleAssistant: {
    backgroundColor: colors.surfaceContainerLowest,
    alignSelf: 'flex-start',
    ...shadows.glass,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  assistantName: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    marginBottom: 4,
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    lineHeight: 20,
  },
  bubbleTextUser: { color: colors.onPrimary },

  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  typingText: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant },

  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  quickChip: {
    backgroundColor: 'rgba(117,91,0,0.08)',
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  quickChipText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.primary,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    ...shadows.glass,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
