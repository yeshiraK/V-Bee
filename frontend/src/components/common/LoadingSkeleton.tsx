import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { THEME } from '../../theme/colors';
import { Card } from './Card';

interface LoadingSkeletonProps {
  message?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  message = 'Fetching academic data...',
  count = 3,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerRow}>
        <ActivityIndicator size="small" color={THEME.colors.textPrimary} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>

      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} style={styles.skeletonCard}>
          <View style={styles.badgePlaceholder} />
          <View style={styles.titlePlaceholder} />
          <View style={styles.subtitlePlaceholder} />
          <View style={styles.barPlaceholder} />
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  skeletonCard: {
    marginBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    opacity: 0.6,
  },
  badgePlaceholder: {
    width: 60,
    height: 18,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  titlePlaceholder: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.xs,
  },
  subtitlePlaceholder: {
    width: '50%',
    height: 14,
    borderRadius: 4,
    backgroundColor: THEME.colors.borderLight,
    marginBottom: THEME.spacing.md,
  },
  barPlaceholder: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.borderLight,
  },
});
