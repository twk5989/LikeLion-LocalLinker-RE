// src/pages/Bookmarked/BookmarkedNoticesPage.tsx
import React from 'react';
import * as S from './BookmarkedNoticesPage.styles';
import NoticeCard from '../../components/Card/NoticeCard';
import type { BackendNotice } from '../../types/notices';
import { useBookmark } from '../../hooks/Bookmark';
import { mockOrApiGet } from '../../apis';
import { unpackArray } from '../../utils/query';
import { useNavigate } from 'react-router-dom';

async function fetchLatestBulk(limit = 300) {
  const res = await mockOrApiGet<BackendNotice[]>('/api/postings/latest', {
    params: { limit },
  });
  return unpackArray(res) as BackendNotice[];
}

export default function BookmarkedNoticesPage() {
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark } = useBookmark();

  const [list, setList] = React.useState<BackendNotice[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`); // id는 number
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

        // bookmarkedIds가 string[]일 가능성 큼 → 문자열화해서 비교
        const bookmarked = raw.filter((n) => bookmarkedIds.includes(String(n.id)));

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
                  key={String(n.id)}                       // key는 문자열 권장
                  notice={n}                                // ✅ BackendNotice 단일 prop
                  bookmarked={true}
                  onToggleBookmark={(_next) => toggleBookmark(String(n.id))} // 문자열화
                  onClick={() => handleCardClick(n.id)}     // id는 number
                />
              ))}
            </S.ListContainer>
          )}
        </S.Content>
      </S.Page>
    </S.Stage>
  );
}
