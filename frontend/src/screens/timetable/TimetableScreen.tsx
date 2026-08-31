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
import { THEME } from '../../theme/colors';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Header } from '../../components/common/Header';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorCard } from '../../components/common/ErrorCard';
import { useSemester } from '../../context/SemesterContext';
import { getTimetable } from '../../api/academic';
import { TimetableCourse } from '../../types/api';

const DAYS = ['ALL', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
type Day = typeof DAYS[number];

// Standard VIT slot to day mapping helper
const DAY_SLOT_MAP: Record<string, string[]> = {
  MON: ['A1', 'F1', 'D1', 'TB1', 'TG1', 'A2', 'F2', 'D2', 'TB2', 'TG2', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36'],
  TUE: ['B1', 'G1', 'E1', 'TC1', 'TAA1', 'B2', 'G2', 'E2', 'TC2', 'TAA2', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L37', 'L38', 'L39', 'L40', 'L41', 'L42'],
  WED: ['C1', 'A1', 'F1', 'TD1', 'TBB1', 'C2', 'A2', 'F2', 'TD2', 'TBB2', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L43', 'L44', 'L45', 'L46', 'L47', 'L48'],
  THU: ['D1', 'B1', 'G1', 'TE1', 'TCC1', 'D2', 'B2', 'G2', 'TE2', 'TCC2', 'L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L49', 'L50', 'L51', 'L52', 'L53', 'L54'],
  FRI: ['E1', 'C1', 'TA1', 'TF1', 'TDD1', 'E2', 'C2', 'TA2', 'TF2', 'TDD2', 'L25', 'L26', 'L27', 'L28', 'L29', 'L30', 'L55', 'L56', 'L57', 'L58', 'L59', 'L60'],
  SAT: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
};

export const TimetableScreen: React.FC = () => {
  const { selectedSemester } = useSemester();
  const [courses, setCourses] = useState<TimetableCourse[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day>('ALL');

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetableData = useCallback(async () => {
    setError(null);
    try {
      const data = await getTimetable(selectedSemester?.id);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timetable data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    setIsLoading(true);
    fetchTimetableData();
  }, [fetchTimetableData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchTimetableData();
  };

  // Filter courses by day based on slot matching
  const filteredCourses = courses.filter((course) => {
    if (selectedDay === 'ALL') return true;
    const targetSlots = DAY_SLOT_MAP[selectedDay] || [];
    const courseSlots = course.slot.split('+').map((s) => s.trim().toUpperCase());
    return courseSlots.some((slot) =>
      targetSlots.some((ts) => slot.includes(ts) || ts.includes(slot))
    );
  });

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
        <Header title="Timetable" subtitle="Class Schedule & Venues" />

        {/* Day Selector Pills */}
        <View style={styles.daySelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayScroll}
          >
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.75}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayPill,
                    isSelected && styles.dayPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {isLoading && !isRefreshing ? (
          <LoadingSkeleton message="Loading timetable schedule..." count={4} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchTimetableData} />
        ) : filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Card variant="surface" style={styles.emptyCard}>
              <Feather name="calendar" size={36} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {selectedDay === 'ALL' ? 'No Timetable Records' : `No Classes for ${selectedDay}`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedDay === 'ALL'
                  ? 'No course registrations found for the selected semester.'
                  : `You have no scheduled classes mapped to ${selectedDay}.`}
              </Text>
            </Card>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredCourses.map((course, idx) => {
              // Alternate pastel accents for cards
              const variants: Array<'surface' | 'mint' | 'lavender' | 'blue' | 'yellow'> = [
                'surface',
                'mint',
                'lavender',
                'blue',
                'yellow',
              ];
              const cardVariant = variants[idx % variants.length];

              return (
                <Card
                  key={`${course.course_code}-${course.slot}-${idx}`}
                  variant={cardVariant}
                  style={styles.courseCard}
                >
                  {/* Top Metadata Row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeRow}>
                      <Badge
                        label={course.course_code}
                        variant={cardVariant === 'surface' ? 'lavender' : 'default'}
                        size="sm"
                      />
                      {course.course_type ? (
                        <Badge label={course.course_type} variant="default" size="sm" />
                      ) : null}
                    </View>
                    {course.slot ? (
                      <View style={styles.slotBadge}>
                        <Text style={styles.slotBadgeText}>{course.slot}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Course Title */}
                  <Text style={styles.courseTitle}>{course.course_title}</Text>

                  {/* Venue & Faculty Info */}
                  <View style={styles.detailsGrid}>
                    {course.venue ? (
                      <View style={styles.detailItem}>
                        <Feather name="map-pin" size={14} color={THEME.colors.textMuted} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {course.venue}
                        </Text>
                      </View>
                    ) : null}

                    {course.faculty ? (
                      <View style={styles.detailItem}>
                        <Feather name="user" size={14} color={THEME.colors.textMuted} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {course.faculty}
                        </Text>
                      </View>
                    ) : null}
                  </View>
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
  daySelectorContainer: {
    marginBottom: THEME.spacing.md,
  },
  dayScroll: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.xs,
  },
  dayPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
  },
  dayPillSelected: {
    backgroundColor: THEME.colors.textPrimary,
    borderColor: THEME.colors.textPrimary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  dayTextSelected: {
    color: THEME.colors.textInverse,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  courseCard: {
    padding: THEME.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  slotBadge: {
    backgroundColor: THEME.colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  slotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textInverse,
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: 6,
  },
  detailsGrid: {
    gap: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
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
