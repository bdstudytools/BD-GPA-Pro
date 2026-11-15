import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGpa,
  evaluateSubject,
  gradeToGp,
  marksToGrade,
} from './gpaCalculator';
import { SubjectEntry } from '../types/gpa';

function makeSubject(
  id: string,
  grade: SubjectEntry['grade'],
  isFourthSubject = false,
  marks: number | null = null
): SubjectEntry {
  return {
    id,
    code: '101',
    nameEn: id,
    nameBn: id,
    category: isFourthSubject ? 'fourth' : 'compulsory',
    isFourthSubject,
    grade,
    marks,
  };
}

test('marksToGrade converts official NCTB intervals accurately', () => {
  assert.deepEqual(marksToGrade(100), { grade: 'A+', gp: 5.0 });
  assert.deepEqual(marksToGrade(80), { grade: 'A+', gp: 5.0 });
  assert.deepEqual(marksToGrade(79), { grade: 'A', gp: 4.0 });
  assert.deepEqual(marksToGrade(70), { grade: 'A', gp: 4.0 });
  assert.deepEqual(marksToGrade(65), { grade: 'A-', gp: 3.5 });
  assert.deepEqual(marksToGrade(50), { grade: 'B', gp: 3.0 });
  assert.deepEqual(marksToGrade(40), { grade: 'C', gp: 2.0 });
  assert.deepEqual(marksToGrade(33), { grade: 'D', gp: 1.0 });
  assert.deepEqual(marksToGrade(32), { grade: 'F', gp: 0.0 });
  assert.deepEqual(marksToGrade(0), { grade: 'F', gp: 0.0 });
});

test('gradeToGp maps all letter grades accurately', () => {
  assert.equal(gradeToGp('A+'), 5.0);
  assert.equal(gradeToGp('A'), 4.0);
  assert.equal(gradeToGp('A-'), 3.5);
  assert.equal(gradeToGp('B'), 3.0);
  assert.equal(gradeToGp('C'), 2.0);
  assert.equal(gradeToGp('D'), 1.0);
  assert.equal(gradeToGp('F'), 0.0);
});

test('calculateGpa applies 4th subject bonus max(0, gp - 2.00) including B (+1.00) and caps at 5.00', () => {
  const subjects: SubjectEntry[] = [
    makeSubject('bangla', 'A+'),
    makeSubject('english', 'A'), // 4.00
    makeSubject('math', 'A+'),
    makeSubject('physics', 'A+'),
    makeSubject('chemistry', 'A+'),
    makeSubject('biology', 'A+'),
    makeSubject('higher-math', 'A+', true), // +3.00 bonus
  ];

  const result = calculateGpa(subjects, 'grade');
  assert.equal(result.totalMainSubjects, 6);
  assert.equal(result.sumMainGradePoints, 29.0);
  assert.equal(result.fourthSubjectBonus, 3.0);
  assert.equal(result.gpaWithoutFourth, 4.83);
  assert.equal(result.gpaWithFourth, 5.0);
  assert.equal(result.isStandardAPlus, true);
  assert.equal(result.isGoldenAPlus, false);
  assert.equal(result.hasMainFail, false);

  const bFourthSubjects = subjects.map((s) =>
    s.isFourthSubject ? { ...s, grade: 'B' as const } : s
  );
  const bResult = calculateGpa(bFourthSubjects, 'grade');
  assert.equal(bResult.fourthSubjectBonus, 1.0);
  assert.equal(bResult.gpaWithFourth, 5.0);
});

test('calculateGpa detects Golden A+ when all main subjects are A+', () => {
  const subjects: SubjectEntry[] = [
    makeSubject('bangla', 'A+'),
    makeSubject('english', 'A+'),
    makeSubject('math', 'A+'),
    makeSubject('physics', 'A+'),
    makeSubject('chemistry', 'A+'),
    makeSubject('biology', 'A+'),
    makeSubject('higher-math', 'C', true), // +0 bonus
  ];

  const result = calculateGpa(subjects, 'grade');
  assert.equal(result.fourthSubjectBonus, 0);
  assert.equal(result.gpaWithoutFourth, 5.0);
  assert.equal(result.gpaWithFourth, 5.0);
  assert.equal(result.isGoldenAPlus, true);
  assert.equal(result.isStandardAPlus, true);
});

test('calculateGpa fails student if any main subject is F, but NOT if only 4th subject is F', () => {
  const mainFailSubjects: SubjectEntry[] = [
    makeSubject('bangla', 'A+'),
    makeSubject('english', 'F'),
    makeSubject('math', 'A+'),
    makeSubject('higher-math', 'A+', true),
  ];

  const failRes = calculateGpa(mainFailSubjects, 'grade');
  assert.equal(failRes.hasMainFail, true);
  assert.equal(failRes.gpaWithFourth, 0);
  assert.equal(failRes.gpaWithoutFourth, 0);
  assert.equal(failRes.finalLetterGrade, 'F');
  assert.equal(failRes.failedSubjects.length, 1);
  assert.equal(failRes.failedSubjects[0].id, 'english');

  const fourthFailSubjects: SubjectEntry[] = [
    makeSubject('bangla', 'A+'),
    makeSubject('english', 'A'),
    makeSubject('math', 'A+'),
    makeSubject('higher-math', 'F', true),
  ];

  const fourthFailRes = calculateGpa(fourthFailSubjects, 'grade');
  assert.equal(fourthFailRes.hasMainFail, false);
  assert.equal(fourthFailRes.fourthSubjectFailed, true);
  assert.equal(fourthFailRes.fourthSubjectBonus, 0);
  assert.equal(fourthFailRes.gpaWithFourth, 4.67);
  assert.equal(fourthFailRes.gpaWithoutFourth, 4.67);
  assert.equal(fourthFailRes.finalLetterGrade, 'A');
});

