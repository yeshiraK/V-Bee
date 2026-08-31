import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { THEME } from '../../theme/colors';

interface ProgressBarProps {
  percentage: number;
  showMarker?: boolean;
  threshold?: number;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showMarker = true,
  threshold = 75,
  height = 8,
  style,
}) => {
  const clampedPercent = Math.min(Math.max(percentage, 0), 100);
  const isSafe = clampedPercent >= threshold;

  const fillColor = isSafe
    ? THEME.colors.pastel.mint.accent
    : clampedPercent >= 65
    ? THEME.colors.pastel.yellow.accent
    : THEME.colors.pastel.rose.accent;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedPercent}%`,
              backgroundColor: fillColor,
              borderRadius: height / 2,
            },
          ]}
        />
        {showMarker && (
          <View
            style={[
              styles.marker,
              {
                left: `${threshold}%`,
                height: height + 4,
                top: -2,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: THEME.spacing.xs,
  },
  track: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 2,
    backgroundColor: THEME.colors.textPrimary,
    opacity: 0.35,
    borderRadius: 1,
  },
});
