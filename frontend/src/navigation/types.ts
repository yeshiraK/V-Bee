export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Calculator:
    | {
        initialAttended?: number;
        initialTotal?: number;
        courseTitle?: string;
      }
    | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Attendance: undefined;
  Timetable: undefined;
  Marks: undefined;
  Grades: undefined;
};
