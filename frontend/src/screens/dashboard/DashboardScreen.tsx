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
import { useAuth } from '../../context/AuthContext';
import { useSemester } from '../../context/SemesterContext';
import {
  getAttendance,
  getGrades,
  getTimetable,
  getFacultyProfile,
} from '../../api/academic';
import {
  AttendanceRecord,
  GradeHistory,
  TimetableCourse,
  StudentProfile,
} from '../../types/api';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { username, logout } = useAuth();
  const { selectedSemester } = useSemester();

  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<GradeHistory | null>(null);
  const [timetable, setTimetable] = useState<TimetableCourse[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadDashboardData = useCallback(async () => {
    setError(null);
    try {
      const semesterId = selectedSemester?.id;

      const [attRes, gradeRes, ttRes, profRes] = await Promise.allSettled([
        getAttendance(semesterId),
        getGrades(),
        getTimetable(semesterId),
        getFacultyProfile(),
      ]);

      if (attRes.status === 'fulfilled') setAttendanceList(attRes.value);
      if (gradeRes.status === 'fulfilled') setGrades(gradeRes.value);
      if (ttRes.status === 'fulfilled') setTimetable(ttRes.value);
      if (profRes.status === 'fulfilled') setProfile(profRes.value);

      // If all failed
      if (
        attRes.status === 'rejected' &&
        gradeRes.status === 'rejected' &&
        ttRes.status === 'rejected'
      ) {
        throw new Error('Unable to connect to academic services');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    setIsLoading(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  // Calculate aggregate attendance
  const totalAttended = attendanceList.reduce((acc, curr) => acc + curr.attended, 0);
  const totalConducted = attendanceList.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage =
    totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;
  const isOverallSafe = overallPercentage >= 75;

  // Below 75% course count
  const criticalCourses = attendanceList.filter((c) => c.percentage < 75);

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
          title="Your Academic Overview"
          subtitle={getGreeting()}
          rightAction={
            <TouchableOpacity
              onPress={logout}
              style={styles.logoutBtn}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={16} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        {isLoading && !isRefreshing ? (
          <LoadingSkeleton message="Compiling your overview..." count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={loadDashboardData} />
        ) : (
          <View style={styles.content}>
            {/* Student Profile Pill Card if available */}
            {profile && profile.student_name ? (
              <Card variant="surface" style={styles.profileCard}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.avatarInitial}>
                    {profile.student_name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profile.student_name}
                  </Text>
                  <Text style={styles.profileSub} numberOfLines={1}>
                    {profile.programme || profile.branch || username}
                  </Text>
                </View>
                {profile.school ? (
                  <Badge label={profile.school} variant="lavender" size="sm" />
                ) : null}
              </Card>
            ) : null}

            {/* Attendance Overview Card (Hero) */}
            <Card
              variant={isOverallSafe ? 'yellow' : 'peach'}
              style={styles.heroCard}
              onPress={() => navigation.navigate('Attendance')}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Badge
                    label="ATTENDANCE"
                    variant={isOverallSafe ? 'yellow' : 'peach'}
                    size="sm"
                  />
                  <Text style={styles.heroCardTitle}>Overall Attendance</Text>
                </View>
                <View style={styles.chevronCircle}>
                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color={
                      isOverallSafe
                        ? THEME.colors.pastel.yellow.text
                        : THEME.colors.pastel.peach.text
                    }
                  />
                </View>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLarge}>{overallPercentage}%</Text>
                <View style={styles.statSubInfo}>
                  <Text style={styles.statFraction}>
                    {totalAttended} / {totalConducted}
                  </Text>
                  <Text style={styles.statLabel}>Classes Attended</Text>
                </View>
              </View>

              <ProgressBar
                percentage={overallPercentage}
                style={styles.heroProgress}
              />

              <View style={styles.cardFooter}>
                {criticalCourses.length > 0 ? (
                  <View style={styles.alertRow}>
                    <Feather
                      name="alert-triangle"
                      size={14}
                      color={THEME.colors.pastel.rose.accent}
                    />
                    <Text style={styles.alertText}>
                      {criticalCourses.length} course
                      {criticalCourses.length > 1 ? 's' : ''} below 75%
                    </Text>
                  </View>
                ) : (
                  <View style={styles.alertRow}>
                    <Feather
                      name="check-circle"
                      size={14}
                      color={THEME.colors.pastel.mint.text}
                    />
                    <Text style={styles.safeText}>
                      All registered courses are safe (≥ 75%)
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Two Column Grid: CGPA & Timetable */}
            <View style={styles.gridRow}>
              {/* CGPA Card */}
              <Card
                variant="blue"
                style={styles.gridCard}
                onPress={() => navigation.navigate('Grades')}
              >
                <Badge label="GRADES" variant="blue" size="sm" />
                <Text style={styles.gridCardTitle}>Current CGPA</Text>
                <Text style={styles.gridStatLarge}>
                  {grades?.cgpa ? grades.cgpa : '—'}
                </Text>
                <Text style={styles.gridStatSub}>
                  {grades?.credits_earned
                    ? `${grades.credits_earned} Credits Earned`
                    : 'View Full History'}
                </Text>
              </Card>

              {/* Timetable Card */}
              <Card
                variant="mint"
                style={styles.gridCard}
                onPress={() => navigation.navigate('Timetable')}
              >
                <Badge label="TIMETABLE" variant="mint" size="sm" />
                <Text style={styles.gridCardTitle}>Courses</Text>
                <Text style={styles.gridStatLarge}>{timetable.length}</Text>
                <Text style={styles.gridStatSub}>Registered this semester</Text>
              </Card>
            </View>

            {/* Marks & Assessments Card */}
            <Card
              variant="lavender"
              style={styles.marksSummaryCard}
              onPress={() => navigation.navigate('Marks')}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Badge label="ASSESSMENTS" variant="lavender" size="sm" />
                  <Text style={styles.heroCardTitle}>Marks & Performance</Text>
                </View>
                <View style={styles.chevronCircle}>
                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color={THEME.colors.pastel.lavender.text}
                  />
                </View>
              </View>
              <Text style={styles.marksDesc}>
                View CAT-1, CAT-2, Quizzes, Digital Assignments, and FAT scores
                for all active courses.
              </Text>
            </Card>

            {/* Quick Attendance Calculator Trigger Card */}
            <Card
              variant="surface"
              style={styles.calcTriggerCard}
              onPress={() => navigation.navigate('Calculator')}
            >
              <View style={styles.calcIconContainer}>
                <Feather name="percent" size={20} color={THEME.colors.textPrimary} />
              </View>
              <View style={styles.calcTextContainer}>
                <Text style={styles.calcTitle}>Attendance Calculator</Text>
                <Text style={styles.calcSub}>
                  Calculate bunk margin & target classes to reach 75%
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={THEME.colors.textSecondary} />
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
    gap: THEME.spacing.md,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.pastel.lavender.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.pastel.lavender.text,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  profileSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  heroCard: {
    padding: THEME.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    gap: 6,
  },
  heroCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.spacing.md,
    marginVertical: THEME.spacing.md,
  },
  statLarge: {
    fontSize: 48,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  statSubInfo: {
    marginBottom: 8,
  },
  statFraction: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  heroProgress: {
    marginBottom: THEME.spacing.md,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: THEME.spacing.sm,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.pastel.rose.accent,
  },
  safeText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.pastel.mint.text,
  },
  gridRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  gridCard: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginTop: 8,
  },
  gridStatLarge: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginVertical: 4,
  },
  gridStatSub: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  marksSummaryCard: {
    padding: THEME.spacing.lg,
  },
  marksDesc: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginTop: THEME.spacing.sm,
  },
  calcTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  calcIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcTextContainer: {
    flex: 1,
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  calcSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
