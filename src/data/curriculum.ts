import {
  EducationBoard,
  ExamLevel,
  LetterGrade,
  StudyGroup,
  SubjectEntry,
} from '../types/gpa';

export interface BoardInfo {
  id: EducationBoard;
  nameEn: string;
  nameBn: string;
}

export const EDUCATION_BOARDS: BoardInfo[] = [
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'comilla', nameEn: 'Comilla', nameBn: 'কুমিল্লা' },
  { id: 'jessore', nameEn: 'Jessore', nameBn: 'যশোর' },
  { id: 'chittagong', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'barisal', nameEn: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর' },
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  { id: 'madrasah', nameEn: 'Madrasah', nameBn: 'মাদ্রাসা' },
  { id: 'technical', nameEn: 'Technical', nameBn: 'কারিগরি' },
];

export interface GradingScaleRow {
  interval: string;
  interval200: string;
  interval50: string;
  minMarks: number;
  maxMarks: number;
  grade: LetterGrade;
  gp: number;
  remarkEn: string;
  remarkBn: string;
}

export const GRADING_SCALE: GradingScaleRow[] = [
  {
    interval: '80 – 100',
    interval200: '160 – 200',
    interval50: '40 – 50',
    minMarks: 80,
    maxMarks: 100,
    grade: 'A+',
    gp: 5.0,
    remarkEn: 'Outstanding',
    remarkBn: 'অসাধারণ',
  },
  {
    interval: '70 – 79',
    interval200: '140 – 159',
    interval50: '35 – 39',
    minMarks: 70,
    maxMarks: 79,
    grade: 'A',
    gp: 4.0,
    remarkEn: 'Excellent',
    remarkBn: 'অতি উত্তম',
  },
  {
    interval: '60 – 69',
    interval200: '120 – 139',
    interval50: '30 – 34',
    minMarks: 60,
    maxMarks: 69,
    grade: 'A-',
    gp: 3.5,
    remarkEn: 'Very Good',
    remarkBn: 'উত্তম',
  },
  {
    interval: '50 – 59',
    interval200: '100 – 119',
    interval50: '25 – 29',
    minMarks: 50,
    maxMarks: 59,
    grade: 'B',
    gp: 3.0,
    remarkEn: 'Good',
    remarkBn: 'ভালো',
  },
  {
    interval: '40 – 49',
    interval200: '80 – 99',
    interval50: '20 – 24',
    minMarks: 40,
    maxMarks: 49,
    grade: 'C',
    gp: 2.0,
    remarkEn: 'Satisfactory',
    remarkBn: 'সন্তোষজনক',
  },
  {
    interval: '33 – 39',
    interval200: '66 – 79',
    interval50: '17 – 19',
    minMarks: 33,
    maxMarks: 39,
    grade: 'D',
    gp: 1.0,
    remarkEn: 'Pass',
    remarkBn: 'সাধারণ পাস',
  },
  {
    interval: '0 – 32',
    interval200: '0 – 65',
    interval50: '0 – 16',
    minMarks: 0,
    maxMarks: 32,
    grade: 'F',
    gp: 0.0,
    remarkEn: 'Fail',
    remarkBn: 'অকৃতকার্য',
  },
];

export const LETTER_GRADES: LetterGrade[] = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];

export interface FourthSubjectOption {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
}

export const FOURTH_SUBJECT_OPTIONS: Record<
  ExamLevel,
  Record<StudyGroup, FourthSubjectOption[]>
