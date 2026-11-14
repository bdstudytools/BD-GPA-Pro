import { AlertTriangle, Calculator } from 'lucide-react';
import {
  FOURTH_SUBJECT_OPTIONS,
  LETTER_GRADES,
  UI_TEXT,
} from '../data/curriculum';
import {
  ExamLevel,
  GpaCalculationResult,
  InputMode,
  Language,
  LetterGrade,
  StudyGroup,
  SubjectEntry,
} from '../types/gpa';
import {
  evaluateSubject,
  gradeToGp,
  gpToLetterGrade,
  isValidMark,
} from '../utils/gpaCalculator';

interface CalculatorWorkspaceProps {
  lang: Language;
  examLevel: ExamLevel;
  onChangeExamLevel: (level: ExamLevel) => void;
  group: StudyGroup;
  onChangeGroup: (group: StudyGroup) => void;
  inputMode: InputMode;
  onChangeInputMode: (mode: InputMode) => void;
  subjects: SubjectEntry[];
  onUpdateSubjectGrade: (id: string, grade: LetterGrade) => void;
  onUpdateSubjectMarks: (id: string, marks: number | null) => void;
  onUpdateSubjectPaperMarks: (
    id: string,
    paper: 'paper1' | 'paper2',
    marks: number | null
  ) => void;
  onChangeFourthSubjectOption: (optionId: string) => void;
  result: GpaCalculationResult;
  showResult: boolean;
  onCalculateResult: () => void;
}

const POINT_OPTIONS: number[] = [5.0, 4.0, 3.5, 3.0, 2.0, 1.0, 0.0];

