// src/pages/Bookmarked/BookmarkedNoticesPage.tsx
import React from 'react';
import * as S from './BookmarkedNoticesPage.styles';
import NoticeCard from '../../components/Card/NoticeCard';
import { mapBackendList } from '../../mappers/notice';
import type { BackendNotice, Notice } from '../../types/notices';
import { useBookmark } from '../../hooks/Bookmark';
import { mockOrApiGet } from '../../apis';        // ✅ axios 래퍼
import { unpackArray } from '../../utils/query';  // ✅ 응답 배열 안전 추출
import { useNavigate } from 'react-router-dom';

async function fetchLatestBulk(limit = 300) {
  // ✅ axios (mock/real 토글은 .env)
  const res = await mockOrApiGet('/api/postings/latest', {
    params: { limit }, // 서버가 size/page면 { size: limit, page: 0 }로 바꿔도 됨
  });
  // mockOrApiGet은 data(=payload)를 반환하므로 res.data가 아님에 주의
  return unpackArray(res) as BackendNotice[];
}

export default function BookmarkedNoticesPage() {
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark } = useBookmark();

  const [list, setList] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCardClick = (id: string | number) => {
    navigate(`/detail/${Number(id)}`);
  };

  React.useEffect(() => {
    let cancelled = false;

    if (!bookmarkedIds || bookmarkedIds.length === 0) {
      setList([]);
      setLoading(false);
      setError(null);
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchLatestBulk(300);
        const all = mapBackendList(raw);
        const bookmarked = all.filter((n) => bookmarkedIds.includes(String(n.id)));

        if (!cancelled) setList(bookmarked);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? String(e));
          setList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [bookmarkedIds]);

  return (
    <S.Stage>
      <S.Page>
        <S.Content>
          {loading && <S.EmptyText>불러오는 중…</S.EmptyText>}
          {!loading && error && <S.EmptyText>오류: {error}</S.EmptyText>}
          {!loading && !error && list.length === 0 ? (
            <S.EmptyText>저장한 공고가 없습니다.</S.EmptyText>
          ) : (
            <S.ListContainer>
              {list.map((n) => (
                <NoticeCard
                  key={n.id}
                  {...n}
                  bookmarked={true}
                  onToggleBookmark={() => toggleBookmark(n.id)}
                  onClick={() => handleCardClick(n.id)}
                />
              ))}
            </S.ListContainer>
          )}
        </S.Content>
      </S.Page>
    </S.Stage>
  );
}
