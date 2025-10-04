// 환경변수에서 BASE_URL 가져오기 및 모킹 스위치

export const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (process?.env?.REACT_APP_BASE_URL as string | undefined) ||
  'http://localhost:8080';

const truthy = new Set(['true']);
const rawUseMock =
  ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_USE_MOCK) ||
    (process?.env?.REACT_APP_USE_MOCK as string | undefined) ||
    'false') + '';

export const USE_MOCK: boolean = truthy.has(rawUseMock.toLowerCase());
