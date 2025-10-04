// src/components/NoticeCard/NoticeCard.types.ts
import type { MouseEvent } from 'react';
import type { BackendNotice } from '../../types/notices';

export type NoticeCardProps = {
  notice: BackendNotice;                    // 리팩토링된 Notice 엔티티 전체
  bookmarked?: boolean;              // 제어형 북마크
  defaultBookmarked?: boolean;       // 비제어 기본값
  onToggleBookmark?: (next: boolean) => void;
  onClick?: (e: MouseEvent) => void;
  className?: string;
};
