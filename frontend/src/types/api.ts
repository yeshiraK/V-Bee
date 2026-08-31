/**
 * Strict TypeScript models matching the VTOP-API Rust backend structs.
 * NO hallucinated or fabricated fields.
 */

export interface ApiResponse<T> {
  status: 'ok' | 'error';
  data: T | null;
  error?: string | null;
}

export interface LoginResponse {
  login_session_id: string;
  captcha_image: string;
}

export interface LoginVerifyResponse {
  token: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  course_code: string;
  course_title: string;
  course_type: string;
  slot: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
  /** Classes needed to attend (> 0) or safe to miss (< 0) to hit the 75% target */
  target_classes: number;
}

export interface TimetableCourse {
  course_code: string;
  course_title: string;
  course_type: string;
  slot: string;
  venue: string;
  faculty: string;
}

export interface MarkComponent {
  title: string;
  max_marks: string;
  weightage_percent: string;
  scored: string;
  weightage_mark: string;
  average: string;
  status: string;
}

export interface CourseMarks {
  course_code: string;
  course_title: string;
  course_type: string;
  slot: string;
  components: MarkComponent[];
}

export interface CourseGrade {
  course_code: string;
  title: string;
  course_type: string;
  credits: string;
  grade: string;
  exam_month: string;
}

export interface GradeHistory {
  cgpa: string;
  credits_registered: string;
  credits_earned: string;
  courses: CourseGrade[];
}

export interface StudentProfile {
  application_number: string;
  student_name: string;
  programme: string;
  branch: string;
  school: string;
}

export interface ExamSchedule {
  exam_type: string;
  course_code: string;
  course_title: string;
  slot: string;
  exam_date: string;
  exam_time: string;
  venue: string;
  seat_location: string;
  seat_no: string;
}
