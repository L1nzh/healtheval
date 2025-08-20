'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PersonalInfo, Submission } from '@/types';

interface AppContextType {
  personalInfo: PersonalInfo | null;
  setPersonalInfo: (info: PersonalInfo) => void;
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const addSubmission = async (submission: Submission) => {
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      setSubmissions((prev) => [...prev, submission]);
    } catch (error) {
      console.error('submit data error:', error);
      alert('submit data error: try again');
    }
  };

  return (
    <AppContext.Provider
      value={{
        personalInfo,
        setPersonalInfo,
        submissions,
        addSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 