import { GRADING_SCALE } from '../data/curriculum';
import {
  GpaCalculationResult,
  LetterGrade,
  SubjectEntry,
} from '../types/gpa';

const GRADE_TO_GP_MAP: Record<LetterGrade, number> = {
  'A+': 5.0,
  A: 4.0,
  'A-': 3.5,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function gradeToGp(grade: LetterGrade): number {
  return GRADE_TO_GP_MAP[grade] ?? 0.0;
}

export function marksToGrade(marks: number): { grade: LetterGrade; gp: number } {
  if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
    return { grade: 'F', gp: 0.0 };
  }
  const roundedMarks = Math.floor(marks);
  for (const row of GRADING_SCALE) {
    if (roundedMarks >= row.minMarks && roundedMarks <= row.maxMarks) {
      return { grade: row.grade, gp: row.gp };
    }
  }
  return { grade: 'F', gp: 0.0 };
}

export function gpToOverallLetterGrade(gpa: number): LetterGrade {
  if (gpa >= 5.0) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F';
}

export function isValidMark(mark: number | null): boolean {
  return mark !== null && Number.isFinite(mark) && mark >= 0 && mark <= 100;
}

export function calculateGpa(
  subjects: SubjectEntry[],
  inputMode: 'grade' | 'marks' = 'grade'
): GpaCalculationResult {
  const invalidSubjectIds: string[] = [];
  const incompleteSubjectIds: string[] = [];

  if (inputMode === 'marks') {
    for (const subject of subjects) {
      if (subject.marks === null) {
        incompleteSubjectIds.push(subject.id);
      } else if (!Number.isFinite(subject.marks) || subject.marks < 0 || subject.marks > 100) {
        invalidSubjectIds.push(subject.id);
      }
    }
  }

  const getSubjectEvaluation = (subject: SubjectEntry): { grade: LetterGrade; gp: number } => {
    if (inputMode === 'marks') {
      if (subject.marks === null || !isValidMark(subject.marks)) {
        return { grade: 'F', gp: 0.0 };
      }
      return marksToGrade(subject.marks);
    }
    return { grade: subject.grade, gp: gradeToGp(subject.grade) };
  };

  const mainSubjects = subjects.filter((s) => !s.isFourthSubject);
  const fourthSubjects = subjects.filter((s) => s.isFourthSubject);

  const failedSubjects: SubjectEntry[] = [];
  let sumMainGradePoints = 0;

  for (const subject of mainSubjects) {
    const evalResult = getSubjectEvaluation(subject);
    if (evalResult.grade === 'F' || evalResult.gp === 0) {
      failedSubjects.push(subject);
    }
    sumMainGradePoints += evalResult.gp;
  }

  let fourthSubjectGradePoint = 0;
  let fourthSubjectBonus = 0;
  let fourthSubjectFailed = false;

  if (fourthSubjects.length > 0) {
    for (const fourth of fourthSubjects) {
      const evalResult = getSubjectEvaluation(fourth);
      fourthSubjectGradePoint += evalResult.gp;
      fourthSubjectBonus += Math.max(0, evalResult.gp - 2.0);
      if (evalResult.grade === 'F') {
        fourthSubjectFailed = true;
      }
    }
  }

  const totalMainSubjects = mainSubjects.length;
  const hasMainFail = failedSubjects.length > 0;

  if (totalMainSubjects === 0) {
    return {
      gpaWithFourth: 0,
      gpaWithoutFourth: 0,
      finalLetterGrade: 'F',
      withoutFourthLetterGrade: 'F',
      totalMainSubjects: 0,
      sumMainGradePoints: 0,
      fourthSubjectGradePoint: roundToTwo(fourthSubjectGradePoint),
      fourthSubjectBonus: roundToTwo(fourthSubjectBonus),
      hasFourthSubject: fourthSubjects.length > 0,
      fourthSubjectFailed,
      hasMainFail: false,
      failedSubjects: [],
      isGoldenAPlus: false,
      isStandardAPlus: false,
      hasIncompleteMarks: incompleteSubjectIds.length > 0,
      hasInvalidMarks: invalidSubjectIds.length > 0,
      invalidSubjectIds,
      incompleteSubjectIds,
    };
  }

  const gpaWithoutFourth = hasMainFail
    ? 0
    : roundToTwo(sumMainGradePoints / totalMainSubjects);

  const gpaWithFourth = hasMainFail
    ? 0
    : Math.min(5.0, roundToTwo((sumMainGradePoints + fourthSubjectBonus) / totalMainSubjects));

  const finalLetterGrade = hasMainFail ? 'F' : gpToOverallLetterGrade(gpaWithFourth);
  const withoutFourthLetterGrade = hasMainFail
    ? 'F'
    : gpToOverallLetterGrade(gpaWithoutFourth);

  return {
    gpaWithFourth,
    gpaWithoutFourth,
    finalLetterGrade,
    withoutFourthLetterGrade,
    totalMainSubjects,
    sumMainGradePoints: roundToTwo(sumMainGradePoints),
    fourthSubjectGradePoint: roundToTwo(fourthSubjectGradePoint),
    fourthSubjectBonus: roundToTwo(fourthSubjectBonus),
    hasFourthSubject: fourthSubjects.length > 0,
    fourthSubjectFailed,
    hasMainFail,
    failedSubjects,
    isGoldenAPlus: !hasMainFail && gpaWithoutFourth === 5.0,
    isStandardAPlus: !hasMainFail && gpaWithFourth === 5.0,
    hasIncompleteMarks: incompleteSubjectIds.length > 0,
    hasInvalidMarks: invalidSubjectIds.length > 0,
    invalidSubjectIds,
    incompleteSubjectIds,
  };
}
