/**
 * Pastel Editorial Design System Tokens
 * Warm cream background, soft pastel cards, dark charcoal typography, generous whitespace.
 */

export const THEME = {
  colors: {
    // Canvas & Surfaces
    background: '#FAF7F2',
    backgroundSecondary: '#F3EFEA',
    surface: '#FFFFFF',
    surfaceSubtle: '#F7F5F0',

    // Text & Typography
    textPrimary: '#181716',
    textSecondary: '#6B6864',
    textMuted: '#9E9B95',
    textInverse: '#FFFFFF',

    // Pastel Card Palettes (Background, Border, Text, Badge Background)
    pastel: {
      yellow: {
        bg: '#FFF8DB',
        border: '#F2E4A6',
        text: '#574200',
        badge: '#FFEBA0',
        accent: '#D99800',
      },
      mint: {
        bg: '#E5F7EC',
        border: '#BCEDCE',
        text: '#0C4B25',
        badge: '#C5F0D7',
        accent: '#10B981',
      },
      lavender: {
        bg: '#F0EAFD',
        border: '#D9C8FB',
        text: '#371A6E',
        badge: '#DFCEFC',
        accent: '#8B5CF6',
      },
      blue: {
        bg: '#E8F2FC',
        border: '#C5DCF7',
        text: '#113A61',
        badge: '#CEE3FA',
        accent: '#3B82F6',
      },
      peach: {
        bg: '#FDEEE9',
        border: '#FAC8BC',
        text: '#6B1E12',
        badge: '#F7D0C5',
        accent: '#F97316',
      },
      rose: {
        bg: '#FEEBED',
        border: '#FBC2C9',
        text: '#70101C',
        badge: '#F7CBD0',
        accent: '#F43F5E',
      },
    },

    // Status Colors
    status: {
      safe: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB',
    },

    // UI Borders & Separators
    border: '#EBE7DF',
    borderLight: '#F2EFE9',
    divider: '#E4DFD6',
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 28,
    full: 9999,
  },

  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  typography: {
    fontFamily: undefined, // Uses system font with proper weights
  },

  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    card: {
      shadowColor: '#1A1918',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
  },
};
