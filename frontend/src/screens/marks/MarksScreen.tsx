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
import { getMarks } from '../../api/academic';
import { CourseMarks } from '../../types/api';

export const MarksScreen: React.FC = () => {
  const { selectedSemester } = useSemester();
  const [coursesMarks, setCoursesMarks] = useState<CourseMarks[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarksData = useCallback(async () => {
    setError(null);
    try {
      const data = await getMarks(selectedSemester?.id);
      setCoursesMarks(data);
      // Auto-expand all courses by default for instant readability
      const expanded: Record<string, boolean> = {};
      data.forEach((c) => {
        expanded[c.course_code] = true;
      });
      setExpandedCourses(expanded);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch marks data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    setIsLoading(true);
    fetchMarksData();
  }, [fetchMarksData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMarksData();
  };

  const toggleExpand = (courseCode: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseCode]: !prev[courseCode],
    }));
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
        <Header title="Marks & Grades" subtitle="Continuous Assessment Scores" />

        {isLoading && !isRefreshing ? (
          <LoadingSkeleton message="Fetching assessment marks..." count={4} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchMarksData} />
        ) : coursesMarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Card variant="surface" style={styles.emptyCard}>
              <Feather name="file-text" size={36} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>No Marks Published</Text>
              <Text style={styles.emptySubtitle}>
                Marks have not yet been uploaded or published for this semester.
              </Text>
            </Card>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {coursesMarks.map((course, idx) => {
              const isExpanded = !!expandedCourses[course.course_code];

              // Calculate total scored weightage if components exist
              const totalWeightage = course.components.reduce((acc, comp) => {
                const w = parseFloat(comp.weightage_mark);
                return isNaN(w) ? acc : acc + w;
              }, 0);

              const totalMaxWeightage = course.components.reduce((acc, comp) => {
                const w = parseFloat(comp.weightage_percent);
                return isNaN(w) ? acc : acc + w;
              }, 0);

              return (
                <Card
                  key={`${course.course_code}-${idx}`}
                  variant="surface"
                  style={styles.courseCard}
                >
                  {/* Header / Clickable Accordion Row */}
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => toggleExpand(course.course_code)}
                    style={styles.courseHeader}
                  >
                    <View style={styles.courseHeaderLeft}>
                      <View style={styles.badgeRow}>
                        <Badge label={course.course_code} variant="lavender" size="sm" />
                        {course.course_type ? (
                          <Badge label={course.course_type} variant="default" size="sm" />
                        ) : null}
                        {course.slot ? (
                          <Badge label={`Slot: ${course.slot}`} variant="default" size="sm" />
                        ) : null}
                      </View>
                      <Text style={styles.courseTitle}>{course.course_title}</Text>

                      {totalMaxWeightage > 0 && (
                        <Text style={styles.totalWeightageText}>
                          Accumulated Weightage:{' '}
                          <Text style={styles.boldWeightage}>
                            {totalWeightage.toFixed(2)} / {totalMaxWeightage.toFixed(0)}%
                          </Text>
                        </Text>
                      )}
                    </View>

                    <View style={styles.expandIconContainer}>
                      <Feather
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={THEME.colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Assessment Components Breakdown */}
                  {isExpanded && (
                    <View style={styles.componentsContainer}>
                      {course.components.length === 0 ? (
                        <View style={styles.noComponentsBox}>
                          <Text style={styles.noComponentsText}>
                            No individual test components published yet.
                          </Text>
                        </View>
                      ) : (
                        course.components.map((comp, cIdx) => {
                          const scoredNum = parseFloat(comp.scored);
                          const maxNum = parseFloat(comp.max_marks);
                          const hasScore = !isNaN(scoredNum) && comp.scored.trim() !== '';

                          return (
                            <View key={`${comp.title}-${cIdx}`} style={styles.componentItem}>
                              <View style={styles.compTopRow}>
                                <Text style={styles.compTitle}>{comp.title}</Text>
                                {comp.status ? (
                                  <Badge
                                    label={comp.status}
                                    variant={comp.status.toLowerCase().includes('scored') ? 'mint' : 'default'}
                                    size="sm"
                                  />
                                ) : null}
                              </View>

                              <View style={styles.scoreStatsRow}>
                                {/* Scored Mark */}
                                <View style={styles.statBox}>
                                  <Text style={styles.statBoxLabel}>SCORED</Text>
                                  <Text style={styles.statBoxValue}>
                                    {hasScore ? comp.scored : '—'}
                                    <Text style={styles.statBoxMax}>
                                      {comp.max_marks ? ` / ${comp.max_marks}` : ''}
                                    </Text>
                                  </Text>
                                </View>

                                {/* Weightage */}
                                <View style={styles.statBox}>
                                  <Text style={styles.statBoxLabel}>WEIGHTAGE</Text>
                                  <Text style={styles.statBoxValue}>
                                    {comp.weightage_mark ? comp.weightage_mark : '—'}
                                    <Text style={styles.statBoxMax}>
                                      {comp.weightage_percent ? ` (${comp.weightage_percent}%)` : ''}
                                    </Text>
                                  </Text>
                                </View>

                                {/* Class Average */}
                                {comp.average ? (
                                  <View style={styles.statBox}>
                                    <Text style={styles.statBoxLabel}>CLASS AVG</Text>
                                    <Text style={styles.statBoxValue}>{comp.average}</Text>
                                  </View>
                                ) : null}
                              </View>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
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
  listContainer: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  courseCard: {
    padding: THEME.spacing.lg,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseHeaderLeft: {
    flex: 1,
    paddingRight: THEME.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginVertical: 4,
  },
  totalWeightageText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  boldWeightage: {
    fontWeight: '700',
    color: THEME.colors.pastel.mint.text,
  },
  expandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  componentsContainer: {
    marginTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  noComponentsBox: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  noComponentsText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
  componentItem: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  compTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  compTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  scoreStatsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  statBox: {
    flex: 1,
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  statBoxValue: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  statBoxMax: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
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
