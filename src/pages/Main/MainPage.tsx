// src/pages/Main/MainPage.tsx (경로는 네 프로젝트 구조에 맞게)
import React from 'react';
import * as S from './MainPage.styles';
import SearchBar from '../../components/Main/SearchBar/SearchBar';
import Banner from '../../components/Main/Banner/Banner';
import QuickActions from '../../components/Main/QuickActions/QuickActions';
import {
  SectionHeader,
  SectionList,
} from '../../components/Main/Section/Section';
import NoticeCard from '../../components/Card/NoticeCard';
import { useNavigate } from 'react-router-dom';
import FabChat from '../../components/FabChat';
import { useLatest } from '../../hooks/Latest';
import { useDue } from '../../hooks/Due';
import Fallback from '../../components/Common/Fallback';
import { useBookmark } from '../../hooks/Bookmark';
import { CATEGORY_KO } from '../../constants/notices'; // 카테고리 한글 라벨 검색 포함용

export default function MainPage() {
  const { list: latest, loading: lLoading, error: lError } = useLatest(50);
  const { list: due, loading: dLoading, error: dError } = useDue(200);
  const { bookmarkedIds, toggleBookmark } = useBookmark();
  const navigate = useNavigate();

  const [search, setSearch] = React.useState('');

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  // 검색 필터링 (제목/대상/주관/카테고리(영문코드+한글라벨))
  const q = search.trim().toLowerCase();
  const match = (n: any) => {
    const title = n.title?.toLowerCase() ?? '';
    const eligibility = n.eligibility?.toLowerCase() ?? '';
    const organization = n.organization?.toLowerCase() ?? '';
    const categoryCode = n.category?.toLowerCase() ?? '';
    const categoryKo =
      (CATEGORY_KO as any)[n.category as keyof typeof CATEGORY_KO] ?? '';
    const categoryKoLower = String(categoryKo).toLowerCase();
    return (
      title.includes(q) ||
      eligibility.includes(q) ||
      organization.includes(q) ||
      categoryCode.includes(q) ||
      categoryKoLower.includes(q)
    );
  };

  const filteredLatest = q ? latest.filter(match) : latest;
  const filteredDue = q ? due.filter(match) : due;

  return (
    <S.Stage>
      <S.Page>
        <S.Content>
          <div id="top" />
          <SearchBar value={search} onChange={setSearch} />
          <Banner />
          <QuickActions />

          <SectionHeader title="최신 공고" to="/postings/latest" />
          <SectionList>
            <Fallback
              loading={lLoading}
              error={lError}
              empty={!lLoading && !lError && filteredLatest.slice(0, 3).length === 0}
            >
              {filteredLatest.slice(0, 3).map((n) => (
                <NoticeCard
                  key={String(n.id)}                         // 문자열 key 권장
                  notice={n}                                  // ✅ 단일 prop
                  bookmarked={bookmarkedIds.includes(String(n.id))}
                  onToggleBookmark={(_next) => toggleBookmark(String(n.id))}
                  onClick={() => handleCardClick(n.id)}       // id는 number
                />
              ))}
            </Fallback>
          </SectionList>

          <SectionHeader title="마감 임박 공고" to="/postings/due" />
          <SectionList>
            <Fallback
              loading={dLoading}
              error={dError}
              empty={!dLoading && !dError && filteredDue.slice(0, 3).length === 0}
            >
              {filteredDue.slice(0, 3).map((n) => (
                <NoticeCard
                  key={String(n.id)}
                  notice={n}                                  // ✅ 단일 prop
                  bookmarked={bookmarkedIds.includes(String(n.id))}
                  onToggleBookmark={(_next) => toggleBookmark(String(n.id))}
                  onClick={() => handleCardClick(n.id)}
                />
              ))}
            </Fallback>
          </SectionList>
        </S.Content>

        <FabChat />
      </S.Page>
    </S.Stage>
  );
}
