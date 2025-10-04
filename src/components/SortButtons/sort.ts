// ✅ 정렬 로직 (BackendNotice 기준)
// 파일 위치는 네가 붙여준 기존 위치에 맞춰 저장해줘 (ex. src/components/SortButtons/sortNotices.ts)
import * as React from 'react';
import type { BackendNotice } from '../../types/notices';
import type { SortKey } from './SortButtons.types';

// 대한민국(KST) 기준 현재 타임스탬프
const nowKST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  return utc + 9 * 60 * 60 * 1_000;
};

// ISO 문자열 → number(ms) | NaN
const ts = (iso: string | null) => (iso ? new Date(iso).getTime() : NaN);

// 안전 비교 (오름차순)
const cmpAscSafe = (a: number, b: number) => {
  const aa = Number.isFinite(a) ? a : Infinity;
  const bb = Number.isFinite(b) ? b : Infinity;
  if (aa < bb) return -1;
  if (aa > bb) return 1;
  return 0;
};

// 안전 비교 (내림차순)
const cmpDescSafe = (a: number, b: number) => -cmpAscSafe(a, b);

/**
 * BackendNotice 배열 정렬
 * - 'due'   : 마감 있는 공고 우선 → 마감 임박(오름차순) → 시작 빠른 순
 * - 'latest': 시작일 가까운 순(가까운 게 먼저) → 미래/과거 우선순위 → 최근/과거 정렬
 */
export function sortNotices(
  list: BackendNotice[],
  key: SortKey,
  nowTs = nowKST(),
): BackendNotice[] {
  const arr = [...list];

  if (key === 'due') {
    arr.sort((a, b) => {
      const ae = ts(a.applyEndAt);
      const be = ts(b.applyEndAt);
      const aHas = Number.isFinite(ae);
      const bHas = Number.isFinite(be);

      // 마감 있는 항목이 먼저
      if (aHas !== bHas) return aHas ? -1 : 1;

      // 둘 다 마감이 있으면 마감 임박 오름차순
      if (aHas && bHas) {
        const byEnd = cmpAscSafe(ae, be);
        if (byEnd !== 0) return byEnd;
        // 동일하면 시작 빠른 순
        return cmpAscSafe(ts(a.applyStartAt), ts(b.applyStartAt));
      }

      // 둘 다 마감이 없으면 시작 빠른 순
      return cmpAscSafe(ts(a.applyStartAt), ts(b.applyStartAt));
    });
    return arr;
  }

  // 'latest' (최신등록순)
  arr.sort((a, b) => {
    const as = ts(a.applyStartAt);
    const bs = ts(b.applyStartAt);
    const aHas = Number.isFinite(as);
    const bHas = Number.isFinite(bs);

    // 시작일 있는 항목이 먼저
    if (aHas !== bHas) return aHas ? -1 : 1;
    if (!aHas && !bHas) return 0;

    // now에 더 가까운 순으로(가까울수록 우선)
    const da = Math.abs((as as number) - nowTs);
    const db = Math.abs((bs as number) - nowTs);
    const near = cmpAscSafe(da, db);
    if (near !== 0) return near;

    // tie-breaker: 미래가 과거보다 먼저
    const aFuture = (as as number) >= nowTs;
    const bFuture = (bs as number) >= nowTs;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;

    // 미래면 시작 빠른 순, 과거면 시작 최신 순
    return aFuture ? cmpAscSafe(as, bs) : cmpDescSafe(as, bs);
  });

  return arr;
}
