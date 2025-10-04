// src/apis/index.ts
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { BASE_URL } from './config';
import mockNoticesDefault, { mockNotices as mockNoticesNamed } from '../data/mockNotices';

/* ------------------------------------------------------------------ */
/* ENV 읽기 (CRA + Vite, 대/소문자/1/yes 허용)                         */
/* ------------------------------------------------------------------ */
const getEnv = (k: string): string | undefined => {
  // Vite 환경 변수
  const viteEnv: Record<string, any> | undefined =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as { env?: Record<string, any> }).env
      : undefined;

  // CRA 환경 변수
  const craEnv: Record<string, string> | undefined =
    typeof process !== 'undefined'
      ? ((process.env as unknown) as Record<string, string>)
      : undefined;

  return (viteEnv && viteEnv[k]) || (craEnv && craEnv[k]) || undefined;
};

const parseBool = (v: unknown): boolean => {
  const s = String(v ?? '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
};

// 환경 판별
const viteIsProd =
  typeof import.meta !== 'undefined' &&
  Boolean((import.meta as unknown as { env?: Record<string, any> }).env?.PROD);
const craIsProd =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
const IS_PROD = Boolean(viteIsProd ?? craIsProd);

// env 플래그 읽기
const rawMock = getEnv('VITE_USE_MOCK') ?? getEnv('REACT_APP_USE_MOCK');

// ✅ 개발 환경에서는 무조건 목업 ON (캐시/미적용 이슈 방지)
const USE_MOCK = IS_PROD ? parseBool(rawMock) : true;

// 디버깅에 도움 되도록 원시값도 함께 출력
console.info(
  '[apis] ENV raw VITE_USE_MOCK=',
  getEnv('VITE_USE_MOCK'),
  'REACT_APP_USE_MOCK=',
  getEnv('REACT_APP_USE_MOCK'),
);

/* ------------------------------------------------------------------ */
/* axios 인스턴스 (MOCK=false일 때만 사용)                              */
/* ------------------------------------------------------------------ */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 확인용 로그
console.info('[apis] USE_MOCK =', USE_MOCK, 'BASE_URL =', BASE_URL);

/* ------------------------------------------------------------------ */
/* 목업 데이터                                                          */
/* ------------------------------------------------------------------ */
type NoticeLike = {
  id: number | string;
  title?: string | null;
  category?: string | null;
  organization?: string | null;
  applyStartAt?: string | null;
  applyEndAt?: string | null;
  visa?: string | null;
  nationality?: string | null;
  [k: string]: any;
};

// default 또는 named export 모두 대응
const ALL_MOCK: NoticeLike[] = Array.isArray(mockNoticesDefault)
  ? mockNoticesDefault
  : Array.isArray(mockNoticesNamed)
  ? mockNoticesNamed
  : [];

/* ------------------------------------------------------------------ */
/* 목업 유틸(필터/정렬)                                                 */
/* ------------------------------------------------------------------ */
const normVisa = (v: any) =>
  String(v ?? '').trim().toUpperCase().replace(/\s+/g, '').replace(/-/g, '_');

function applyFilters<T extends NoticeLike>(
  list: T[],
  params: Record<string, any> = {},
): T[] {
  const visaParam = params.visa ? normVisa(params.visa) : null;
  const nationality = (params.nationality ?? params.nation) || null;
  const keyword = (params.keyword ?? '').toString().trim().toLowerCase();

  return list.filter((n) => {
    // 키워드: title + organization
    if (keyword) {
      const hay = `${n.title ?? ''} ${n.organization ?? ''}`.toLowerCase();
      if (!hay.includes(keyword)) return false;
    }
    // 비자: 데이터는 'D-2'일 수 있으므로 정규화 비교
    if (visaParam) {
      const nv = n.visa ? normVisa(n.visa) : null;
      if (nv && nv !== visaParam) return false;
    }
    // 국적: 값이 있으면 정확 일치
    if (nationality) {
      if (n.nationality && n.nationality !== nationality) return false;
    }
    return true;
  });
}

function sortByClosingSoon<T extends NoticeLike>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const ta = a.applyEndAt ? Date.parse(a.applyEndAt) : Number.POSITIVE_INFINITY;
    const tb = b.applyEndAt ? Date.parse(b.applyEndAt) : Number.POSITIVE_INFINITY;
    return ta - tb;
  });
}

/* ------------------------------------------------------------------ */
/* 공개 API: mockOrApi*                                                */
/*  - MOCK=true  → 네트워크 미사용, 내부 목업에서 즉시 응답             */
/*  - MOCK=false → axios로 요청 후 res.data 반환                        */
/* ------------------------------------------------------------------ */
export async function mockOrApiGet<T>(
  url: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  if (!USE_MOCK) {
    const res = await api.get<T>(url, options);
    return res.data as T;
  }

  // ✅ MOCK 경로 (네트워크 미탐)
  const params = options?.params ?? {};
  const filtered = applyFilters(ALL_MOCK, params);

  if (url.includes('/api/postings/latest')) {
    // size 또는 limit 둘 다 허용
    const limit = Number(params.limit ?? params.size ?? 10);
    // 시작일 최신순(없으면 뒤로)
    const sorted = [...filtered].sort(
      (a, b) =>
        (b.applyStartAt ? Date.parse(b.applyStartAt) : -Infinity) -
        (a.applyStartAt ? Date.parse(a.applyStartAt) : -Infinity),
    );
    return sorted.slice(0, limit) as unknown as T;
  }

  if (url.includes('/api/postings/closing-soon')) {
    const limit = Number(params.limit ?? params.size ?? 10);
    return sortByClosingSoon(filtered).slice(0, limit) as unknown as T;
  }

  if (url.includes('/api/postings/category')) {
    const category = (params.category ?? '').toString().toUpperCase();
    const page = Number(params.page ?? 0);
    const size = Number(params.size ?? 10);
    const list = filtered.filter(
      (n) => String(n.category ?? '').toUpperCase() === category,
    );
    const start = page * size;
    return list.slice(start, start + size) as unknown as T; // 배열 반환(훅들과 정합)
  }

  // 기본: 전체 반환
  return filtered as unknown as T;
}

export async function mockOrApiPost<T = any>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  if (!USE_MOCK) {
    const res = await api.post<T>(url, body, config);
    return res.data as T;
  }
  // 필요한 경우 POST 목업 분기 추가
  return {} as T;
}

export async function mockOrApiPut<T = any>(
  url: string,
  body?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  if (!USE_MOCK) {
    const res = await api.put<T>(url, body, config);
    return res.data as T;
  }
  return {} as T;
}

export async function mockOrApiDelete<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  if (!USE_MOCK) {
    const res = await api.delete<T>(url, config);
    return res.data as T;
  }
  return {} as T;
}

export default api;
