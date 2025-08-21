// src/types/index.ts

export type Gender = 'Male' | 'Female' | 'Other';

export type AgeGroup = '10-19' | '20-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70-79';

export type EducationLevel = 'High School' | "Bachelor's" | "Master's" | 'PhD' | 'Other';

export type EvaluationScore = 1 | 2 | 3 | 4 | 5 | null;

// 表示一条待评估的医患对话及其两个回复
export interface EvaluationItem {
  _id: string; // MongoDB 自动生成的 ID
  context: string;
  dialogue: string[];
  concernType: string;
  responses: {
    response1: string;
    response2: string;
  };
  answeredTimes: number;
}

// 用户填写的个人信息
export interface PersonalInfo {
  annotatorId: string;
  gender: Gender | null;
  ageGroup: AgeGroup | null;
  educationLevel: EducationLevel | null;
}

// 对单个回复的五个维度评分
export interface Evaluation {
  helpfulness: EvaluationScore;
  clarity: EvaluationScore;
  reassurance: EvaluationScore;
  feasibility: EvaluationScore;
  medicalAccuracy: EvaluationScore;
}

// 一次完整提交的数据结构
export interface Submission {
  personalInfo: PersonalInfo;
  evaluation: {
    response1: Evaluation;
    response2: Evaluation;
  };
  timestamp: string; // ISO 时间字符串
}