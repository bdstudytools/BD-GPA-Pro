export type Language = 'en' | 'bn';

export type ActiveTab = 'calculator' | 'rules';

export type ExamLevel = 'ssc' | 'hsc';

export type StudyGroup = 'science' | 'business' | 'humanities';

export type EducationBoard =
  | 'dhaka'
  | 'rajshahi'
  | 'comilla'
  | 'jessore'
  | 'chittagong'
  | 'barisal'
  | 'sylhet'
  | 'dinajpur'
  | 'mymensingh'
  | 'madrasah'
  | 'technical';

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';

export type InputMode = 'grade' | 'marks' | 'point';

export type SubjectCategory = 'compulsory' | 'group' | 'fourth';

export interface SubjectEntry {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  category: SubjectCategory;
  isFourthSubject: boolean;
  isTwoPaper?: boolean;
  maxMarks?: 50 | 100 | 200;
  grade: LetterGrade;
  marks: number | null;
  paper1Marks?: number | null;
  paper2Marks?: number | null;
}

export interface GpaCalculationResult {
  gpaWithFourth: number;
  gpaWithoutFourth: number;
  finalLetterGrade: LetterGrade;
  withoutFourthLetterGrade: LetterGrade;
  totalMainSubjects: number;
  sumMainGradePoints: number;
  fourthSubjectGradePoint: number;
  fourthSubjectBonus: number;
  hasFourthSubject: boolean;
  fourthSubjectFailed: boolean;
  hasMainFail: boolean;
  failedSubjects: SubjectEntry[];
  isGoldenAPlus: boolean;
  isStandardAPlus: boolean;
  hasIncompleteMarks: boolean;
  hasInvalidMarks: boolean;
  invalidSubjectIds: string[];
  incompleteSubjectIds: string[];
}
