import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 64;

/**
 * Hauteur totale tabBar + safe area.
 * Utiliser comme paddingBottom dans les ScrollView des écrans avec tabs.
 */
export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + (insets.bottom || 0);
};

/**
 * Bottom pour un footer fixe (position absolute, bottom:0).
 * Inclut tabBar + safe area + marge visuelle.
 */
export const useFooterBottom = (extraMargin = 16) => {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + (insets.bottom || 0) + extraMargin;
};
