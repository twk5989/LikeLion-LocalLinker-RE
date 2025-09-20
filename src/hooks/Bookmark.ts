//북마크 기능을 로컬 스토리지와 연결해 유지(서버와 통신 필요X)
//localStorage로 새로고침을해도 북마크가 유지됨

import { useState} from 'react';

const LOCAL_STORAGE_KEY = 'bookmarkedIds';

export function useBookmark() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(id);
      const next = isBookmarked ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { bookmarkedIds, toggleBookmark };
}
