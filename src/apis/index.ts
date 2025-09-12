import axios from 'axios';
import { BASE_URL } from './config';

// axios 공용 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
