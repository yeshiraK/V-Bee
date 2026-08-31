import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { THEME } from '../../theme/colors';

export type CardVariant = 'surface' | 'yellow' | 'mint' | 'lavender' | 'blue' | 'peach' | 'rose';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  style,
  onPress,
  noPadding = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'yellow':
        return {
          backgroundColor: THEME.colors.pastel.yellow.bg,
          borderColor: THEME.colors.pastel.yellow.border,
        };
      case 'mint':
        return {
          backgroundColor: THEME.colors.pastel.mint.bg,
          borderColor: THEME.colors.pastel.mint.border,
        };
      case 'lavender':
        return {
          backgroundColor: THEME.colors.pastel.lavender.bg,
          borderColor: THEME.colors.pastel.lavender.border,
        };
      case 'blue':
        return {
          backgroundColor: THEME.colors.pastel.blue.bg,
          borderColor: THEME.colors.pastel.blue.border,
        };
      case 'peach':
        return {
          backgroundColor: THEME.colors.pastel.peach.bg,
          borderColor: THEME.colors.pastel.peach.border,
        };
      case 'rose':
        return {
          backgroundColor: THEME.colors.pastel.rose.bg,
          borderColor: THEME.colors.pastel.rose.border,
        };
      case 'surface':
      default:
        return {
          backgroundColor: THEME.colors.surface,
          borderColor: THEME.colors.border,
        };
    }
  };

  const cardStyle = [
    styles.card,
    getVariantStyles(),
    noPadding && { padding: 0 },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    padding: THEME.spacing.lg,
    ...THEME.shadows.subtle,
  },
});
