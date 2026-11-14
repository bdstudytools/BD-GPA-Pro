import { useMemo, useState } from 'react';
import { CalculatorWorkspace } from './components/CalculatorWorkspace';
import { Header } from './components/Header';
import { RulesAndChartView } from './components/RulesAndChartView';
import { FOURTH_SUBJECT_OPTIONS, getSubjectsForConfig } from './data/curriculum';
import {
  ActiveTab,
  ExamLevel,
  LetterGrade,
  StudyGroup,
  SubjectEntry,
} from './types/gpa';
import { calculateGpa } from './utils/gpaCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [examLevel, setExamLevel] = useState<ExamLevel>('ssc');
  const [group, setGroup] = useState<StudyGroup>('science');
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() =>
    getSubjectsForConfig('ssc', 'science')
  );
  const [showResult, setShowResult] = useState<boolean>(false);

  const result = useMemo(
    () => calculateGpa(subjects, 'grade'),
    [subjects]
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

  const handleUpdateSubjectGrade = (id: string, grade: LetterGrade) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade } : s))
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

      // Otherwise replace the 4th subject entry in place while preserving its current grade
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
            subjects={subjects}
            onUpdateSubjectGrade={handleUpdateSubjectGrade}
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
