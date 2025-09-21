//카테고리/다국어 수집기가 필요 할 때에만 사용하는 헬퍼
//정렬,포맷,쿼리 유틸은 utyils에 단일화 되어있음
//쉽게 정리하면 백엔드에서 받아온 카테고리별 데이터를 카테고리 상관없이 그냥 싹 다 합친다는거임

import { mockOrApiGet } from '../apis';
import { CATEGORY_ORDER } from '../constants/categories';
import { NATIONALITIES } from '../constants/onboardingOptions';
import { qs, unpackArray } from '../utils/query';
import type { BackendNotice } from '../types/notices';
import type { CategoryCode } from '../types/category';

const LANGS = NATIONALITIES.map(n => n.value);

export async function collectCategoryAll(
  cat: CategoryCode,
  pageSize: number,
  maxPages: number,
  visa?: string,
) {
  const byId = new Map<number, BackendNotice>();
  for (const lang of LANGS) {
    for (let page = 0; page < maxPages; page++) {
      const url = `/api/postings/category?${qs({ category: cat, size: pageSize, page, language: lang, visa })}`;
      let res: any;
      try { res = await mockOrApiGet(url); } catch { break; }
      const items = unpackArray(res) as BackendNotice[];
      if (!items.length) break;
      items.forEach(n => byId.set(n.id, n));
      if (res?.hasNext === false) break;
      if (typeof res?.totalPages === 'number' && page + 1 >= res.totalPages) break;
    }
  }
  return Array.from(byId.values());
}

export async function collectAllCategories(pageSize: number, maxPages: number, visa?: string) {
  const byId = new Map<number, BackendNotice>();
  for (const cat of CATEGORY_ORDER) {
    const chunk = await collectCategoryAll(cat, pageSize, maxPages, visa);
    chunk.forEach(n => byId.set(n.id, n));
  }
  return Array.from(byId.values());
}
