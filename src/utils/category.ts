import type { CategoryCode } from '../types/category';
//CategoryCode는 프로젝트 내에서 내가 정의한 타입임.

// 백엔드에서 카테고리 오타 및 대소문자 오류가 있어서 정규화 시키려고 만든 코드임(useCategoryResults)
export function normalizeCategory(x: unknown): CategoryCode | null {
  const up = String(x ?? '').toUpperCase().trim();
  const fixed = up === 'ADMINSTRATION' ? 'ADMINISTRATION' : up;

  const allowed: Record<string, CategoryCode> = {
    ADMINISTRATION: 'ADMINISTRATION',
    MEDICAL: 'MEDICAL',
    HOUSING: 'HOUSING',
    EMPLOYMENT: 'EMPLOYMENT',
    EDUCATION: 'EDUCATION',
    LIFE_SUPPORT: 'LIFE_SUPPORT',
  };

  return allowed[fixed] ?? null;
}
