import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, fonts, spacing } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default function StepIndicator({ currentStep, totalSteps = 4, labels = [] }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.trackContainer}>
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isPast = step < currentStep;
          return (
            <React.Fragment key={step}>
              <View style={[
                styles.dot,
                isPast ? styles.dotPast : isActive ? styles.dotActive : styles.dotInactive,
              ]}>
                {isPast && <Text style={styles.dotCheck}>✓</Text>}
                {isActive && <View style={styles.dotInnerActive} />}
              </View>
              {index < totalSteps - 1 && (
                <View style={[styles.line, isPast ? styles.lineActive : styles.lineInactive]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Labels */}
      {labels.length > 0 && (
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.label,
                index + 1 === currentStep && styles.labelActive,
                index + 1 < currentStep && styles.labelPast,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// Largeur disponible par label = (width - 2*xl_padding) / totalSteps
const labelW = Math.floor((width - 64) / 4);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  dotInnerActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  dotPast: {
    backgroundColor: colors.primary,
  },
  dotCheck: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: fonts.title,
  },
  dotInactive: {
    backgroundColor: 'rgba(208, 197, 178, 0.3)',
    borderWidth: 1.5,
    borderColor: 'rgba(208, 197, 178, 0.5)',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    maxWidth: 48,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  lineInactive: {
    backgroundColor: 'rgba(208, 197, 178, 0.25)',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    width: labelW,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontFamily: fonts.title,
  },
  labelPast: {
    color: colors.primary,
    opacity: 0.6,
  },
});
