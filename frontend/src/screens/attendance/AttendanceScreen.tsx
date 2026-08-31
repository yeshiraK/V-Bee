import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme/colors';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Header } from '../../components/common/Header';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorCard } from '../../components/common/ErrorCard';
import { useSemester } from '../../context/SemesterContext';
import { getAttendance } from '../../api/academic';
import { AttendanceRecord } from '../../types/api';

export const AttendanceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { selectedSemester } = useSemester();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceData = useCallback(async () => {
    setError(null);
    try {
      const data = await getAttendance(selectedSemester?.id);
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    setIsLoading(true);
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAttendanceData();
  };

  const openCalculatorWithValues = (record: AttendanceRecord) => {
    navigation.navigate('Calculator', {
      initialAttended: record.attended,
      initialTotal: record.total,
      courseTitle: record.course_title,
    });
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
          title="Attendance"
          subtitle="Course-wise records"
          rightAction={
            <TouchableOpacity
              onPress={() => navigation.navigate('Calculator')}
              style={styles.calcActionBtn}
              activeOpacity={0.7}
            >
              <Feather name="percent" size={16} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          }
        />

        {isLoading && !isRefreshing ? (
          <LoadingSkeleton message="Fetching course attendance..." count={4} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchAttendanceData} />
        ) : records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Card variant="surface" style={styles.emptyCard}>
              <Feather name="inbox" size={36} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>No Attendance Records</Text>
              <Text style={styles.emptySubtitle}>
                No attendance entries were found for the selected semester.
              </Text>
            </Card>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {records.map((item, index) => {
              const isSafe = item.percentage >= 75;
              const cardVariant = isSafe ? 'surface' : 'peach';

              return (
                <Card
                  key={`${item.course_code}-${index}`}
                  variant={cardVariant}
                  style={styles.courseCard}
                >
                  {/* Top Badge Row */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.badgeGroup}>
                      <Badge
                        label={item.course_code}
                        variant={isSafe ? 'mint' : 'peach'}
                        size="sm"
                      />
                      {item.course_type ? (
                        <Badge label={item.course_type} variant="default" size="sm" />
                      ) : null}
                      {item.slot ? (
                        <Badge label={`Slot: ${item.slot}`} variant="default" size="sm" />
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={styles.calcSmallBtn}
                      onPress={() => openCalculatorWithValues(item)}
                      activeOpacity={0.7}
                    >
                      <Feather name="sliders" size={14} color={THEME.colors.textSecondary} />
                      <Text style={styles.calcSmallText}>Calc</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Course Title */}
                  <Text style={styles.courseTitle}>{item.course_title}</Text>

                  {/* Faculty Name */}
                  {item.faculty ? (
                    <View style={styles.facultyRow}>
                      <Feather name="user" size={13} color={THEME.colors.textMuted} />
                      <Text style={styles.facultyText} numberOfLines={1}>
                        {item.faculty}
                      </Text>
                    </View>
                  ) : null}

                  {/* Attendance Stat Row */}
                  <View style={styles.statRow}>
                    <View>
                      <Text style={styles.percentageText}>{item.percentage}%</Text>
                      <Text style={styles.fractionText}>
                        {item.attended} / {item.total} Attended
                      </Text>
                    </View>

                    {/* Status Pill Badge */}
                    <View style={styles.statusPillContainer}>
                      {item.target_classes < 0 ? (
                        <Badge
                          label={`Can miss ${Math.abs(item.target_classes)}`}
                          variant="safe"
                        />
                      ) : item.target_classes > 0 ? (
                        <Badge
                          label={`Need ${item.target_classes} classes`}
                          variant="danger"
                        />
                      ) : (
                        <Badge label="Exactly 75%" variant="warning" />
                      )}
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <ProgressBar
                    percentage={item.percentage}
                    style={styles.progressBar}
                  />
                </Card>
              );
            })}
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
  calcActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.pastel.yellow.bg,
    borderColor: THEME.colors.pastel.yellow.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  courseCard: {
    padding: THEME.spacing.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  calcSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  calcSmallText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 4,
    marginBottom: 4,
  },
  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: THEME.spacing.sm,
  },
  facultyText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: THEME.spacing.xs,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  fractionText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  statusPillContainer: {
    marginBottom: 4,
  },
  progressBar: {
    marginTop: THEME.spacing.xs,
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
