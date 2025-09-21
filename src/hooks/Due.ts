import * as React from 'react';
import { mockOrApiGet } from '../apis';            // 목업,실서버 토글 지원
import { unpackArray } from '../utils/query';      // 응답 배열 안전 언팩
import { dueScore } from '../utils/dateScore';     // 종료일 기준 점수
import { mapBackendList } from '../mappers/notice';
import type { BackendNotice, Notice } from '../types/notices';

// 백엔드의 응답을 unpackArray로 추출
async function fetchClosingSoon(pageSize: number, page: number) {
  //mockOrApiGet은 mock 모드에서 data 그대로, 실서버에서는 res.data를 반환
  const res = await mockOrApiGet(`/api/postings/closing-soon`, {
    params: { size: pageSize, page },
  });
  return unpackArray(res) as BackendNotice[];
}

//상태 정의
export function useDue(pageSize = 200, maxPages = 50) {
  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  //closing-soon api 호출 및 정렬/필터 적용
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // 1) 원본(BackendNotice) 받아오기
        const raw = await fetchClosingSoon(pageSize, 0);

        // 2) 종료일 기준: 이미 지난 건 제외 + 오늘 이후 중 "가까운 순"
        const filteredSorted = raw
          .filter((n) => dueScore(n.applyEndAt) !== Infinity)
          .sort((a, b) => dueScore(a.applyEndAt) - dueScore(b.applyEndAt));

        // 3) UI 표시 타입으로 매핑
        const mapped = mapBackendList(filteredSorted);

        if (!cancelled) setList(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // pageSize, maxPages가 바뀌면 다시 불러오도록 유지 (page=0만 쓰긴 하지만 의도 반영)
  }, [pageSize, maxPages]);

  return { list, loading, error };
}