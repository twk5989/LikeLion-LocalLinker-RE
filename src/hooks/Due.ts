// src/hooks/useDue.ts
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { Notice } from '../types/notices';
import { periodEndTs } from '../utils/dates'; // "YY.MM.DD~..."에서 종료일 timestamp 추출

function dueScoreFromPeriod(period: string): number {
  const t = periodEndTs(period);
  if (!Number.isFinite(t) || t < Date.now()) return Number.POSITIVE_INFINITY; // 지난 건 뒤로(사실상 제외)
  return t - Date.now(); // 작을수록 임박
}

async function fetchClosingSoon(size: number, page = 0) {
  const res = await mockOrApiGet<Notice[]>('/api/postings/closing-soon', {
    params: { size, page },
  });
  return Array.isArray(res) ? res : [];
}

export function useDue(size = 50) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchClosingSoon(size);

        // 종료일이 오늘 이후인 것만 + 가까운 순
        const filteredSorted = raw
          .filter((n) => {
            const t = periodEndTs(n.period);
            return Number.isFinite(t) && t >= Date.now();
          })
          .sort((a, b) => dueScoreFromPeriod(a.period) - dueScoreFromPeriod(b.period));

        if (!cancelled) setList(filteredSorted);
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
  }, [size]);

  return { list, loading, error };
}
