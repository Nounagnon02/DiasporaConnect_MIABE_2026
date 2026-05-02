import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme/theme';

export default function StepIndicator({ currentStep, totalSteps = 4, labels = [] }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.trackContainer}>
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isPast = step < currentStep;

          return (
            <React.Fragment key={step}>
              <View style={[
                  styles.dot,
                  (isActive || isPast) ? styles.dotActive : styles.dotInactive
                ]} 
              />
              {index < totalSteps - 1 && (
                <View style={[
                    styles.line,
                    isPast ? styles.lineActive : styles.lineInactive
                  ]} 
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      {labels.length > 0 && (
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text 
              key={index} 
              style={[
                styles.label, 
                index + 1 === currentStep ? styles.labelActive : null
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.round,
  },
  dotActive: {
    backgroundColor: colors.primary, // Gold
  },
  dotInactive: {
    backgroundColor: colors.outlineVariant,
    opacity: 0.3,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  lineInactive: {
    backgroundColor: colors.outlineVariant,
    opacity: 0.15,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    flex: 1,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
  },
});
