import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../theme/colors';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Header } from '../../components/common/Header';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorCard } from '../../components/common/ErrorCard';
import { getGrades } from '../../api/academic';
import { GradeHistory } from '../../types/api';

export const GradesScreen: React.FC = () => {
  const [gradeHistory, setGradeHistory] = useState<GradeHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGradesData = useCallback(async () => {
    setError(null);
    try {
      const data = await getGrades();
      setGradeHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch grade history');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchGradesData();
  }, [fetchGradesData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchGradesData();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.textPrimary}
          />
        }
      >
        <Header
          title="Grade History"
          subtitle="Cumulative Academic Record"
          showSemesterPicker={false}
        />

        {isLoading && !isRefreshing ? (
          <LoadingSkeleton message="Fetching cumulative grade records..." count={2} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchGradesData} />
        ) : !gradeHistory ? (
          <View style={styles.emptyContainer}>
            <Card variant="surface" style={styles.emptyCard}>
              <Feather name="award" size={36} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>No Grade Records</Text>
              <Text style={styles.emptySubtitle}>
                Grade history is currently unavailable from VTOP.
              </Text>
            </Card>
          </View>
        ) : (
          <View style={styles.content}>
            {/* CGPA Hero Card */}
            <Card variant="blue" style={styles.heroCard}>
              <View style={styles.heroTop}>
                <Badge label="CUMULATIVE PERFORMANCE" variant="blue" size="sm" />
                <View style={styles.starCircle}>
                  <Feather name="award" size={18} color={THEME.colors.pastel.blue.text} />
                </View>
              </View>

              <View style={styles.cgpaRow}>
                <Text style={styles.cgpaValue}>{gradeHistory.cgpa || '—'}</Text>
                <Text style={styles.cgpaLabel}>CGPA</Text>
              </View>

              <View style={styles.creditsRow}>
                <View style={styles.creditStat}>
                  <Text style={styles.creditLabel}>CREDITS EARNED</Text>
                  <Text style={styles.creditValue}>
                    {gradeHistory.credits_earned || '0'}
                  </Text>
                </View>
                <View style={styles.creditDivider} />
                <View style={styles.creditStat}>
                  <Text style={styles.creditLabel}>CREDITS REGISTERED</Text>
                  <Text style={styles.creditValue}>
                    {gradeHistory.credits_registered || '0'}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: THEME.spacing.xxl + 40,
  },
  content: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.lg,
  },
  heroCard: {
    padding: THEME.spacing.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.pastel.blue.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cgpaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: THEME.spacing.md,
  },
  cgpaValue: {
    fontSize: 52,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1.5,
  },
  cgpaLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.pastel.blue.text,
  },
  creditsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: THEME.spacing.md,
    marginTop: THEME.spacing.xs,
  },
  creditStat: {
    flex: 1,
  },
  creditLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.pastel.blue.text,
    letterSpacing: 0.6,
  },
  creditValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  creditDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: THEME.spacing.md,
  },
  emptyContainer: {
    padding: THEME.spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
    padding: THEME.spacing.xxl,
    gap: THEME.spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
});