> = {
  ssc: {
    science: [
      { id: 'ssc-higher-math', code: '126', nameEn: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত' },
      { id: 'ssc-biology', code: '138', nameEn: 'Biology', nameBn: 'জীববিজ্ঞান' },
      { id: 'ssc-agri', code: '134', nameEn: 'Agricultural Studies', nameBn: 'কৃষি শিক্ষা' },
      { id: 'ssc-home-sci', code: '151', nameEn: 'Home Science', nameBn: 'গার্হস্থ্য বিজ্ঞান' },
    ],
    business: [
      { id: 'ssc-agri', code: '134', nameEn: 'Agricultural Studies', nameBn: 'কৃষি শিক্ষা' },
      { id: 'ssc-home-sci', code: '151', nameEn: 'Home Science', nameBn: 'গার্হস্থ্য বিজ্ঞান' },
      { id: 'ssc-music', code: '149', nameEn: 'Music', nameBn: 'সংগীত' },
    ],
    humanities: [
      { id: 'ssc-economics', code: '141', nameEn: 'Economics', nameBn: 'অর্থনীতি' },
      { id: 'ssc-agri', code: '134', nameEn: 'Agricultural Studies', nameBn: 'কৃষি শিক্ষা' },
      { id: 'ssc-home-sci', code: '151', nameEn: 'Home Science', nameBn: 'গার্হস্থ্য বিজ্ঞান' },
      { id: 'ssc-music', code: '149', nameEn: 'Music', nameBn: 'সংগীত' },
    ],
  },
  hsc: {
    science: [
      { id: 'hsc-higher-math', code: '265–266', nameEn: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত' },
      { id: 'hsc-biology', code: '178–179', nameEn: 'Biology', nameBn: 'জীববিজ্ঞান' },
      { id: 'hsc-statistics', code: '129–130', nameEn: 'Statistics', nameBn: 'পরিসংখ্যান' },
      { id: 'hsc-agri', code: '239–240', nameEn: 'Agriculture Studies', nameBn: 'কৃষিশিক্ষা' },
      { id: 'hsc-psychology', code: '123–124', nameEn: 'Psychology', nameBn: 'মনোবিজ্ঞান' },
    ],
    business: [
      { id: 'hsc-statistics', code: '129–130', nameEn: 'Statistics', nameBn: 'পরিসংখ্যান' },
      { id: 'hsc-economics', code: '109–110', nameEn: 'Economics', nameBn: 'অর্থনীতি' },
      { id: 'hsc-agri', code: '239–240', nameEn: 'Agriculture Studies', nameBn: 'কৃষিশিক্ষা' },
      { id: 'hsc-geography', code: '125–126', nameEn: 'Geography', nameBn: 'ভূগোল' },
      { id: 'hsc-marketing', code: '286–287', nameEn: 'Production Management & Marketing', nameBn: 'উৎপাদন ব্যবস্থাপনা ও বিপণন' },
      { id: 'hsc-accounting', code: '253–254', nameEn: 'Accounting', nameBn: 'হিসাববিজ্ঞান' },
      { id: 'hsc-finance', code: '292–293', nameEn: 'Finance, Banking & Insurance', nameBn: 'ফিন্যান্স, ব্যাংকিং ও বিমা' },
      { id: 'hsc-management', code: '277–278', nameEn: 'Business Organization & Management', nameBn: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা' },
    ],
    humanities: [
      { id: 'hsc-logic', code: '121–122', nameEn: 'Logic', nameBn: 'যুক্তিবিদ্যা' },
      { id: 'hsc-history', code: '304–305', nameEn: 'History', nameBn: 'ইতিহাস' },
      { id: 'hsc-civics', code: '269–270', nameEn: 'Civics & Good Governance', nameBn: 'পৌরনীতি ও সুশাসন' },
      { id: 'hsc-economics', code: '109–110', nameEn: 'Economics', nameBn: 'অর্থনীতি' },
      { id: 'hsc-geography', code: '125–126', nameEn: 'Geography', nameBn: 'ভূগোল' },
      { id: 'hsc-sociology', code: '117–118', nameEn: 'Sociology', nameBn: 'সমাজবিজ্ঞান' },
      { id: 'hsc-social-work', code: '271–272', nameEn: 'Social Work', nameBn: 'সমাজকর্ম' },
      { id: 'hsc-islamic-history', code: '267–268', nameEn: 'Islamic History & Culture', nameBn: 'ইসলামের ইতিহাস ও সংস্কৃতি' },
      { id: 'hsc-islamic-studies', code: '249–250', nameEn: 'Islamic Studies', nameBn: 'ইসলাম শিক্ষা' },
      { id: 'hsc-psychology', code: '123–124', nameEn: 'Psychology', nameBn: 'মনোবিজ্ঞান' },
      { id: 'hsc-agri', code: '239–240', nameEn: 'Agriculture Studies', nameBn: 'কৃষিশিক্ষা' },
      { id: 'hsc-statistics', code: '129–130', nameEn: 'Statistics', nameBn: 'পরিসংখ্যান' },
    ],
  },
};

interface SubjectTemplate {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  category: 'compulsory' | 'group' | 'fourth';
  isTwoPaper?: boolean;
  maxMarks?: 50 | 100 | 200;
  defaultGrade: LetterGrade;
  defaultMarks: number;
}

const SSC_COMPULSORY_GENERAL: SubjectTemplate[] = [
  {
    id: 'ssc-bangla',
    code: '101–102',
    nameEn: 'Bangla',
    nameBn: 'বাংলা',
    category: 'compulsory',
    isTwoPaper: true,
    maxMarks: 200,
    defaultGrade: 'A+',
    defaultMarks: 84,
  },
  {
    id: 'ssc-english',
    code: '107–108',
    nameEn: 'English',
    nameBn: 'ইংরেজি',
    category: 'compulsory',
    isTwoPaper: true,
    maxMarks: 200,
    defaultGrade: 'A',
    defaultMarks: 76,
  },
  {
    id: 'ssc-math',
    code: '109',
    nameEn: 'Mathematics',
    nameBn: 'গণিত',
    category: 'compulsory',
    maxMarks: 100,
    defaultGrade: 'A+',
    defaultMarks: 88,
  },
  {
    id: 'ssc-ict',
    code: '154',
    nameEn: 'Information & Communication Technology',
    nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    category: 'compulsory',
    maxMarks: 50,
    defaultGrade: 'A+',
    defaultMarks: 43,
  },
  {
    id: 'ssc-religion',
    code: '111',
    nameEn: 'Religion & Moral Education',
    nameBn: 'ধর্ম ও নৈতিক শিক্ষা',
    category: 'compulsory',
    defaultGrade: 'A+',
    defaultMarks: 83,
  },
];

const SSC_BGS: SubjectTemplate = {
  id: 'ssc-bgs',
  code: '150',
  nameEn: 'Bangladesh & Global Studies',
  nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়',
  category: 'compulsory',
  defaultGrade: 'A',
  defaultMarks: 75,
};

const SSC_GENERAL_SCIENCE: SubjectTemplate = {
  id: 'ssc-gen-sci',
  code: '127',
  nameEn: 'General Science',
  nameBn: 'সাধারণ বিজ্ঞান',
  category: 'compulsory',
  defaultGrade: 'A',
  defaultMarks: 74,
};

const HSC_COMPULSORY_GENERAL: SubjectTemplate[] = [
  {
    id: 'hsc-bangla',
    code: '101–102',
    nameEn: 'Bangla',
    nameBn: 'বাংলা',
    category: 'compulsory',
    isTwoPaper: true,
    maxMarks: 200,
    defaultGrade: 'A+',
    defaultMarks: 82,
  },
  {
    id: 'hsc-english',
    code: '107–108',
    nameEn: 'English',
    nameBn: 'ইংরেজি',
    category: 'compulsory',
    isTwoPaper: true,
    maxMarks: 200,
    defaultGrade: 'A',
    defaultMarks: 75,
  },
  {
    id: 'hsc-ict',
    code: '275',
    nameEn: 'Information & Communication Technology',
    nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    category: 'compulsory',
    isTwoPaper: false,
    maxMarks: 100,
    defaultGrade: 'A+',
    defaultMarks: 86,
  },
];

const SSC_GROUP_SUBJECTS: Record<StudyGroup, SubjectTemplate[]> = {
  science: [
    {
      id: 'ssc-physics',
      code: '136',
      nameEn: 'Physics',
      nameBn: 'পদার্থবিজ্ঞান',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 87,
    },
    {
      id: 'ssc-chemistry',
      code: '137',
      nameEn: 'Chemistry',
      nameBn: 'রসায়ন',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 84,
    },
    {
      id: 'ssc-biology',
      code: '138',
      nameEn: 'Biology',
      nameBn: 'জীববিজ্ঞান',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 82,
    },
    {
      id: 'ssc-higher-math',
      code: '126',
      nameEn: 'Higher Mathematics',
      nameBn: 'উচ্চতর গণিত',
      category: 'fourth',
      defaultGrade: 'A+',
      defaultMarks: 85,
    },
  ],
  business: [
    {
      id: 'ssc-accounting',
      code: '146',
      nameEn: 'Accounting',
      nameBn: 'হিসাববিজ্ঞান',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 86,
    },
    {
      id: 'ssc-finance',
      code: '152',
      nameEn: 'Finance & Banking',
      nameBn: 'ফিন্যান্স ও ব্যাংকিং',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 82,
    },
    {
      id: 'ssc-business-ent',
      code: '143',
      nameEn: 'Business Entrepreneurship',
      nameBn: 'ব্যবসায় উদ্যোগ',
      category: 'group',
      defaultGrade: 'A',
      defaultMarks: 77,
    },
    {
      id: 'ssc-agri',
      code: '134',
      nameEn: 'Agricultural Studies',
      nameBn: 'কৃষি শিক্ষা',
      category: 'fourth',
      defaultGrade: 'A+',
      defaultMarks: 85,
    },
  ],
  humanities: [
    {
      id: 'ssc-history',
      code: '153',
      nameEn: 'History of Bangladesh & World Civilization',
      nameBn: 'বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা',
      category: 'group',
      defaultGrade: 'A',
      defaultMarks: 76,
    },
    {
      id: 'ssc-geography',
      code: '110',
      nameEn: 'Geography & Environment',
      nameBn: 'ভূগোল ও পরিবেশ',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 81,
    },
    {
      id: 'ssc-civics',
      code: '140',
      nameEn: 'Civics & Citizenship',
      nameBn: 'পৌরনীতি ও নাগরিকতা',
      category: 'group',
      defaultGrade: 'A+',
      defaultMarks: 83,
    },
    {
      id: 'ssc-economics',
      code: '141',
      nameEn: 'Economics',
      nameBn: 'অর্থনীতি',
      category: 'fourth',
      defaultGrade: 'A+',
      defaultMarks: 86,
    },
  ],
};

const HSC_GROUP_SUBJECTS: Record<StudyGroup, SubjectTemplate[]> = {
  science: [
    {
      id: 'hsc-physics',
      code: '174–175',
      nameEn: 'Physics',
      nameBn: 'পদার্থবিজ্ঞান',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 85,
    },
    {
      id: 'hsc-chemistry',
      code: '176–177',
      nameEn: 'Chemistry',
      nameBn: 'রসায়ন',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 83,
    },
    {
      id: 'hsc-biology',
      code: '178–179',
      nameEn: 'Biology',
      nameBn: 'জীববিজ্ঞান',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 82,
    },
    {
      id: 'hsc-higher-math',
      code: '265–266',
      nameEn: 'Higher Mathematics',
      nameBn: 'উচ্চতর গণিত',
      category: 'fourth',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 86,
    },
  ],
  business: [
    {
      id: 'hsc-accounting',
      code: '253–254',
      nameEn: 'Accounting',
      nameBn: 'হিসাববিজ্ঞান',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 85,
    },
    {
      id: 'hsc-management',
      code: '277–278',
      nameEn: 'Business Organization & Management',
      nameBn: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A',
      defaultMarks: 77,
    },
    {
      id: 'hsc-finance',
      code: '292–293',
      nameEn: 'Finance, Banking & Insurance',
      nameBn: 'ফিন্যান্স, ব্যাংকিং ও বিমা',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 81,
    },
    {
      id: 'hsc-statistics',
      code: '129–130',
      nameEn: 'Statistics',
      nameBn: 'পরিসংখ্যান',
      category: 'fourth',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 84,
    },
  ],
  humanities: [
    {
      id: 'hsc-economics',
      code: '109–110',
      nameEn: 'Economics',
      nameBn: 'অর্থনীতি',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A',
      defaultMarks: 76,
    },
    {
      id: 'hsc-civics',
      code: '269–270',
      nameEn: 'Civics & Good Governance',
      nameBn: 'পৌরনীতি ও সুশাসন',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 82,
    },
    {
      id: 'hsc-islamic-history',
      code: '267–268',
      nameEn: 'Islamic History & Culture',
      nameBn: 'ইসলামের ইতিহাস ও সংস্কৃতি',
      category: 'group',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 81,
    },
    {
      id: 'hsc-logic',
      code: '121–122',
      nameEn: 'Logic',
      nameBn: 'যুক্তিবিদ্যা',
      category: 'fourth',
      isTwoPaper: true,
      defaultGrade: 'A+',
      defaultMarks: 84,
    },
  ],
};

export function getSubjectsForConfig(
  examLevel: ExamLevel,
  group: StudyGroup
): SubjectEntry[] {
  let templates: SubjectTemplate[] = [];

  if (examLevel === 'ssc') {
    const middleCompulsory = group === 'science' ? [SSC_BGS] : [SSC_GENERAL_SCIENCE];
    templates = [
      ...SSC_COMPULSORY_GENERAL,
      ...middleCompulsory,
      ...SSC_GROUP_SUBJECTS[group],
    ];
  } else {
    templates = [...HSC_COMPULSORY_GENERAL, ...HSC_GROUP_SUBJECTS[group]];
  }

  return templates.map((item) => ({
    id: item.id,
    code: item.code,
    nameEn: item.nameEn,
    nameBn: item.nameBn,
    category: item.category,
    isFourthSubject: item.category === 'fourth',
    isTwoPaper: item.isTwoPaper,
    maxMarks: item.maxMarks ?? (item.isTwoPaper ? 200 : 100),
    grade: item.defaultGrade,
    marks: item.defaultMarks,
    paper1Marks: item.isTwoPaper ? item.defaultMarks : undefined,
    paper2Marks: item.isTwoPaper ? item.defaultMarks : undefined,
  }));
}

export const UI_TEXT = {
  en: {
    brandName: 'BD GPA Pro',
    navCalculator: 'GPA Calculator',
    navRules: '4th Subject Rules',
    primaryCta: 'Reset Defaults',
    heroTitle: 'SSC & HSC GPA Calculator',
    heroSubtitle:
      'Calculate your official Bangladesh Education Board GPA with accurate 4th subject calculation.',
    examLevelLabel: 'Exam Level',
    sscOption: 'SSC',
    hscOption: 'HSC',
    groupLabel: 'Group',
    groups: {
      science: 'Science',
      business: 'Business Studies',
      humanities: 'Humanities',
    },
    boardLabel: 'Education Board',
    gradeFormatLabel: 'Grade Format',
    formatGrade: 'Grade',
    formatMarks: 'Marks',
    formatPoint: 'Point',
    subjectsHeading: 'Subject Grades & Marks',
    subjectsSub:
      'Choose Grade, Marks, or Point format above and select your 4th subject from the dropdown.',
    roleCompulsory: 'Compulsory',
    roleGroup: 'Main Group',
    roleFourth: '4th Subject',
    twoPaperSuffix: '1st & 2nd Paper (200 Marks)',
    singlePaperSuffix: '100 Marks',
    fiftyMarksSuffix: '50 Marks',
    fourthSelectLabel: 'Select 4th Subject',
    gpaWithFourth: 'GPA (With 4th Subject)',
    gpaWithoutFourth: 'GPA (Without 4th)',
    calculateGpaBtn: 'Calculate GPA',
    calculatePromptTitle: 'Ready to Calculate',
    calculatePromptDesc:
      'Set your grades, marks, or points on the left, then click "Calculate GPA" to see your result.',
    goldenBadge: 'Golden A+ Achieved',
    standardAPlusBadge: 'A+ Achieved',
    failedStatus: 'Failed (F / GPA 0.00)',
    failAlertTitle: 'Failing Grade Detected in Main Subject(s)',
    failAlertBody:
      'Under Bangladesh Education Board rules, an F in any compulsory or main group subject results in overall GPA 0.00. Need improvement in:',
    fourthFailNote:
      'Your 4th subject has F (0.00). Per board rules, it adds +0.00 bonus without failing your overall result.',
    invalidMarksNotice:
      'Please enter valid marks within each subject full marks (0–50 for SSC ICT, 0–100 per paper for others).',
    incompleteMarksNotice: 'Enter marks for all subjects to calculate GPA.',
    rulesHeading: 'Official Bangladesh Education Board Grading Scale',
    rulesSub:
      'Standard NCTB grading thresholds for 100-mark, 200-mark (1st & 2nd Paper), and 50-mark (SSC ICT) subjects in SSC and HSC.',
    fourthRuleHeading: 'How 4th Subject (Optional Subject) Bonus Works',
    colInterval: '100 Marks',
    colInterval200: '200 Marks (1st + 2nd)',
    colInterval50: '50 Marks (SSC ICT)',
    colLetter: 'Letter Grade',
    colPoint: 'Grade Point',
    colAssessment: 'Assessment',
  },
  bn: {
    brandName: 'BD GPA Pro',
    navCalculator: 'জিপিএ ক্যালকুলেটর',
    navRules: 'চতুর্থ বিষয়ের নিয়ম',
    primaryCta: 'রিসেট করুন',
    heroTitle: 'এসএসসি ও এইচএসসি জিপিএ ক্যালকুলেটর',
    heroSubtitle:
      'সঠিক চতুর্থ বিষয়ের বোনাস পয়েন্টসহ বাংলাদেশ শিক্ষা বোর্ডের অফিসিয়াল জিপিএ হিসাব করুন।',
    examLevelLabel: 'পরীক্ষার স্তর',
    sscOption: 'এসএসসি',
    hscOption: 'এইচএসসি',
    groupLabel: 'বিভাগ',
    groups: {
      science: 'বিজ্ঞান',
      business: 'ব্যবসায় শিক্ষা',
      humanities: 'মানবিক',
    },
    boardLabel: 'শিক্ষা বোর্ড',
    gradeFormatLabel: 'গ্রেড ফরম্যাট',
    formatGrade: 'গ্রেড',
    formatMarks: 'নম্বর',
    formatPoint: 'পয়েন্ট',
    subjectsHeading: 'বিষয়ভিত্তিক গ্রেড ও নম্বর',
    subjectsSub:
      'উপর থেকে গ্রেড, নম্বর বা পয়েন্ট ফরম্যাট বেছে নিন এবং ড্রপডাউন থেকে ৪র্থ বিষয় নির্বাচন করুন।',
    roleCompulsory: 'আবশ্যিক',
    roleGroup: 'মূল বিষয়',
    roleFourth: '৪র্থ বিষয়',
    twoPaperSuffix: '১ম ও ২য় পত্র (২০০ নম্বর)',
    singlePaperSuffix: '১০০ নম্বর',
    fiftyMarksSuffix: '৫০ নম্বর',
    fourthSelectLabel: '৪র্থ বিষয় নির্বাচন করুন',
    gpaWithFourth: 'চূড়ান্ত জিপিএ (৪র্থ বিষয়সহ)',
    gpaWithoutFourth: 'জিপিএ (৪র্থ বিষয় ছাড়া)',
    calculateGpaBtn: 'ফলাফল দেখুন',
    calculatePromptTitle: 'জিপিএ হিসাব করতে প্রস্তুত',
    calculatePromptDesc:
      'বাম পাশে বিষয়গুলোর গ্রেড, নম্বর বা পয়েন্ট দিয়ে "ফলাফল দেখুন" বাটনে ক্লিক করুন।',
    goldenBadge: 'গোল্ডেন A+ অর্জিত',
    standardAPlusBadge: 'A+ অর্জিত',
    failedStatus: 'অকৃতকার্য (F / GPA 0.00)',
    failAlertTitle: 'মূল বিষয়ে অকৃতকার্য (F) শনাক্ত হয়েছে',
    failAlertBody:
      'বাংলাদেশ শিক্ষা বোর্ডের নিয়মানুযায়ী, যেকোনো আবশ্যিক বা মূল বিষয়ে F পেলে মোট জিপিএ ০.০০ হয়। উন্নতি প্রয়োজন:',
    fourthFailNote:
      'আপনার ৪র্থ বিষয়ে F (০.০০) এসেছে। বোর্ডের নিয়মে এটি বোনাস হিসেবে ০.০০ যোগ করবে এবং মূল ফলাফলে ফেল হবে না।',
    invalidMarksNotice:
      'লাল চিহ্নিত বিষয়ে নির্ধারিত পূর্ণমানের মধ্যে সঠিক নম্বর দিন (এসএসসি আইসিটি ০–৫০, অন্য বিষয়ে প্রতি পত্রে ০–১০০)।',
    incompleteMarksNotice: 'সঠিক জিপিএ হিসাবের জন্য সব বিষয়ের নম্বর দিন।',
    rulesHeading: 'বাংলাদেশ শিক্ষা বোর্ডের অফিসিয়াল গ্রেডিং স্কেল',
    rulesSub:
      'এসএসসি ও এইচএসসি পরীক্ষার ১০০, ২০০ (১ম ও ২য় পত্র) এবং ৫০ নম্বরের (এসএসসি আইসিটি) বিষয়ের অফিসিয়াল গ্রেডিং পদ্ধতি।',
    fourthRuleHeading: 'চতুর্থ বিষয়ের (ঐচ্ছিক বিষয়) বোনাস পয়েন্টের নিয়ম',
    colInterval: '১০০ নম্বর',
    colInterval200: '২০০ নম্বর (১ম + ২য়)',
    colInterval50: '৫০ নম্বর (এসএসসি আইসিটি)',
    colLetter: 'লেটার গ্রেড',
    colPoint: 'গ্রেড পয়েন্ট',
    colAssessment: 'মূল্যায়ন',
  },
} as const;
