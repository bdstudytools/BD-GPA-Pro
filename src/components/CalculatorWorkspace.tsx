import { AlertTriangle, Calculator } from 'lucide-react';
import {
  FOURTH_SUBJECT_OPTIONS,
  LETTER_GRADES,
  UI_TEXT,
} from '../data/curriculum';
import {
  ExamLevel,
  GpaCalculationResult,
  Language,
  LetterGrade,
  StudyGroup,
  SubjectEntry,
} from '../types/gpa';
import { gradeToGp } from '../utils/gpaCalculator';

interface CalculatorWorkspaceProps {
  lang: Language;
  examLevel: ExamLevel;
  onChangeExamLevel: (level: ExamLevel) => void;
  group: StudyGroup;
  onChangeGroup: (group: StudyGroup) => void;
  subjects: SubjectEntry[];
  onUpdateSubjectGrade: (id: string, grade: LetterGrade) => void;
  onChangeFourthSubjectOption: (optionId: string) => void;
  result: GpaCalculationResult;
  showResult: boolean;
  onCalculateResult: () => void;
}

export function CalculatorWorkspace({
  lang,
  examLevel,
  onChangeExamLevel,
  group,
  onChangeGroup,
  subjects,
  onUpdateSubjectGrade,
  onChangeFourthSubjectOption,
  result,
  showResult,
  onCalculateResult,
}: CalculatorWorkspaceProps) {
  const t = UI_TEXT[lang];
  const fourthOptions = FOURTH_SUBJECT_OPTIONS[examLevel][group];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Title */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl text-balance">
          {t.heroTitle}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Clean 2-Column Calculator Workspace: Left = Config + Subjects, Right = Calculate Button & GPA Result */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Exam Configuration + Subject List */}
        <div className="space-y-5 lg:col-span-7">
          {/* Exam Level & Study Group Selector */}
          <section
            aria-label="Exam Configuration"
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700/80 dark:bg-slate-800"
          >
            <div className="grid gap-4">
              {/* Exam Level */}
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t.examLevelLabel}
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900">
                  {(
                    [
                      { id: 'ssc', label: t.sscOption },
                      { id: 'hsc', label: t.hscOption },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeExamLevel(item.id)}
                      aria-pressed={examLevel === item.id}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        examLevel === item.id
                          ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                          : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Group */}
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t.groupLabel}
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900 sm:grid sm:grid-cols-3">
                  {(['science', 'business', 'humanities'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onChangeGroup(g)}
                      aria-pressed={group === g}
                      className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        group === g
                          ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                          : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      {t.groups[g]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Subject Grades Table */}
          <section
            aria-labelledby="subjects-table-heading"
            className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-800"
          >
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2
                id="subjects-table-heading"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                {t.subjectsHeading}
              </h2>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                {t.subjectsSub}
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-700/80">
              {subjects.map((subject) => {
                const gp = gradeToGp(subject.grade);
                const isMainFailRow =
                  showResult && !subject.isFourthSubject && subject.grade === 'F';
                const displayName = lang === 'bn' ? subject.nameBn : subject.nameEn;

                const baseRole =
                  subject.category === 'compulsory' ? t.roleCompulsory : t.roleGroup;
                const roleLabel =
                  examLevel === 'hsc'
                    ? `${baseRole} · ${
                        subject.isTwoPaper ? t.twoPaperSuffix : t.singlePaperSuffix
                      }`
                    : baseRole;

                return (
                  <div
                    key={subject.id}
                    className={`flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between ${
                      isMainFailRow
                        ? 'bg-red-50/50 dark:bg-red-950/20'
                        : subject.isFourthSubject
                          ? 'bg-blue-50/40 dark:bg-blue-950/20'
                          : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      {subject.isFourthSubject ? (
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                            {examLevel === 'hsc'
                              ? `${t.roleFourth} · ${t.twoPaperSuffix}`
                              : t.roleFourth}
                          </div>
                          <div>
                            <label htmlFor="fourth-subject-select" className="sr-only">
                              {t.fourthSelectLabel}
                            </label>
                            <select
                              id="fourth-subject-select"
                              value={subject.id}
                              onChange={(e) => onChangeFourthSubjectOption(e.target.value)}
                              className="w-full max-w-xs rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-blue-600/60 dark:bg-slate-900 dark:text-white"
                            >
                              {fourthOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {lang === 'bn' ? opt.nameBn : opt.nameEn} ({opt.code})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-base font-semibold text-slate-900 dark:text-white">
                            {displayName} ({subject.code})
                          </div>
                          <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                            {roleLabel}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Grade Dropdown & GP */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div>
                        <label htmlFor={`grade-${subject.id}`} className="sr-only">
                          {`Grade for ${displayName}`}
                        </label>
                        <select
                          id={`grade-${subject.id}`}
                          value={subject.grade}
                          onChange={(e) =>
                            onUpdateSubjectGrade(subject.id, e.target.value as LetterGrade)
                          }
                          className={`min-h-[42px] w-36 rounded-lg border px-3 py-1.5 tabular-nums text-base font-bold focus:outline-none ${
                            subject.grade === 'F'
                              ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300'
                              : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-600 focus:bg-white dark:border-slate-600 dark:bg-slate-900 dark:text-white'
                          }`}
                        >
                          {LETTER_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g} ({gradeToGp(g).toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-14 text-right tabular-nums text-base font-bold text-slate-900 dark:text-white">
                        {gp.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Result Button + On-Demand GPA Result Panel */}
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700/80 dark:bg-slate-800">
            <button
              type="button"
              data-testid="calculate-gpa-btn"
              onClick={onCalculateResult}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Calculator className="h-5 w-5" aria-hidden="true" />
              <span>{t.calculateGpaBtn}</span>
            </button>

            {!showResult ? (
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.calculatePromptTitle}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.calculatePromptDesc}
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Revealed GPA Card */}
                <div
                  data-testid="gpa-result-panel"
                  className={`rounded-xl border p-5 ${
                    result.hasMainFail
                      ? 'border-red-200 bg-red-50 dark:border-red-500/40 dark:bg-slate-900/70'
                      : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {t.gpaWithFourth}
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                        {result.hasMainFail
                          ? t.failedStatus
                          : result.isGoldenAPlus
                            ? t.goldenBadge
                            : result.isStandardAPlus
                              ? t.standardAPlusBadge
                              : `Grade: ${result.finalLetterGrade}`}
                      </div>
                    </div>
                    <div
                      data-testid="gpa-with-fourth-value"
                      className={`tabular-nums text-5xl font-extrabold tracking-tight ${
                        result.hasMainFail
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {result.gpaWithFourth.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* GPA Without 4th */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {t.gpaWithoutFourth}
                      </div>
                      <div className="mt-0.5 tabular-nums text-sm font-medium text-slate-600 dark:text-slate-300">
                        Main subjects: {result.totalMainSubjects}
                      </div>
                    </div>
                    <div
                      data-testid="gpa-without-fourth-value"
                      className="tabular-nums text-3xl font-extrabold text-slate-900 dark:text-white"
                    >
                      {result.gpaWithoutFourth.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Fail Detection Alert */}
                {result.hasMainFail && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-200"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-bold">{t.failAlertTitle}</p>
                      <p className="mt-1 text-sm leading-relaxed">
                        {t.failAlertBody}{' '}
                        <span className="font-bold">
                          {result.failedSubjects
                            .map((s) => `${lang === 'bn' ? s.nameBn : s.nameEn} (${s.code})`)
                            .join(', ')}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {!result.hasMainFail && result.fourthSubjectFailed && (
                  <div
                    role="status"
                    className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-sm font-medium text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200"
                  >
                    {t.fourthFailNote}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
