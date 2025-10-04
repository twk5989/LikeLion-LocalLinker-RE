// src/components/Card/NoticeCard.tsx
import React from 'react';
import type { NoticeCardProps } from './NoticeCard.types';
import bookmarket from '../../assets/icons/bookmarket.svg';
import bookmarketFill from '../../assets/icons/bookmark_fill.svg';
import * as S from './NoticeCard.styles';

// 한글 라벨 맵 (이미 프로젝트에 존재)
import { CATEGORY_KO, TAG_KO } from '../../constants/notices';
// 기간 문자열 유틸 (예: '25.10.01~25.10.31' | '상시')
import { buildPeriod } from '../../utils/date';

export default function NoticeCard({
  notice: n,
  bookmarked: controlled,
  defaultBookmarked,
  onToggleBookmark,
  onClick,
  className,
}: NoticeCardProps) {
  // 제어/비제어 동시 지원
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultBookmarked);
  const bookmarked = controlled ?? uncontrolled;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !bookmarked;
    if (controlled === undefined) setUncontrolled(next);
    onToggleBookmark?.(next);
  };

  const categoryText = CATEGORY_KO[n.category as keyof typeof CATEGORY_KO] ?? n.category;
  const tagText = n.tags ? TAG_KO[n.tags as keyof typeof TAG_KO] : ''; // 태그는 null 가능성 있으므로 안전 접근
  const periodText = buildPeriod(n.applyStartAt, n.applyEndAt);        // 상시/범위 자동 처리

  return (
    <S.Card role="button" aria-label={n.title} onClick={onClick} className={className}>
      <S.MetaRow>
        <S.MetaLeft>
          <S.CategoryText>{categoryText}</S.CategoryText>
          {tagText && <S.TagBadge>{tagText}</S.TagBadge>}
          {n.isPeriodLimited && <S.LimitedBadge>기간제</S.LimitedBadge>}
        </S.MetaLeft>

        <S.IconButton onClick={handleBookmarkClick} aria-label="북마크 토글">
          <S.BookmarkImg src={bookmarked ? bookmarketFill : bookmarket} alt="" />
        </S.IconButton>
      </S.MetaRow>

      <S.TitleBox>
        <S.Title>{n.title}</S.Title>
      </S.TitleBox>

      <S.BottomRow>
        <S.Dept>대상 | {n.eligibility || '-'}</S.Dept>
        <S.Period>신청기간 | {periodText}</S.Period>
      </S.BottomRow>
    </S.Card>
  );
}
