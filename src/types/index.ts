export type Gender = 'Male' | 'Female' | 'Other';

export type AgeGroup = '10-19' | '20-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70-79';

export type EducationLevel = 'High School' | "Bachelor's" | "Master's" | 'PhD' | 'Other';

export type EvaluationScore = 1 | 2 | 3 | 4 | 5 | null;

export interface PersonalInfo {
  annotatorId: string;
  gender: Gender | null;
  ageGroup: AgeGroup | null;
  educationLevel: EducationLevel | null;
}

export interface Evaluation {
  helpfulness: EvaluationScore;
  clarity: EvaluationScore;
  reassurance: EvaluationScore;
  feasibility: EvaluationScore;
  medicalAccuracy: EvaluationScore;
}

export interface Submission {
  personalInfo: PersonalInfo;
  evaluation: {
    response1: Evaluation;
    response2: Evaluation;
  };
  timestamp: string;
} 