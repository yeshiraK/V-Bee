import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Semester } from '../types/api';
import { getCourses } from '../api/academic';
import { useAuth } from './AuthContext';

interface SemesterContextType {
  semesters: Semester[];
  selectedSemester: Semester | null;
  setSelectedSemester: (semester: Semester) => void;
  isLoadingSemesters: boolean;
  error: string | null;
  refreshSemesters: () => Promise<void>;
}

const SemesterContext = createContext<SemesterContextType | undefined>(undefined);

export const SemesterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [isLoadingSemesters, setIsLoadingSemesters] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSemesters = async () => {
    if (!isAuthenticated) return;

    setIsLoadingSemesters(true);
    setError(null);
    try {
      const data = await getCourses();
      setSemesters(data);
      if (data && data.length > 0) {
        // Default to the first semester (usually the most recent) if none is selected
        setSelectedSemester((prev) => {
          if (prev && data.some((s) => s.id === prev.id)) {
            return prev;
          }
          return data[0];
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load semesters');
    } finally {
      setIsLoadingSemesters(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSemesters();
    } else {
      setSemesters([]);
      setSelectedSemester(null);
      setError(null);
    }
  }, [isAuthenticated]);

  return (
    <SemesterContext.Provider
      value={{
        semesters,
        selectedSemester,
        setSelectedSemester,
        isLoadingSemesters,
        error,
        refreshSemesters: fetchSemesters,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};

export const useSemester = (): SemesterContextType => {
  const context = useContext(SemesterContext);
  if (!context) {
    throw new Error('useSemester must be used within a SemesterProvider');
  }
  return context;
};
