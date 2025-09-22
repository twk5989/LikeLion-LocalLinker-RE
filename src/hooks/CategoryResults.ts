// src/hooks/useCategoryResults.ts
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { Notice } from '../types/notices';
import type { CategoryCode } from '../types/category';
import { qs } from '../utils/query';
import { CATEGORY_LABELS } from '../types/category'; // 코드→한글 라벨 맵

type Params = {
  cat: CategoryCode;
  page?: number;
  size?: number;
  visa?: string;
  married?: boolean; // UI-only
};

async function fetchCategory(base: { category: CategoryCode; page: number; size: number; visa?: string }) {
  const url = `/api/postings/category?${qs(base)}`;
  const res = await mockOrApiGet<Notice[]>(url);
  return Array.isArray(res) ? res : [];
}

export function useCategoryResults(params: Params) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const base = {
          category: params.cat,
          page: params.page ?? 0,
          size: params.size ?? 50,
          visa: params.visa,
        };

        const got = await fetchCategory(base);

        // 목업이 이미 해당 카테고리만 리턴한다면 아래 필터는 사실상 no-op.
        // 혹시 모를 안전장치로 한글 라벨 비교 필터 추가:
        const expectedLabel = CATEGORY_LABELS[params.cat];
        const finalItems = got.filter((n) => n.category === expectedLabel);

        if (!cancelled) setList(finalItems);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? String(e));
          setList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.cat, params.page, params.size, params.visa]);

  return { list, loading, error };
}
