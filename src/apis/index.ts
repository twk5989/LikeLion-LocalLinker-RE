// src/apis/index.ts
import axios from 'axios';
import { BASE_URL } from './config';
import mockNoticesDefault, { mockNotices as mockNoticesNamed } from '../data/mockNotices';

// CRA/webpack, Vite 둘 다 대응 (하나만 쓰면 그 한 줄만 남겨도 됨)
const USE_MOCK =
  (typeof process !== 'undefined' && process.env?.REACT_APP_USE_MOCK === 'true') ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_USE_MOCK === 'true');

// 공용 axios 인스턴스 생성
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- 내부 유틸 ----------
type NoticeLike = {
  id: number;
  visa?: string | null;
  nationality?: string | null;
  applyEndAt?: string | null;
  [k: string]: any;
};

// data-mockNotices.ts 가 default 또는 named export 둘 중 하나일 수 있어 안전하게 합치기
const ALL_MOCK: NoticeLike[] = Array.isArray(mockNoticesDefault)
  ? mockNoticesDefault
  : Array.isArray(mockNoticesNamed)
  ? mockNoticesNamed
  : [];

// 필터 적용 (visa, nationality, keyword(optional))
function applyFilters<T extends NoticeLike>(
  list: T[],
  params: Record<string, any> = {}
): T[] {
  const visa = params.visa ?? null;
  // nation / nationality 어느 키로 들어와도 지원 (과거 호환)
  const nationality = params.nationality ?? params.nation ?? null;
  const keyword = (params.keyword ?? '').toString().trim().toLowerCase();

  return list.filter((n) => {
    // keyword: title + organization에 포함되면 통과 (옵션)
    if (keyword) {
      const hay = `${n.title ?? ''} ${n.organization ?? ''}`.toLowerCase();
      if (!hay.includes(keyword)) return false;
    }
    // visa: 목업에 visa가 없거나 null이면 전체 허용, 값이 있으면 정확히 일치해야
    if (visa) {
      if (n.visa && n.visa !== visa) return false;
    }
    // nationality: 동일 규칙
    if (nationality) {
      if (n.nationality && n.nationality !== nationality) return false;
    }
    return true;
  });
}

function sortByClosingSoon<T extends NoticeLike>(list: T[]): T[] {
  // applyEndAt 오름차순 (가까운 마감일 먼저)
  return [...list].sort((a, b) => {
    const ta = a.applyEndAt ? Date.parse(a.applyEndAt) : Number.POSITIVE_INFINITY;
    const tb = b.applyEndAt ? Date.parse(b.applyEndAt) : Number.POSITIVE_INFINITY;
    return ta - tb;
  });
}

// ---------- 공개 API(모의 또는 실제) ----------
export type GetOptions = {
  params?: Record<string, any>;
  signal?: AbortSignal;
};

export async function mockOrApiGet<T>(url: string, options?: GetOptions): Promise<T> {
  if (!USE_MOCK) {
    const res = await api.get<T>(url, options as any);
    return res.data;
  }

  // ✅ MOCK 경로
  const params = options?.params ?? {};
  const filtered = applyFilters(ALL_MOCK, params);

  // 라우트별 응답 흉내
  if (url.includes('/api/postings/latest')) {
    // 최신: 일단 필터만 적용, limit 적용
    const limit = Number(params.limit ?? 10);
    return filtered.slice(0, limit) as unknown as T;
  }

  if (url.includes('/api/postings/closing-soon')) {
    // 마감 임박: 마감일 정렬 + limit
    const limit = Number(params.limit ?? 10);
    return sortByClosingSoon(filtered).slice(0, limit) as unknown as T;
  }

  if (url.includes('/api/postings/category')) {
    // 카테고리별: category 파라미터가 들어온다고 가정
    const category = (params.category ?? '').toString().toUpperCase();
    const page = Number(params.page ?? 0);
    const size = Number(params.size ?? 10);
    const pageStart = page * size;

    const list = filtered.filter(
      (n) => (n.category ?? '').toString().toUpperCase() === category
    );
    const content = list.slice(pageStart, pageStart + size);

    // 백엔드의 페이징 응답 형태를 단순 흉내 (필요 시 너가 맞춰서 수정)
    return {
      content,
      total: list.length,
      page,
      size,
    } as unknown as T;
  }

  // 기본: 전체 반환 (필요 시 페이지네이션 추가)
  return filtered as unknown as T;
}

export default api;
