import axios from 'axios';
import { mockNotices, mockLatestNotices, mockDueSoonNotices } from '../data/mockNotices';
import { BASE_URL } from './config';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true'; //env파일이 true이면 목업 데이터를 사용해라

//axios 공용 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

//GET 요청 (mock 또는 실제 API)
export async function mockOrApiGet<T>(url: string, options?: any): Promise<T> {
  if (USE_MOCK) {
    console.log('[MOCK] GET', url, options);

    //마감 임박 공고
    if (url.includes('/closing-soon')) {
      return mockDueSoonNotices as T;
    }

    //최신 공고
    if (url.includes('/latest')) {
      return mockLatestNotices as T;
    }

    //카테고리별 공고
    if (url.includes('/category')) {
      const cat = options?.params?.category; // e.g., "ADMINISTRATION"
      if (cat) {
        const filtered = mockNotices.filter((n) => n.category === cat);
        return filtered as T;
      }
      return mockNotices as T;
    }

    //전체(디폴트)
    return mockNotices as T;
  }

  // 실제 API 호출
  const res = await api.get<T>(url, options);
  return res.data;
}

export default api;
