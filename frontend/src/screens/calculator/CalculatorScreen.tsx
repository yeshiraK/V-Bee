import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { THEME } from '../../theme/colors';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { calculateAttendance } from '../../utils/calculator';

export const CalculatorScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const initialAttended = route.params?.initialAttended ?? 32;
  const initialTotal = route.params?.initialTotal ?? 38;
  const courseTitle = route.params?.courseTitle;

  const [attendedText, setAttendedText] = useState(String(initialAttended));
  const [totalText, setTotalText] = useState(String(initialTotal));

  const attendedNum = Math.max(0, parseInt(attendedText, 10) || 0);
  const totalNum = Math.max(0, parseInt(totalText, 10) || 0);

  const result = calculateAttendance(attendedNum, totalNum, 75);

  const updateAttended = (delta: number) => {
    const newVal = Math.max(0, attendedNum + delta);
    setAttendedText(String(newVal));
    if (newVal > totalNum) {
      setTotalText(String(newVal));
    }
  };

  const updateTotal = (delta: number) => {
    const newVal = Math.max(attendedNum, totalNum + delta);
    setTotalText(String(newVal));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerSubtitle}>MATHEMATICAL UTILITY</Text>
              <Text style={styles.headerTitle}>Attendance Calculator</Text>
            </View>
          </View>

          {courseTitle && (
            <View style={styles.coursePill}>
              <Feather name="book-open" size={13} color={THEME.colors.textSecondary} />
              <Text style={styles.coursePillText} numberOfLines={1}>
                {courseTitle}
              </Text>
            </View>
          )}

          {/* Real-time Calculation Result Hero Card */}
          <Card
            variant={result.isSafe ? 'mint' : 'peach'}
            style={styles.heroResultCard}
          >
            <View style={styles.resultHeader}>
              <Badge
                label={result.isSafe ? 'SAFE ATTENDANCE' : 'CRITICAL ATTENDANCE'}
                variant={result.isSafe ? 'mint' : 'peach'}
                size="sm"
              />
              <Text style={styles.thresholdNotice}>VIT Target: 75%</Text>
            </View>

            <View style={styles.mainStatRow}>
              <Text style={styles.mainPercentage}>
                {result.currentPercentage}%
              </Text>
              <View style={styles.classesRatio}>
                <Text style={styles.ratioNumber}>
                  {attendedNum} / {totalNum}
                </Text>
                <Text style={styles.ratioLabel}>Classes Attended</Text>
              </View>
            </View>

            <ProgressBar
              percentage={result.currentPercentage}
              style={styles.resultProgress}
            />

            {/* Verdict Box */}
            <View style={styles.verdictBox}>
              <View style={styles.verdictIconRow}>
                <Feather
                  name={result.isSafe ? 'check-circle' : 'alert-circle'}
                  size={18}
                  color={
                    result.isSafe
                      ? THEME.colors.pastel.mint.text
                      : THEME.colors.pastel.peach.text
                  }
                />
                <Text
                  style={[
                    styles.verdictActionText,
                    {
                      color: result.isSafe
                        ? THEME.colors.pastel.mint.text
                        : THEME.colors.pastel.peach.text,
                    },
                  ]}
                >
                  {result.isSafe
                    ? `Can miss: ${result.marginClasses} ${
                        result.marginClasses === 1 ? 'class' : 'classes'
                      }`
                    : `Need to attend: ${result.marginClasses} ${
                        result.marginClasses === 1 ? 'class' : 'classes'
                      }`}
                </Text>
              </View>
              <Text style={styles.verdictExplanation}>{result.details}</Text>
            </View>
          </Card>

          {/* Stepper / Input Card */}
          <Card variant="surface" style={styles.inputsCard}>
            <Text style={styles.inputSectionTitle}>Adjust Class Numbers</Text>

            {/* Attended Input */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperLabelBox}>
                <Text style={styles.stepperLabel}>CLASSES ATTENDED</Text>
                <Text style={styles.stepperSub}>Number of classes present</Text>
              </View>

              <View style={styles.stepperControls}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateAttended(-1)}
                >
                  <Feather name="minus" size={16} color={THEME.colors.textPrimary} />
                </TouchableOpacity>

                <TextInput
                  style={styles.stepperInput}
                  value={attendedText}
                  onChangeText={(val) => {
                    setAttendedText(val.replace(/[^0-9]/g, ''));
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                />

                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateAttended(1)}
                >
                  <Feather name="plus" size={16} color={THEME.colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputDivider} />

            {/* Total Input */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperLabelBox}>
                <Text style={styles.stepperLabel}>TOTAL CONDUCTED</Text>
                <Text style={styles.stepperSub}>Total classes held to date</Text>
              </View>

              <View style={styles.stepperControls}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateTotal(-1)}
                >
                  <Feather name="minus" size={16} color={THEME.colors.textPrimary} />
                </TouchableOpacity>

                <TextInput
                  style={styles.stepperInput}
                  value={totalText}
                  onChangeText={(val) => {
                    setTotalText(val.replace(/[^0-9]/g, ''));
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                />

                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateTotal(1)}
                >
                  <Feather name="plus" size={16} color={THEME.colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Educational Quick Presets */}
          <Card variant="yellow" style={styles.presetCard}>
            <Text style={styles.presetTitle}>VIT Attendance Guidelines</Text>
            <Text style={styles.presetText}>
              • 75% or above is strictly required for regular examination eligibility.
              {'\n'}• Debarment list is evaluated at the end of instructional period.
              {'\n'}• Attendance calculation is purely based on conducted lectures.
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xxl + 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    marginBottom: THEME.spacing.md,
    alignSelf: 'flex-start',
  },
  coursePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    maxWidth: 260,
  },
  heroResultCard: {
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thresholdNotice: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  mainStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: THEME.spacing.md,
  },
  mainPercentage: {
    fontSize: 50,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  classesRatio: {
    alignItems: 'flex-end',
  },
  ratioNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  ratioLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  resultProgress: {
    marginBottom: THEME.spacing.md,
  },
  verdictBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  verdictIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  verdictActionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  verdictExplanation: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  inputsCard: {
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  inputSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  stepperLabelBox: {
    flex: 1,
    paddingRight: THEME.spacing.sm,
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.5,
  },
  stepperSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperInput: {
    width: 56,
    height: 40,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.sm,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  inputDivider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginVertical: THEME.spacing.md,
  },
  presetCard: {
    padding: THEME.spacing.lg,
  },
  presetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.pastel.yellow.text,
    marginBottom: 6,
  },
  presetText: {
    fontSize: 12,
    color: THEME.colors.pastel.yellow.text,
    lineHeight: 18,
    opacity: 0.9,
  },
});
