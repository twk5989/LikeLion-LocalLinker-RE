//마감 임박공고 훅

import * as React from 'react';
import api from '../apis';
import { mapBackendList } from '../mappers/notice';
import { latestScore } from '../utils/dateScore';
import type { BackendNotice, Notice } from '../types/notices';

type LatestFilters = {
  visa?: string;
};

async function fetchLatest(pageSize: number, maxPages: number, visa?: string) {
  const res = await api.get<BackendNotice[]>('/api/postings/latest', {
    params: { size: pageSize, page: 0, visa },
  });
  return res.data;
}

export function useLatest(pageSize = 200, maxPages = 50, filters?: LatestFilters) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchLatest(pageSize, maxPages, filters?.visa);
        if (cancelled) return;
        const sorted = raw.sort((a, b) => latestScore(b) - latestScore(a));
        setList(mapBackendList(sorted));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
        setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSize, maxPages, filters?.visa]);

  return { list, loading, error };
}
