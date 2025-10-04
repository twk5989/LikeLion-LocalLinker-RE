// src/hooks/useDue.ts
import * as React from 'react';
import { mockOrApiGet } from '../apis';
import type { BackendNotice } from '../types/notices';
import { periodEndTs } from '../utils/dates'; // "YY.MM.DD~..."에서 종료일 timestamp 추출

// 종료 시각 읽기: ISO 우선, 없으면 period 파서 폴백
function getEndTs(n: BackendNotice & { period?: string }): number {
  if (n.applyEndAt) {
    const t = Date.parse(n.applyEndAt);
    if (Number.isFinite(t)) return t;
  }
  if (typeof (n as any).period === 'string') {
    const t = periodEndTs((n as any).period);
    if (Number.isFinite(t)) return t;
  }
  return NaN;
}

export function useDue(size = 50) {
  const [list, setList] = React.useState<BackendNotice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let dead = false;
    setLoading(true);

    mockOrApiGet<BackendNotice[]>('/api/postings/closing-soon', { params: { size, page: 0 } })
      .then((raw) => {
        if (dead) return;
        const now = Date.now();
        const filteredSorted = (Array.isArray(raw) ? raw : [])
          .filter((n) => {
            const end = getEndTs(n as any);
            return Number.isFinite(end) && end >= now;
          })
          .sort((a, b) => {
            const ea = getEndTs(a as any);
            const eb = getEndTs(b as any);
            return ea - eb; // 가까운 마감일 먼저
          });
        setList(filteredSorted);
      })
      .catch((e: any) => !dead && setError(String(e?.message ?? e)))
      .finally(() => !dead && setLoading(false));

    return () => {
      dead = true;
    };
  }, [size]);

  return { list, loading, error };
}
