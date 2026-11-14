import { useMemo, useState } from 'react';
import { CalculatorWorkspace } from './components/CalculatorWorkspace';
import { Header } from './components/Header';
import { RulesAndChartView } from './components/RulesAndChartView';
import { FOURTH_SUBJECT_OPTIONS, getSubjectsForConfig } from './data/curriculum';
import {
  ActiveTab,
  ExamLevel,
  InputMode,
  LetterGrade,
  StudyGroup,
  SubjectEntry,
} from './types/gpa';
import { calculateGpa, isValidMark, marksToGrade } from './utils/gpaCalculator';

const GRADE_REPRESENTATIVE_MARKS: Record<LetterGrade, number> = {
  'A+': 85,
  A: 75,
  'A-': 65,
  B: 55,
  C: 45,
  D: 36,
  F: 25,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [examLevel, setExamLevel] = useState<ExamLevel>('ssc');
  const [group, setGroup] = useState<StudyGroup>('science');
  const [inputMode, setInputMode] = useState<InputMode>('grade');
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() =>
    getSubjectsForConfig('ssc', 'science')
  );
  const [showResult, setShowResult] = useState<boolean>(false);

  const result = useMemo(
    () => calculateGpa(subjects, inputMode),
    [subjects, inputMode]
  );

  const handleExamChange = (nextLevel: ExamLevel) => {
    setExamLevel(nextLevel);
    setSubjects(getSubjectsForConfig(nextLevel, group));
    setShowResult(false);
  };

  const handleGroupChange = (nextGroup: StudyGroup) => {
    setGroup(nextGroup);
    setSubjects(getSubjectsForConfig(examLevel, nextGroup));
    setShowResult(false);
  };

  const handleInputModeChange = (nextMode: InputMode) => {
    if (nextMode === 'marks') {
      setSubjects((prev) =>
        prev.map((s) => {
          const fallback = GRADE_REPRESENTATIVE_MARKS[s.grade];
          if (s.isTwoPaper) {
            return {
              ...s,
              paper1Marks: isValidMark(s.paper1Marks) ? s.paper1Marks : fallback,
              paper2Marks: isValidMark(s.paper2Marks) ? s.paper2Marks : fallback,
            };
          }
          return {
            ...s,
            marks: isValidMark(s.marks) ? s.marks : fallback,
          };
        })
      );
    } else if (inputMode === 'marks') {
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.isTwoPaper && isValidMark(s.paper1Marks) && isValidMark(s.paper2Marks)) {
            const avg = ((s.paper1Marks as number) + (s.paper2Marks as number)) / 2;
            return { ...s, grade: marksToGrade(avg).grade };
          }
          if (!s.isTwoPaper && isValidMark(s.marks)) {
            return { ...s, grade: marksToGrade(s.marks as number).grade };
          }
          return s;
        })
      );
    }
    setInputMode(nextMode);
    setShowResult(false);
  };

  const handleUpdateSubjectGrade = (id: string, grade: LetterGrade) => {
    const rep = GRADE_REPRESENTATIVE_MARKS[grade];
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              grade,
              marks: rep,
              paper1Marks: s.isTwoPaper ? rep : s.paper1Marks,
              paper2Marks: s.isTwoPaper ? rep : s.paper2Marks,
            }
          : s
      )
    );
    setShowResult(false);
  };

  const handleUpdateSubjectMarks = (id: string, marks: number | null) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (marks === null) {
          return { ...s, marks: null };
        }
        return {
          ...s,
          marks,
          grade: isValidMark(marks) ? marksToGrade(marks).grade : s.grade,
        };
      })
    );
    setShowResult(false);
  };

  const handleUpdateSubjectPaperMarks = (
    id: string,
    paper: 'paper1' | 'paper2',
    marks: number | null
  ) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextP1 = paper === 'paper1' ? marks : s.paper1Marks;
        const nextP2 = paper === 'paper2' ? marks : s.paper2Marks;
        const bothValid = isValidMark(nextP1) && isValidMark(nextP2);
        return {
          ...s,
          paper1Marks: nextP1,
          paper2Marks: nextP2,
          grade: bothValid
            ? marksToGrade(((nextP1 as number) + (nextP2 as number)) / 2).grade
            : s.grade,
        };
      })
    );
    setShowResult(false);
  };

  const handleChangeFourthSubjectOption = (optionId: string) => {
    const options = FOURTH_SUBJECT_OPTIONS[examLevel][group];
    const chosen = options.find((o) => o.id === optionId);
    if (!chosen) return;

    setSubjects((prev) => {
      const currentFourth = prev.find((s) => s.isFourthSubject);
      const existingInMain = prev.find((s) => !s.isFourthSubject && s.id === chosen.id);

      // If chosen option already exists in main group, swap it cleanly and keep 4th subject last
      if (existingInMain && currentFourth) {
        const swapped = prev.map((s) => {
          if (s.id === existingInMain.id) {
            return {
              ...s,
              category: 'fourth' as const,
              isFourthSubject: true,
            };
          }
          if (s.id === currentFourth.id) {
            return {
              ...s,
              category: 'group' as const,
              isFourthSubject: false,
            };
          }
          return s;
        });
        return [
          ...swapped.filter((s) => !s.isFourthSubject),
          ...swapped.filter((s) => s.isFourthSubject),
        ];
      }

      // Otherwise replace the 4th subject entry in place while preserving its current grade/marks
      return prev.map((s) => {
        if (!s.isFourthSubject) return s;
        return {
          ...s,
          id: chosen.id,
          code: chosen.code,
          nameEn: chosen.nameEn,
          nameBn: chosen.nameBn,
          category: 'fourth',
          isFourthSubject: true,
          isTwoPaper: examLevel === 'hsc',
        };
      });
    });
    setShowResult(false);
  };

  const handleResetDefaults = () => {
    setSubjects(getSubjectsForConfig(examLevel, group));
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onResetDefaults={handleResetDefaults}
        lang="en"
      />

      <main>
        {activeTab === 'calculator' ? (
          <CalculatorWorkspace
            lang="en"
            examLevel={examLevel}
            onChangeExamLevel={handleExamChange}
            group={group}
            onChangeGroup={handleGroupChange}
            inputMode={inputMode}
            onChangeInputMode={handleInputModeChange}
            subjects={subjects}
            onUpdateSubjectGrade={handleUpdateSubjectGrade}
            onUpdateSubjectMarks={handleUpdateSubjectMarks}
            onUpdateSubjectPaperMarks={handleUpdateSubjectPaperMarks}
            onChangeFourthSubjectOption={handleChangeFourthSubjectOption}
            result={result}
            showResult={showResult}
            onCalculateResult={() => setShowResult(true)}
          />
        ) : (
          <RulesAndChartView lang="en" />
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 text-sm font-semibold text-slate-700 sm:px-6 lg:px-8">
          <span>BD GPA Pro</span>
        </div>
      </footer>
    </div>
  );
}
