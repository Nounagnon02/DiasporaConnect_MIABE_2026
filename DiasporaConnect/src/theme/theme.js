// ============================================================
// DIASPORA CONNECT — Theme "The Private Ledger"
// ============================================================

export const colors = {
  // Surfaces (la "papeterie")
  surface: '#FAF9F5',               // Fond global — "le papier"
  surfaceContainerLow: '#F2EFE8',   // Zones de fond non-interactives
  surfaceContainerLowest: '#FFFFFF', // Cards principales, points d'interaction
  surfaceBright: 'rgba(255, 255, 255, 0.85)', // Panneaux flottants (glassmorphism)

  // Couleurs primaires — "L'or"
  primary: '#755B00',               // Or foncé — texte sur fond gold, accents
  primaryContainer: '#C9A84C',      // Or clair — gradient CTA, highlights
  onPrimary: '#FFFFFF',             // Texte sur bouton gold

  // Texte & contenu
  onSurface: '#1B1C1A',             // Texte principal (JAMAIS #000000)
  onSurfaceVariant: '#4A4A48',      // Texte secondaire, labels
  outlineVariant: '#D0C5B2',        // Ghost border (utilisé à 15% opacité)

  // États
  error: '#BA1A1A',                 // Erreurs critiques UNIQUEMENT
  success: '#755B00',               // Succès = couleur primary gold (pas de vert !)
  
  // Specific Provider Colors (used rarely, but needed)
  mtnYellow: '#FFCC00',
  moovBlue: '#005BBB',
};

// Dégradé gold pour les CTA principaux
export const goldGradient = {
  colors: ['#755B00', '#C9A84C'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
};

export const fonts = {
  display: 'Newsreader_700Bold',       // Balances hero, titres de section
  headline: 'Newsreader_400Regular',   // Intros de section
  title: 'PublicSans_600SemiBold',     // En-têtes de cards
  body: 'PublicSans_400Regular',       // Contenu général
  label: 'SpaceGrotesk_500Medium',     // TOUTES les données chiffrées : montants, TX hash, dates, pourcentages
};

export const letterSpacing = {
  display: -0.02, // Tight pour les montants hero — sentiment d'autorité
  amounts: -0.64, // Tight pour montants spécifiques
};

export const shadows = {
  diffuse: {
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 3,
  },
  glass: {
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  }
};

export const radius = {
  sm: 4,
  md: 8,  // Maximum allowed basically anywhere
  lg: 12,
  round: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24, // Minimum padding inside cards!
  xl: 32,
  xxl: 48,
};

// Aliases for compatibility
export const COLORS = colors;
export const TYPOGRAPHY = fonts;
export const SPACING = spacing;
export const RADIUS = radius;
export const SHADOWS = { sm: shadows.diffuse, md: shadows.diffuse, lg: shadows.diffuse };
