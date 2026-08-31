import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../theme/colors';
import { useSemester } from '../../context/SemesterContext';
import { SemesterPickerModal } from './SemesterPickerModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSemesterPicker?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showSemesterPicker = true,
  rightAction,
}) => {
  const { selectedSemester } = useSemester();
  const [modalVisible, setModalVisible] = useState(false);

  const hasControls = (showSemesterPicker && !!selectedSemester) || !!rightAction;

  return (
    <>
      <View style={styles.container}>
        {/* Full-width Title Section */}
        <View style={styles.titleBlock}>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle.toUpperCase()}</Text>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Dedicated Controls Row (Semester Selector & Action Button) */}
        {hasControls ? (
          <View style={styles.controlsRow}>
            {showSemesterPicker && selectedSemester ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalVisible(true)}
                style={styles.semesterPill}
              >
                <Feather name="calendar" size={14} color={THEME.colors.textPrimary} />
                <Text style={styles.semesterText} numberOfLines={1}>
                  {selectedSemester.name.replace(/Semester/i, 'Sem')}
                </Text>
                <Feather name="chevron-down" size={14} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            ) : (
              <View />
            )}

            {rightAction ? (
              <View style={styles.rightActionContainer}>{rightAction}</View>
            ) : null}
          </View>
        ) : null}
      </View>

      <SemesterPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
  },
  titleBlock: {
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
  },
  semesterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.radius.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
    gap: 8,
    ...THEME.shadows.subtle,
  },
  semesterText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});
