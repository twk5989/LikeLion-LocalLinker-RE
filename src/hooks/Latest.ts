// src/hooks/useLatest.ts
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { BackendNotice } from '../types/notices';
import { periodStartTs } from '../utils/dates'; // "YY.MM.DD~..."에서 시작일 timestamp 추출

type LatestFilters = { visa?: string | null; nationality?: string | null };

// 시작 시각 읽기: ISO 우선, 없으면 period 파서 폴백
function getStartTs(n: BackendNotice & { period?: string }): number {
  if (n.applyStartAt) {
    const t = Date.parse(n.applyStartAt);
    if (Number.isFinite(t)) return t;
  }
  if (typeof (n as any).period === 'string') {
    const t = periodStartTs((n as any).period);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

// "최신" 정렬: 시작시각이 유효한 것만 남기고, 최신순(가장 최근 시작일이 먼저)
function sortLatest(list: (BackendNotice & { period?: string })[]) {
  return [...list]
    .filter((n) => Number.isFinite(getStartTs(n)))
    .sort((a, b) => getStartTs(b) - getStartTs(a));
}

export function useLatest(size = 20, filters?: LatestFilters) {
  const [list, setList] = React.useState<BackendNotice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let dead = false;
    setLoading(true);

    mockOrApiGet<BackendNotice[]>('/api/postings/latest', {
      params: {
        size,
        page: 0,
        visa: filters?.visa ?? null,
        nationality: filters?.nationality ?? null,
      },
    })
      .then((raw) => {
        if (dead) return;
        const arr = Array.isArray(raw) ? raw : [];
        setList(sortLatest(arr));
      })
      .catch((e: any) => !dead && setError(String(e?.message ?? e)))
      .finally(() => !dead && setLoading(false));

    return () => {
      dead = true;
    };
  }, [size, filters?.visa, filters?.nationality]);

  return { list, loading, error };
}
