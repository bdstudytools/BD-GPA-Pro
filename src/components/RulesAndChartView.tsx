import { useState } from 'react';
import { GRADING_SCALE, UI_TEXT } from '../data/curriculum';
import { Language } from '../types/gpa';
import { roundToTwo } from '../utils/gpaCalculator';

interface RulesAndChartViewProps {
  lang: Language;
}

export function RulesAndChartView({ lang }: RulesAndChartViewProps) {
  const t = UI_TEXT[lang];
  const [sampleFourthGp, setSampleFourthGp] = useState<number>(5.0);
  const sampleMainAvg = 4.67;
  const sampleMainCount = 6;
  const sampleMainSum = 28.0;
  const sampleBonus = Math.max(0, sampleFourthGp - 2.0);
  const sampleFinalGpa = Math.min(5.0, roundToTwo((sampleMainSum + sampleBonus) / sampleMainCount));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl text-balance">
          {t.rulesHeading}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          {t.rulesSub}
        </p>
      </div>

      {/* Grading Scale Table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-sm font-bold text-slate-700">
              <tr>
                <th scope="col" className="px-6 py-4">{t.colInterval}</th>
                <th scope="col" className="px-6 py-4">{t.colLetter}</th>
                <th scope="col" className="px-6 py-4">{t.colPoint}</th>
                <th scope="col" className="px-6 py-4">{t.colAssessment}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {GRADING_SCALE.map((row) => (
                <tr
                  key={row.grade}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-6 py-3.5 tabular-nums font-bold text-slate-900">
                    {row.interval}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`tabular-nums text-lg font-extrabold ${
                        row.grade === 'F'
                          ? 'text-red-600'
                          : row.grade === 'A+'
                            ? 'text-sky-600'
                            : 'text-slate-900'
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 tabular-nums font-bold text-slate-900">
                    {row.gp.toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-slate-700">
                    {lang === 'bn' ? row.remarkBn : row.remarkEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4th Subject Bonus Point Explanation + Interactive Example */}
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <h2 className="text-xl font-bold text-slate-900 text-balance">
            {t.fourthRuleHeading}
          </h2>

          <div className="space-y-4 text-base leading-relaxed text-slate-700">
            <p>
              {lang === 'bn'
                ? 'বাংলাদেশ শিক্ষা বোর্ডের (এসএসসি, দাখিল, এইচএসসি ও আলিম) নিয়মানুযায়ী, ৪র্থ বিষয় বা ঐচ্ছিক বিষয়ের প্রাপ্ত গ্রেড পয়েন্ট থেকে ২.০০ বাদ দিয়ে অবশিষ্ট পয়েন্টকে বোনাস হিসেবে গণনা করা হয় এবং মূল বিষয়গুলোর মোট পয়েন্টের সাথে যোগ করে গড় নির্ণয় করা হয় (সর্বোচ্চ ৫.০০)।'
                : 'Under the Bangladesh Education Board (SSC, Dakhil, HSC & Alim) system, 2.00 points are deducted from your 4th (optional) subject Grade Point. Any remainder above 2.00 is added as a bonus to your main subjects sum and averaged over the number of main subjects (capped at 5.00).'}
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 tabular-nums text-sm font-bold text-sky-600">
                  01.
                </span>
                <span>
                  {lang === 'bn'
                    ? '৪র্থ বিষয়ে A+ (5.00) পেলে সর্বোচ্চ +3.00 বোনাস পাওয়া যায়; A (4.00) পেলে +2.00, A- (3.50) পেলে +1.50, B (3.00) পেলে +1.00 এবং C (2.00) বা তার কম পেলে 0.00 বোনাস যোগ হয়।'
                    : 'An A+ (5.00) in the 4th subject yields +3.00 bonus points; A (4.00) gives +2.00; A- (3.50) gives +1.50; B (3.00) gives +1.00; and C (2.00) or lower gives +0.00.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 tabular-nums text-sm font-bold text-sky-600">
                  02.
                </span>
                <span>
                  {lang === 'bn'
                    ? '৪র্থ বিষয়ে F (0.00) পেলে শিক্ষার্থী ফেল করে না — শুধু কোনো বোনাস পয়েন্ট যোগ হয় না।'
                    : 'An F (0.00) in the 4th subject does NOT fail the student — it simply contributes +0.00 bonus points.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 tabular-nums text-sm font-bold text-sky-600">
                  03.
                </span>
                <span>
                  {lang === 'bn'
                    ? 'সব আবশ্যিক ও মূল বিভাগীয় বিষয়ে A+ (5.00) পেলে তাকে "গোল্ডেন A+" বলা হয়, যেখানে ৪র্থ বিষয়ের বোনাস ছাড়াই জিপিএ 5.00 হয়।'
                    : 'Achieving A+ (5.00) in all main compulsory and group subjects without needing the 4th subject bonus is recognized as Golden A+.'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Bonus Example Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'লাইভ ৪র্থ বিষয় বোনাস উদাহরণ' : 'Interactive 4th Subject Example'}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600">
            {lang === 'bn'
              ? 'ধরুন আপনার 6টি মূল বিষয়ের মোট পয়েন্ট 28.00 (গড় জিপিএ 4.67)। ৪র্থ বিষয়ের গ্রেড পরিবর্তন করে দেখুন:'
              : 'Suppose 6 main subjects total 28.00 points (base GPA 4.67). Change the 4th subject grade below:'}
          </p>

          <div className="mt-5">
            <label
              htmlFor="sample-fourth-grade"
              className="block text-sm font-semibold text-slate-800"
            >
              {lang === 'bn' ? '৪র্থ বিষয়ের গ্রেড নির্বাচন করুন' : 'Select 4th Subject Grade'}
            </label>
            <div
              id="sample-fourth-grade"
              className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4"
            >
              {[
                { label: 'A+ (5.0)', gp: 5.0 },
                { label: 'A (4.0)', gp: 4.0 },
                { label: 'A- (3.5)', gp: 3.5 },
                { label: 'B (3.0)', gp: 3.0 },
                { label: 'C (2.0)', gp: 2.0 },
                { label: 'D (1.0)', gp: 1.0 },
                { label: 'F (0.0)', gp: 0.0 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSampleFourthGp(opt.gp)}
                  className={`rounded-lg border px-2 py-2 tabular-nums text-xs font-bold transition-colors whitespace-nowrap ${
                    sampleFourthGp === opt.gp
                      ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-base">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">
                {lang === 'bn' ? 'মূল বিষয়ের গড় জিপিএ' : 'Base GPA (Without 4th)'}
              </span>
              <span className="tabular-nums font-bold text-slate-900">
                {sampleMainAvg.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">
                {lang === 'bn' ? '৪র্থ বিষয়ের বোনাস' : '4th Subject Bonus'}
              </span>
              <span className="tabular-nums font-bold text-sky-600">
                +{sampleBonus.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-900">
                {lang === 'bn' ? 'চূড়ান্ত জিপিএ' : 'Final GPA'}
              </span>
              <span className="tabular-nums text-2xl font-extrabold text-slate-900">
                {sampleFinalGpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
