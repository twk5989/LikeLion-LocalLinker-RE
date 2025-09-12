// 환경변수에서 BASE_URL 가져오기
export const BASE_URL: string =
  (process.env.REACT_APP_BASE_URL as string | undefined) ||
  'http://localhost:8080';
