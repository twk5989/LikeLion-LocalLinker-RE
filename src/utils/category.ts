import type { CategoryCode } from '../types/category';

// 백엔드 카테고리 정규화 (오탈자/대소문자 방지)
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
