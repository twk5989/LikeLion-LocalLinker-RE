//영문-> 한글 변환 매핑
const CATEGORY_KO: Record<string, string> = {
  ADMINISTRATION: '행정',
  MEDICAL: '의료',
  HOUSING: '주거',
  EMPLOYMENT: '취업/근로',
  EDUCATION: '교육',
  LIFE_SUPPORT: '생활 지원',
};

const TAG_KO: Record<'BENEFIT' | 'SYSTEM' | 'PROGRAM', string> = {
  BENEFIT: '혜택',
  SYSTEM: '제도',
  PROGRAM: '프로그램',
};