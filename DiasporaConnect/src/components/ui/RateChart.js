/**
 * RateChart — Graphique taux EUR/FCFA sur 7j / 30j
 * Courbe SVG légère, sans dépendance externe
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors, fonts, spacing, radius, shadows } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH  = SCREEN_WIDTH - spacing.xl * 2 - spacing.lg * 2;
const CHART_HEIGHT = 100;
const PAD = { top: 12, bottom: 24, left: 8, right: 8 };

// Données mock — en prod : remplacer par l'historique réel de ratesService
const MOCK_7D = [
  { day: 'L',  EUR_USD: 1.075 },
  { day: 'M',  EUR_USD: 1.078 },
  { day: 'Me', EUR_USD: 1.072 },
  { day: 'J',  EUR_USD: 1.081 },
  { day: 'V',  EUR_USD: 1.085 },
  { day: 'S',  EUR_USD: 1.079 },
  { day: 'D',  EUR_USD: 1.083 },
];

const MOCK_30D = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  EUR_USD: 1.065 + Math.sin(i * 0.4) * 0.012 + Math.random() * 0.005,
}));

function buildPath(data, chartW, chartH) {
  const values = data.map(d => d.EUR_USD);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 0.001;

  const innerW = chartW - PAD.left - PAD.right;
  const innerH = chartH - PAD.top - PAD.bottom;

  const points = values.map((v, i) => ({
    x: PAD.left + (i / (values.length - 1)) * innerW,
    y: PAD.top + (1 - (v - min) / range) * innerH,
  }));

  // Courbe lissée (cubic bezier)
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = cp1x;
    const cp2y = points[i].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  return { path: d, points, min, max };
}

export default function RateChart({ style }) {
  const [period, setPeriod] = useState('7d');
  const data = period === '7d' ? MOCK_7D : MOCK_30D;
  const { path, points, min, max } = buildPath(data, CHART_WIDTH, CHART_HEIGHT);

  const lastPoint = points[points.length - 1];
  const firstVal  = data[0].EUR_USD;
  const lastVal   = data[data.length - 1].EUR_USD;
  const change    = ((lastVal - firstVal) / firstVal) * 100;
  const isUp      = change >= 0;

  // Labels axe Y
  const yLabels = [max, (max + min) / 2, min];

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>EUR / USD</Text>
          <View style={styles.changeRow}>
            <Text style={styles.currentRate}>{lastVal.toFixed(4)}</Text>
            <View style={[styles.changeBadge, isUp ? styles.changeBadgeUp : styles.changeBadgeDown]}>
              <Text style={[styles.changeText, isUp ? styles.changeUp : styles.changeDown]}>
                {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.periodToggle}>
          {['7d', '30d'].map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Graphique SVG */}
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.svg}>
        {/* Lignes de grille horizontales */}
        {yLabels.map((_, i) => {
          const y = PAD.top + (i / (yLabels.length - 1)) * (CHART_HEIGHT - PAD.top - PAD.bottom);
          return (
            <Line
              key={i}
              x1={PAD.left} y1={y}
              x2={CHART_WIDTH - PAD.right} y2={y}
              stroke="rgba(208,197,178,0.2)"
              strokeWidth={1}
            />
          );
        })}

        {/* Courbe */}
        <Path
          d={path}
          fill="none"
          stroke={isUp ? colors.primary : colors.error}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Point final */}
        <Circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={4}
          fill={isUp ? colors.primary : colors.error}
        />

        {/* Labels axe X (7d seulement) */}
        {period === '7d' && data.map((d, i) => {
          const x = PAD.left + (i / (data.length - 1)) * (CHART_WIDTH - PAD.left - PAD.right);
          return (
            <SvgText
              key={i}
              x={x}
              y={CHART_HEIGHT - 4}
              fontSize={9}
              fill={colors.onSurfaceVariant}
              textAnchor="middle"
              fontFamily={fonts.label}
            >
              {d.day}
            </SvgText>
          );
        })}
      </Svg>

      {/* Légende min/max */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Min : {min.toFixed(4)}</Text>
        <Text style={styles.legendText}>Max : {max.toFixed(4)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadows.diffuse,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.body, fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 4 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  currentRate: { fontFamily: fonts.label, fontSize: 20, color: colors.onSurface, letterSpacing: -0.4 },
  changeBadge: { borderRadius: radius.round, paddingHorizontal: 6, paddingVertical: 2 },
  changeBadgeUp:   { backgroundColor: 'rgba(117,91,0,0.1)' },
  changeBadgeDown: { backgroundColor: 'rgba(186,26,26,0.08)' },
  changeText: { fontFamily: fonts.label, fontSize: 11 },
  changeUp:   { color: colors.primary },
  changeDown: { color: colors.error },
  periodToggle: {
    flexDirection: 'row', backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.sm, padding: 3,
  },
  periodBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm - 1 },
  periodBtnActive: { backgroundColor: colors.surfaceContainerLowest, ...shadows.glass },
  periodText: { fontFamily: fonts.label, fontSize: 12, color: colors.onSurfaceVariant },
  periodTextActive: { color: colors.primary },
  svg: { marginBottom: spacing.sm },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
  legendText: { fontFamily: fonts.label, fontSize: 10, color: colors.onSurfaceVariant },
});
