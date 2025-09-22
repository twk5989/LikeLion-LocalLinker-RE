// src/hooks/useLatest.ts
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { Notice } from '../types/notices';
import { periodStartTs } from '../utils/dates'; // "YY.MM.DD~..."에서 시작일 timestamp 추출

type LatestFilters = { visa?: string };

// 시작일 기준 “현재와의 차” 점수 (작을수록 최신에 가까움)
function latestScoreFromPeriod(period: string): number {
  const t = periodStartTs(period);
  return Number.isFinite(t) ? Math.abs(t - Date.now()) : Number.POSITIVE_INFINITY;
}

async function fetchLatest(size: number, visa?: string) {
  const res = await mockOrApiGet<Notice[]>('/api/postings/latest', {
    params: { size, page: 0, visa },
  });
  // 목업/실서버 공통으로 Notice[] 반환한다고 가정
  return Array.isArray(res) ? res : [];
}

export function useLatest(size = 20, filters?: LatestFilters) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchLatest(size, filters?.visa);

        // 시작일 존재 + 현재 기준 가까운 순
        const sorted = raw
          .filter((n) => Number.isFinite(periodStartTs(n.period)))
          .sort((a, b) => latestScoreFromPeriod(a.period) - latestScoreFromPeriod(b.period));

        if (!cancelled) setList(sorted);
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
  }, [size, filters?.visa]);

  return { list, loading, error };
}
