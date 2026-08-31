import { apiClient } from './client';
import {
  Semester,
  AttendanceRecord,
  TimetableCourse,
  CourseMarks,
  GradeHistory,
  StudentProfile,
  ExamSchedule,
} from '../types/api';

/**
 * Fetch available semesters from /api/courses
 */
export async function getCourses(): Promise<Semester[]> {
  return apiClient<Semester[]>('/api/courses');
}

/**
 * Fetch attendance records for a specific semester
 */
export async function getAttendance(semester?: string): Promise<AttendanceRecord[]> {
  return apiClient<AttendanceRecord[]>('/api/attendance', {
    params: { semester },
  });
}

/**
 * Fetch timetable courses for a specific semester
 */
export async function getTimetable(semester?: string): Promise<TimetableCourse[]> {
  return apiClient<TimetableCourse[]>('/api/timetable', {
    params: { semester },
  });
}

/**
 * Fetch course marks breakdown for a specific semester
 */
export async function getMarks(semester?: string): Promise<CourseMarks[]> {
  return apiClient<CourseMarks[]>('/api/marks', {
    params: { semester },
  });
}

/**
 * Fetch overall grade history and CGPA summary
 */
export async function getGrades(): Promise<GradeHistory> {
  return apiClient<GradeHistory>('/api/grades');
}

/**
 * Fetch student profile / faculty info
 */
export async function getFacultyProfile(): Promise<StudentProfile> {
  return apiClient<StudentProfile>('/api/faculty');
}

/**
 * Fetch exam schedule for a specific semester
 */
export async function getExams(semester?: string): Promise<ExamSchedule[]> {
  return apiClient<ExamSchedule[]>('/api/exams', {
    params: { semester },
  });
}