test('calculateGpa handles marks input mode and invalid/incomplete marks', () => {
  const subjects: SubjectEntry[] = [
    makeSubject('bangla', 'F', false, 85),
    makeSubject('english', 'F', false, 72),
    makeSubject('math', 'F', false, 30), // fail
    makeSubject('agri', 'F', true, 90), // +3.00 bonus
  ];

  const res = calculateGpa(subjects, 'marks');
  assert.equal(res.hasMainFail, true);
  assert.equal(res.failedSubjects[0].id, 'math');
  assert.equal(res.gpaWithFourth, 0);

  const validPassSubjects: SubjectEntry[] = [
    makeSubject('bangla', 'F', false, 85),
    makeSubject('english', 'F', false, 72),
    makeSubject('math', 'F', false, 80),
    makeSubject('agri', 'F', true, 90),
  ];
  const passRes = calculateGpa(validPassSubjects, 'marks');
  assert.equal(passRes.hasMainFail, false);
  assert.equal(passRes.gpaWithoutFourth, 4.67);
  assert.equal(passRes.gpaWithFourth, 5.0);
});

test('calculateGpa evaluates HSC 2-paper 200-mark subjects and point mode accurately', () => {
  const hscSubjects: SubjectEntry[] = [
    { ...makeSubject('hsc-bangla', 'A+'), isTwoPaper: true, paper1Marks: 82, paper2Marks: 80 }, // avg 81 -> A+ (5.0)
    { ...makeSubject('hsc-english', 'A'), isTwoPaper: true, paper1Marks: 78, paper2Marks: 72 }, // avg 75 -> A (4.0)
    { ...makeSubject('hsc-ict', 'A+'), isTwoPaper: false, marks: 88 }, // single paper -> A+ (5.0)
    { ...makeSubject('hsc-physics', 'A+'), isTwoPaper: true, paper1Marks: 85, paper2Marks: 75 }, // avg 80 -> A+ (5.0)
    { ...makeSubject('hsc-chemistry', 'A+'), isTwoPaper: true, paper1Marks: 90, paper2Marks: 84 }, // avg 87 -> A+ (5.0)
    { ...makeSubject('hsc-biology', 'A+'), isTwoPaper: true, paper1Marks: 81, paper2Marks: 79 }, // avg 80 -> A+ (5.0)
    { ...makeSubject('hsc-higher-math', 'A+', true), isTwoPaper: true, paper1Marks: 84, paper2Marks: 86 }, // avg 85 -> A+ (+3.0 bonus)
  ];

  const marksRes = calculateGpa(hscSubjects, 'marks');
  assert.equal(marksRes.hasMainFail, false);
  assert.equal(marksRes.hasInvalidMarks, false);
  assert.equal(marksRes.hasIncompleteMarks, false);
  assert.equal(marksRes.gpaWithoutFourth, 4.83);
  assert.equal(marksRes.gpaWithFourth, 5.0);

  const pointRes = calculateGpa(hscSubjects, 'point');
  assert.equal(pointRes.gpaWithoutFourth, 4.83);
  assert.equal(pointRes.gpaWithFourth, 5.0);
});

test('calculateGpa evaluates SSC ICT 50-mark scale and validates max 50 marks', () => {
  const ict = (marks: number): SubjectEntry => ({
    ...makeSubject('ssc-ict', 'A+', false, marks),
    maxMarks: 50,
  });

  assert.deepEqual(evaluateSubject(ict(50), 'marks'), { grade: 'A+', gp: 5.0 });
  assert.deepEqual(evaluateSubject(ict(40), 'marks'), { grade: 'A+', gp: 5.0 });
  assert.deepEqual(evaluateSubject(ict(35), 'marks'), { grade: 'A', gp: 4.0 });
  assert.deepEqual(evaluateSubject(ict(30), 'marks'), { grade: 'A-', gp: 3.5 });
  assert.deepEqual(evaluateSubject(ict(25), 'marks'), { grade: 'B', gp: 3.0 });
  assert.deepEqual(evaluateSubject(ict(20), 'marks'), { grade: 'C', gp: 2.0 });
  assert.deepEqual(evaluateSubject(ict(17), 'marks'), { grade: 'D', gp: 1.0 });
  assert.deepEqual(evaluateSubject(ict(16), 'marks'), { grade: 'F', gp: 0.0 });

  const invalidRes = calculateGpa([ict(60), makeSubject('ssc-math', 'A+', false, 85)], 'marks');
  assert.equal(invalidRes.hasInvalidMarks, true);
  assert.deepEqual(invalidRes.invalidSubjectIds, ['ssc-ict']);
});


