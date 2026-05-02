import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, radius } from '../../theme/theme';
import GoldButton from '../../components/ui/GoldButton';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Une technologie qui vous rapproche.',
    description: 'DiasporaConnect lie la diaspora béninoise à ses familles grâce à la blockchain Celo.',
    // Here we'd map to ConnectionAnim
  },
  {
    id: '2',
    title: 'Moins de frais.\nPlus pour eux.',
    description: 'Les frais d\'envoi internationaux sont de 7 à 15%. Avec le smart contract The Private Ledger, ils passent sous 1%.',
    // Here we'd feature the animated counter
  },
  {
    id: '3',
    title: 'Entrez dans le\nPrivate Ledger.',
    description: 'Une plateforme humaine, sécurisée de bout en bout, et enracinée dans notre culture.',
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('RoleSelect');
    }
  };

  const skip = () => navigation.navigate('RoleSelect');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.brand}>DiasporaConnect</Text>
        <TouchableOpacity onPress={skip}><Text style={styles.skip}>Passer</Text></TouchableOpacity>
      </View>

      <View style={{ flex: 3 }}>
        <Animated.FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.illustrationPlaceholder} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View style={[styles.dot, { opacity }]} key={i.toString()} />;
          })}
        </View>

        <View style={styles.actions}>
          {currentIndex === SLIDES.length - 1 ? (
            <GoldButton 
              title="Commencer" 
              onPress={() => navigation.navigate('RoleSelect')} 
              style={{ width: '100%' }} 
            />
          ) : (
            <GoldButton 
              title="Suivant" 
              onPress={scrollToNext} 
              style={{ width: '100%' }} 
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.primary,
  },
  skip: {
    fontFamily: fonts.title,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustrationPlaceholder: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    marginBottom: spacing.xxl,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.onSurface,
    lineHeight: 44,
    letterSpacing: -0.02,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  actions: {
    width: '100%',
  },
});
