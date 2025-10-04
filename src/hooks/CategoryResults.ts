// src/hooks/useCategoryResults.ts (초미니멀)
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import { qs } from '../utils/query';
import type { BackendNotice } from '../types/notices';
import type { CategoryCode } from '../types/category';

type Params = {
  cat: CategoryCode;
  page?: number;
  size?: number;
  visa?: string | null;
  nationality?: string | null;
};

export function useCategoryResults({ cat, page = 0, size = 50, visa = null, nationality = null }: Params) {
  const [list, setList] = React.useState<BackendNotice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let dead = false;
    setLoading(true);

    const url = `/api/postings/category?` + qs({ category: cat, page, size, visa, nationality });

    mockOrApiGet<BackendNotice[] | { content: BackendNotice[] }>(url)
      .then((res) => !dead && setList(Array.isArray(res) ? res : (res?.content ?? [])))
      .catch((e) => !dead && setError(String(e?.message ?? e)))
      .finally(() => !dead && setLoading(false));

    return () => { dead = true; };
  }, [cat, page, size, visa, nationality]);

  return { list, total: list.length, loading, error };
}
