import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../theme/colors';
import { Semester } from '../../types/api';
import { useSemester } from '../../context/SemesterContext';

interface SemesterPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SemesterPickerModal: React.FC<SemesterPickerModalProps> = ({
  visible,
  onClose,
}) => {
  const { semesters, selectedSemester, setSelectedSemester } = useSemester();

  const handleSelect = (sem: Semester) => {
    setSelectedSemester(sem);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Select Semester</Text>
                  <Text style={styles.subtitle}>Choose active academic period</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Feather name="x" size={20} color={THEME.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={semesters}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                  const isSelected = selectedSemester?.id === item.id;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                      style={[
                        styles.item,
                        isSelected && styles.itemSelected,
                      ]}
                    >
                      <View style={styles.itemTextContainer}>
                        <Text
                          style={[
                            styles.itemName,
                            isSelected && styles.itemNameSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.itemId}>{item.id}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkIcon}>
                          <Feather
                            name="check"
                            size={16}
                            color={THEME.colors.pastel.mint.text}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
    maxHeight: '65%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    backgroundColor: THEME.colors.surface,
  },
  itemSelected: {
    backgroundColor: THEME.colors.pastel.mint.bg,
    borderColor: THEME.colors.pastel.mint.border,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  itemNameSelected: {
    color: THEME.colors.pastel.mint.text,
    fontWeight: '700',
  },
  itemId: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.pastel.mint.badge,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing.sm,
  },
});
