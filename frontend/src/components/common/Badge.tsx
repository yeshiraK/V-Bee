import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { THEME } from '../../theme/colors';

export type BadgeVariant =
  | 'default'
  | 'safe'
  | 'warning'
  | 'danger'
  | 'yellow'
  | 'mint'
  | 'lavender'
  | 'blue'
  | 'peach';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'safe':
        return {
          bg: THEME.colors.pastel.mint.badge,
          text: THEME.colors.pastel.mint.text,
          border: THEME.colors.pastel.mint.border,
        };
      case 'warning':
        return {
          bg: THEME.colors.pastel.yellow.badge,
          text: THEME.colors.pastel.yellow.text,
          border: THEME.colors.pastel.yellow.border,
        };
      case 'danger':
        return {
          bg: THEME.colors.pastel.rose.badge,
          text: THEME.colors.pastel.rose.text,
          border: THEME.colors.pastel.rose.border,
        };
      case 'lavender':
        return {
          bg: THEME.colors.pastel.lavender.badge,
          text: THEME.colors.pastel.lavender.text,
          border: THEME.colors.pastel.lavender.border,
        };
      case 'blue':
        return {
          bg: THEME.colors.pastel.blue.badge,
          text: THEME.colors.pastel.blue.text,
          border: THEME.colors.pastel.blue.border,
        };
      case 'peach':
        return {
          bg: THEME.colors.pastel.peach.badge,
          text: THEME.colors.pastel.peach.text,
          border: THEME.colors.pastel.peach.border,
        };
      case 'yellow':
        return {
          bg: THEME.colors.pastel.yellow.badge,
          text: THEME.colors.pastel.yellow.text,
          border: THEME.colors.pastel.yellow.border,
        };
      case 'mint':
        return {
          bg: THEME.colors.pastel.mint.badge,
          text: THEME.colors.pastel.mint.text,
          border: THEME.colors.pastel.mint.border,
        };
      case 'default':
      default:
        return {
          bg: THEME.colors.surfaceSubtle,
          text: THEME.colors.textSecondary,
          border: THEME.colors.border,
        };
    }
  };

  const colors = getBadgeColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: THEME.radius.full,
    borderWidth: 1,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