export function CalculatorWorkspace({
  lang,
  examLevel,
  onChangeExamLevel,
  group,
  onChangeGroup,
  inputMode,
  onChangeInputMode,
  subjects,
  onUpdateSubjectGrade,
  onUpdateSubjectMarks,
  onUpdateSubjectPaperMarks,
  onChangeFourthSubjectOption,
  result,
  showResult,
  onCalculateResult,
}: CalculatorWorkspaceProps) {
  const t = UI_TEXT[lang];
  const fourthOptions = FOURTH_SUBJECT_OPTIONS[examLevel][group];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl text-balance">
          {t.heroTitle}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Clean 2-Column Calculator Workspace */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Unified Exam Configuration + Subject Table */}
        <div className="space-y-5 lg:col-span-7">
          {/* Unified Configuration Card */}
          <section
            aria-label="Exam Configuration"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5"
          >
            {/* Exam Level */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.examLevelLabel}
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
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
                    className={`min-h-[42px] rounded-lg border px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                      examLevel === item.id
                        ? 'border-sky-600 bg-sky-600 font-bold text-white shadow-xs'
                        : 'border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Study Group */}
            <div className="border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.groupLabel}
              </span>
              <div className="mt-2 flex flex-wrap gap-2.5 sm:grid sm:grid-cols-3">
                {(['science', 'business', 'humanities'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onChangeGroup(g)}
                    aria-pressed={group === g}
                    className={`min-h-[42px] flex-1 rounded-lg border px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                      group === g
                        ? 'border-sky-600 bg-sky-600 font-bold text-white shadow-xs'
                        : 'border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {t.groups[g]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Format: Grade | Marks | Point */}
            <div className="border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.gradeFormatLabel}
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2.5 sm:flex sm:flex-wrap">
                {(
                  [
                    { id: 'grade', label: t.formatGrade },
                    { id: 'marks', label: t.formatMarks },
                    { id: 'point', label: t.formatPoint },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onChangeInputMode(mode.id)}
                    aria-pressed={inputMode === mode.id}
                    className={`min-h-[42px] sm:min-w-[96px] rounded-lg border px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                      inputMode === mode.id
                        ? 'border-sky-600 bg-sky-600 font-bold text-white shadow-xs'
                        : 'border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Subject Grades & Marks Table */}
          <section
            aria-labelledby="subjects-table-heading"
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"
          >
            <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
              <h2
                id="subjects-table-heading"
                className="text-base font-bold text-slate-900"
              >
                {t.subjectsHeading}
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {t.subjectsSub}
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {subjects.map((subject) => {
                const evalItem = evaluateSubject(subject, inputMode);
                const isInvalidRow = result.invalidSubjectIds.includes(subject.id);
                const isIncompleteRow = result.incompleteSubjectIds.includes(subject.id);
                const isMainFailRow =
                  showResult &&
                  !subject.isFourthSubject &&
                  !isIncompleteRow &&
                  evalItem.grade === 'F';
                const displayName = lang === 'bn' ? subject.nameBn : subject.nameEn;

                const baseRole =
                  subject.category === 'compulsory' ? t.roleCompulsory : t.roleGroup;
                const roleLabel =
                  examLevel === 'hsc'
                    ? `${baseRole} · ${
                        subject.isTwoPaper ? t.twoPaperSuffix : t.singlePaperSuffix
                      }`
                    : baseRole;

                const marksReady = subject.isTwoPaper
                  ? isValidMark(subject.paper1Marks) && isValidMark(subject.paper2Marks)
                  : isValidMark(subject.marks);

                return (
                  <div
                    key={subject.id}
                    className={`flex flex-col gap-3 px-5 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                      isMainFailRow || isInvalidRow
                        ? 'bg-red-50/60'
                        : subject.isFourthSubject
                          ? 'bg-sky-50/60'
                          : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      {subject.isFourthSubject ? (
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold tracking-wide text-sky-700">
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
                              className="w-full max-w-xs rounded-lg border border-sky-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
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
                          <div className="text-base font-semibold text-slate-900">
                            {displayName} ({subject.code})
                          </div>
                          <div className="mt-0.5 text-xs font-medium text-slate-500">
                            {roleLabel}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Input Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      {inputMode === 'grade' && (
                        <>
                          <div>
                            <label htmlFor={`grade-${subject.id}`} className="sr-only">
                              {`Grade for ${displayName}`}
                            </label>
                            <select
                              id={`grade-${subject.id}`}
                              value={subject.grade}
                              onChange={(e) =>
                                onUpdateSubjectGrade(
                                  subject.id,
                                  e.target.value as LetterGrade
                                )
                              }
                              className={`min-h-[42px] w-36 rounded-lg border px-3 py-1.5 tabular-nums text-sm font-bold focus:outline-none ${
                                subject.grade === 'F'
                                  ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500'
                                  : 'border-slate-300 bg-white text-slate-900 focus:border-sky-600'
                              }`}
                            >
                              {LETTER_GRADES.map((g) => (
                                <option key={g} value={g}>
                                  {g} ({gradeToGp(g).toFixed(2)})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-12 text-right tabular-nums text-base font-bold text-slate-900">
                            {evalItem.gp.toFixed(2)}
                          </div>
                        </>
                      )}

                      {inputMode === 'point' && (
                        <>
                          <div>
                            <label htmlFor={`point-${subject.id}`} className="sr-only">
                              {`Point for ${displayName}`}
                            </label>
                            <select
                              id={`point-${subject.id}`}
                              value={gradeToGp(subject.grade).toFixed(2)}
                              onChange={(e) =>
                                onUpdateSubjectGrade(
                                  subject.id,
                                  gpToLetterGrade(Number(e.target.value))
                                )
                              }
                              className={`min-h-[42px] w-32 rounded-lg border px-3 py-1.5 tabular-nums text-sm font-bold focus:outline-none ${
                                subject.grade === 'F'
                                  ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500'
                                  : 'border-slate-300 bg-white text-slate-900 focus:border-sky-600'
                              }`}
                            >
                              {POINT_OPTIONS.map((pt) => (
                                <option key={pt} value={pt.toFixed(2)}>
                                  {pt.toFixed(2)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div
                            className={`w-10 text-right tabular-nums text-base font-bold ${
                              subject.grade === 'F' ? 'text-red-600' : 'text-sky-700'
                            }`}
                          >
                            {subject.grade}
                          </div>
                        </>
                      )}

                      {inputMode === 'marks' && (
                        <div className="flex items-center gap-2">
                          {subject.isTwoPaper ? (
                            <div className="flex items-center gap-1.5">
                              <div>
                                <label
                                  htmlFor={`p1-${subject.id}`}
                                  className="sr-only"
                                >
                                  {`1st Paper marks for ${displayName}`}
                                </label>
                                <input
                                  id={`p1-${subject.id}`}
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={
                                    subject.paper1Marks === null ||
                                    subject.paper1Marks === undefined
                                      ? ''
                                      : subject.paper1Marks
                                  }
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    onUpdateSubjectPaperMarks(
                                      subject.id,
                                      'paper1',
                                      raw === '' ? null : Number(raw)
                                    );
                                  }}
                                  placeholder="1st"
                                  className={`min-h-[42px] w-[70px] rounded-lg border px-2 py-1.5 text-right tabular-nums text-sm font-bold focus:outline-none ${
                                    isInvalidRow
                                      ? 'border-red-500 bg-red-50 text-red-700'
                                      : 'border-slate-300 bg-white text-slate-900 focus:border-sky-600'
                                  }`}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-400">+</span>
                              <div>
                                <label
                                  htmlFor={`p2-${subject.id}`}
                                  className="sr-only"
                                >
                                  {`2nd Paper marks for ${displayName}`}
                                </label>
                                <input
                                  id={`p2-${subject.id}`}
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={
                                    subject.paper2Marks === null ||
                                    subject.paper2Marks === undefined
                                      ? ''
                                      : subject.paper2Marks
                                  }
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    onUpdateSubjectPaperMarks(
                                      subject.id,
                                      'paper2',
                                      raw === '' ? null : Number(raw)
                                    );
                                  }}
                                  placeholder="2nd"
                                  className={`min-h-[42px] w-[70px] rounded-lg border px-2 py-1.5 text-right tabular-nums text-sm font-bold focus:outline-none ${
                                    isInvalidRow
                                      ? 'border-red-500 bg-red-50 text-red-700'
                                      : 'border-slate-300 bg-white text-slate-900 focus:border-sky-600'
                                  }`}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label htmlFor={`marks-${subject.id}`} className="sr-only">
                                {`Marks for ${displayName}`}
                              </label>
                              <input
                                id={`marks-${subject.id}`}
                                type="number"
                                min={0}
                                max={100}
                                value={subject.marks === null ? '' : subject.marks}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  onUpdateSubjectMarks(
                                    subject.id,
                                    raw === '' ? null : Number(raw)
                                  );
                                }}
                                placeholder="0–100"
                                className={`min-h-[42px] w-24 rounded-lg border px-3 py-1.5 text-right tabular-nums text-sm font-bold focus:outline-none ${
                                  isInvalidRow
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-slate-300 bg-white text-slate-900 focus:border-sky-600'
                                }`}
                              />
                            </div>
                          )}

                          <span
                            className={`w-8 text-center tabular-nums text-sm font-bold ${
                              !marksReady
                                ? 'text-slate-400'
                                : evalItem.grade === 'F'
                                  ? 'text-red-600'
                                  : 'text-sky-700'
                            }`}
                          >
                            {marksReady ? evalItem.grade : '--'}
                          </span>
                          <div className="w-11 text-right tabular-nums text-base font-bold text-slate-900">
                            {marksReady ? evalItem.gp.toFixed(2) : '--'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Primary Action + Crisp Editorial Result Panel */}
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <button
              type="button"
              data-testid="calculate-gpa-btn"
              onClick={onCalculateResult}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-base font-bold text-white shadow-xs transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Calculator className="h-5 w-5" aria-hidden="true" />
              <span>{t.calculateGpaBtn}</span>
            </button>

            {!showResult ? (
              <div className="border-t border-slate-100 pt-5 text-center">
                <h2 className="text-base font-bold text-slate-900">
                  {t.calculatePromptTitle}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {t.calculatePromptDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-4 border-t border-slate-100 pt-5">
                {inputMode === 'marks' && result.hasInvalidMarks && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700"
                  >
                    {t.invalidMarksNotice}
                  </div>
                )}

                {inputMode === 'marks' &&
                  !result.hasInvalidMarks &&
                  result.hasIncompleteMarks && (
                    <div
                      role="status"
                      className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm font-semibold text-amber-800"
                    >
                      {t.incompleteMarksNotice}
                    </div>
                  )}

                {/* Revealed Hero GPA Card */}
                <div
                  data-testid="gpa-result-panel"
                  className={`rounded-xl p-5 ${
                    result.hasMainFail
                      ? 'border border-red-200 bg-red-50 text-red-900'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          result.hasMainFail ? 'text-red-800' : 'text-slate-300'
                        }`}
                      >
                        {t.gpaWithFourth}
                      </div>
                      <div
                        className={`mt-1 text-sm font-bold ${
                          result.hasMainFail ? 'text-red-700' : 'text-sky-400'
                        }`}
                      >
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
                        result.hasMainFail ? 'text-red-600' : 'text-white'
                      }`}
                    >
                      {result.gpaWithFourth.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* GPA Without 4th */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      {t.gpaWithoutFourth}
                    </div>
                    <div className="mt-0.5 tabular-nums text-xs font-medium text-slate-500">
                      Main subjects: {result.totalMainSubjects}
                    </div>
                  </div>
                  <div
                    data-testid="gpa-without-fourth-value"
                    className="tabular-nums text-3xl font-extrabold text-slate-900"
                  >
                    {result.gpaWithoutFourth.toFixed(2)}
                  </div>
                </div>

                {/* Fail Detection Alert */}
                {result.hasMainFail && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/90 p-4 text-sm text-red-900"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
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
                    className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-sm font-medium text-amber-900"
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
