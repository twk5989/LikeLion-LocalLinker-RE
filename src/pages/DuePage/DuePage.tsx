// src/pages/Due/DuePage.tsx  (경로는 네 프로젝트 구조에 맞게)
import React from 'react';
import Layout from '../../layouts/layout';
import Pager from '../../components/Pager/Pager';
import NoticeCard from '../../components/Card/NoticeCard';
import { useDue } from '../../hooks/Due';
import Fallback from '../../components/Common/Fallback';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6;

export default function DuePage() {
  const navigate = useNavigate();

  // useDue는 BackendNotice[]를 반환한다고 가정 (마감 임박 정렬/필터 포함)
  const { list: notices, loading, error } = useDue(200);
  const [page, setPage] = React.useState(1);

  const total = notices.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const current = notices.slice(start, start + PAGE_SIZE);

  // 데이터가 바뀌면 페이지 1로 리셋
  React.useEffect(() => {
    setPage(1);
  }, [total]);

  React.useEffect(() => {
    console.log('[closing-soon][page]', {
      total,
      page,
      pageSize: PAGE_SIZE,
      showing: current.length,
      currentIds: current.map((n) => n.id),
    });
  }, [total, page, current]);

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <Layout headerProps={{ type: 'detail', text: '마감 임박 공고' }}>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px',
          paddingTop: '67px',
        }}
      >
        <Fallback
          loading={loading}
          error={error}
          empty={!loading && !error && current.length === 0}
        >
          {current.map((n) => (
            <NoticeCard
              key={String(n.id)}          // key는 문자열 권장
              notice={n}                  // ✅ 단일 prop으로 전달
              onClick={() => handleCardClick(n.id)}
            />
          ))}
        </Fallback>
      </section>

      {!loading && !error && totalPages > 1 && (
        <div style={{ padding: '8px 0 16px' }}>
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </Layout>
  );
}
