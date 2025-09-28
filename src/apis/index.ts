// src/apis/index.ts
import axios from 'axios';
import { mockNotices, mockLatestNotices, mockDueSoonNotices } from '../data/mockNotices';
import { BASE_URL } from './config';
import { NATIONALITIES } from '../constants/onboardingOptions'; // 국적 옵션 사용 (value만 씀)

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

// ✅ axios 공용 인스턴스 (이게 없으면 api.get에서 에러)
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// =======================
//  목업 전용 헬퍼
// =======================
const VISA_POOL = ['C_4','D_2','D_4','D_10','E_2','E_7','E_9','F_1','F_2','F_3','F_4','F_5','F_6','H_2','G_1'];
const NATION_POOL = NATIONALITIES.map(n => n.value); // 예: 'ko','en','zh'...

function numericId(id: string | number) {
  const s = String(id);
  const m = s.match(/\d+/g);
  if (m && m.length) return Number(m.join('')) || 0;
  // 숫자 없으면 해시처럼 문자코드 합
  let acc = 0;
  for (let i = 0; i < s.length; i++) acc = (acc * 131 + s.charCodeAt(i)) >>> 0;
  return acc;
}

export function mockVisaForId(id: string | number) {
  const idx = numericId(id) % VISA_POOL.length;
  return VISA_POOL[idx];
}

export function mockNationForId(id: string | number) {
  const idx = numericId(id) % NATION_POOL.length;
  return NATION_POOL[idx];
}

// =======================
//  GET (mock 또는 실제 API)
// =======================
export type GetOptions = {
  params?: Record<string, any>;
  signal?: AbortSignal;
};

export async function mockOrApiGet<T>(url: string, options?: GetOptions): Promise<T> {
  if (USE_MOCK) {
    const params = options?.params ?? {};
    const visa = params.visa as string | undefined;
    const nation = params.nation as string | undefined;

    console.log('[MOCK] GET', url, params);

    if (url.includes('/api/postings/latest')) {
      let list = [...mockLatestNotices];
      if (visa)  list = list.filter(n => mockVisaForId(n.id)   === visa);
      if (nation) list = list.filter(n => mockNationForId(n.id) === nation);
      return list as T;
    }

    if (url.includes('/api/postings/closing-soon')) {
      let list = [...mockDueSoonNotices];
      if (visa)  list = list.filter(n => mockVisaForId(n.id)   === visa);
      if (nation) list = list.filter(n => mockNationForId(n.id) === nation);
      return list as T;
    }

    return mockNotices as T;
  }

  // 실제 API
  const res = await api.get<T>(url, options as any);
  return res.data;
}

export default api;
