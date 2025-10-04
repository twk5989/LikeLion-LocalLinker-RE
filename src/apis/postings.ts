import { get } from './client';
import type { Posting } from './types';

/** 상세 조회: /api/postings/{id}?language=XX */
export async function getPostingDetail(postingId: number): Promise<Posting | null> {
  const onboardingInfo = JSON.parse(localStorage.getItem('onboardingInfo') || '{}');
  try {
    const data = await get<Posting>(`/api/postings/${postingId}`, { language: onboardingInfo.nation });
    return data ?? null;
  } catch (e) {
    console.error('[getPostingDetail ERROR]', e);
    return null;
  }
}

/** 최신 공고: /api/postings/latest?limit=5 */
export async function getLatestPostings(limit = 5): Promise<Posting[]> {
  return await get<Posting[]>('/api/postings/latest', { limit });
}

/** 마감 임박: /api/postings/closing-soon?size=50&page=0 */
export async function getClosingSoon(size = 50, page = 0): Promise<Posting[]> {
  return await get<Posting[]>('/api/postings/closing-soon', { size, page });
}

export interface CategoryQuery {
  category?: string;
  visa?: string;
  language?: string;
  nationality?: string;
  size?: number;
  page?: number;
  [k: string]: any;
}

/** 카테고리별: /api/postings/category?... */
export async function getPostingsByCategory(params: CategoryQuery): Promise<Posting[]> {
  return await get<Posting[]>('/api/postings/category', params);
}
