import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../theme/colors';
import { Card } from './Card';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = 'Unable to Load Data',
  message,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Card variant="peach" style={styles.card}>
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={24} color={THEME.colors.pastel.peach.text} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry && (
          <TouchableOpacity activeOpacity={0.8} onPress={onRetry} style={styles.retryBtn}>
            <Feather name="refresh-cw" size={14} color={THEME.colors.surface} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
  },
  card: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.pastel.peach.badge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.pastel.peach.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.full,
    ...THEME.shadows.subtle,
  },
  retryText: {
    color: THEME.colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
});
