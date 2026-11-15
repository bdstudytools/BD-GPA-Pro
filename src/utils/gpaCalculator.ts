import { GRADING_SCALE } from '../data/curriculum';
import {
  GpaCalculationResult,
  InputMode,
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

export function gpToLetterGrade(gp: number): LetterGrade {
  if (gp >= 5.0) return 'A+';
  if (gp >= 4.0) return 'A';
  if (gp >= 3.5) return 'A-';
  if (gp >= 3.0) return 'B';
  if (gp >= 2.0) return 'C';
  if (gp >= 1.0) return 'D';
  return 'F';
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

export function isValidMark(
  mark: number | null | undefined,
  maxLimit = 100
): boolean {
  return (
    mark !== null &&
    mark !== undefined &&
    Number.isFinite(mark) &&
    mark >= 0 &&
    mark <= maxLimit
  );
}

export function evaluateSubject(
  subject: SubjectEntry,
  inputMode: InputMode
): { grade: LetterGrade; gp: number } {
  if (inputMode === 'marks') {
    if (subject.isTwoPaper) {
      if (isValidMark(subject.paper1Marks, 100) && isValidMark(subject.paper2Marks, 100)) {
        const combinedAverage =
          ((subject.paper1Marks as number) + (subject.paper2Marks as number)) / 2;
        return marksToGrade(combinedAverage);
      }
      return { grade: 'F', gp: 0.0 };
    }
    const maxLimit = subject.maxMarks === 50 ? 50 : 100;
    if (isValidMark(subject.marks, maxLimit)) {
      const percentage =
        maxLimit === 50 ? (subject.marks as number) * 2 : (subject.marks as number);
      return marksToGrade(percentage);
    }
    return { grade: 'F', gp: 0.0 };
  }
  return { grade: subject.grade, gp: gradeToGp(subject.grade) };
}

export function calculateGpa(
  subjects: SubjectEntry[],
  inputMode: InputMode = 'grade'
): GpaCalculationResult {
  const invalidSubjectIds: string[] = [];
  const incompleteSubjectIds: string[] = [];

  if (inputMode === 'marks') {
    for (const subject of subjects) {
      if (subject.isTwoPaper) {
        const p1 = subject.paper1Marks;
        const p2 = subject.paper2Marks;
        const p1Missing = p1 === null || p1 === undefined;
        const p2Missing = p2 === null || p2 === undefined;
        const p1Invalid = !p1Missing && (!Number.isFinite(p1) || p1 < 0 || p1 > 100);
        const p2Invalid = !p2Missing && (!Number.isFinite(p2) || p2 < 0 || p2 > 100);

        if (p1Invalid || p2Invalid) {
          invalidSubjectIds.push(subject.id);
        } else if (p1Missing || p2Missing) {
          incompleteSubjectIds.push(subject.id);
        }
      } else {
        const maxLimit = subject.maxMarks === 50 ? 50 : 100;
        if (subject.marks === null) {
          incompleteSubjectIds.push(subject.id);
        } else if (!Number.isFinite(subject.marks) || subject.marks < 0 || subject.marks > maxLimit) {
          invalidSubjectIds.push(subject.id);
        }
      }
    }
  }

  const mainSubjects = subjects.filter((s) => !s.isFourthSubject);
  const fourthSubjects = subjects.filter((s) => s.isFourthSubject);

  const failedSubjects: SubjectEntry[] = [];
  let sumMainGradePoints = 0;

  for (const subject of mainSubjects) {
    const evalResult = evaluateSubject(subject, inputMode);
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
      const evalResult = evaluateSubject(fourth, inputMode);
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
