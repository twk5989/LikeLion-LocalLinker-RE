import * as React from 'react';
import api from '../apis';
import { mapBackendList } from '../mappers/notice';
import { unpackArray } from '../utils/query';
import type { BackendNotice, Notice } from '../types/notices';

async function fetchClosingSoon(pageSize: number, page: number) {
  const res = await api.get(`/api/postings/closing-soon`, {
    params: { size: pageSize, page },
  });
  return unpackArray(res.data) as BackendNotice[];
}

export function useDue(pageSize = 200, maxPages = 50) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchClosingSoon(pageSize, 0);
        if (!cancelled) setList(mapBackendList(raw));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageSize, maxPages]);

  return { list, loading, error };
}
