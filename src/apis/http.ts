import axios from 'axios';
import { API_BASE_URL } from './config';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    // TODO: hook toast/logger if desired
    return Promise.reject(error);
  },
);