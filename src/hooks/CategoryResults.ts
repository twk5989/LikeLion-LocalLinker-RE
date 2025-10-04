// src/hooks/useCategoryResults.ts  (교체본)
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { BackendNotice } from '../types/notices';
import type { CategoryCode } from '../types/category';

type Params = {
  cat: CategoryCode;
  page?: number;
  size?: number;
  visa?: string | null;
  nationality?: string | null;
};

export function useCategoryResults({
  cat,
  page = 0,
  size = 50,
  visa = null,
  nationality = null,
}: Params) {
  const [list, setList] = React.useState<BackendNotice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let dead = false;
    setLoading(true);

    // ⬇️ 쿼리스트링 붙이지 말고 params로 전달!
    const params = {
      category: cat,                     // ✅ mockOrApiGet에서 읽음
      page,
      size,
      // null은 파라미터에서 빠지는 게 깔끔하므로 undefined로 정리
      visa: visa ?? undefined,
      nationality: nationality ?? undefined,
    };

    mockOrApiGet<BackendNotice[] | { content: BackendNotice[] }>(
      '/api/postings/category',
      { params },
    )
      .then((res) => {
        if (dead) return;
        setList(Array.isArray(res) ? res : (res?.content ?? []));
      })
      .catch((e) => !dead && setError(String(e?.message ?? e)))
      .finally(() => !dead && setLoading(false));

    return () => { dead = true; };
  }, [cat, page, size, visa, nationality]);

  return { list, total: list.length, loading, error };
}
