import type { AxiosRequestConfig, Method } from 'axios';
import { http } from './http';
import { USE_MOCK } from './config';

type RequestOptions<T> = {
  params?: Record<string, any>;
  data?: any;
  mock?: T;             // if USE_MOCK and provided, this will be returned
  config?: AxiosRequestConfig;
};

export async function request<T>(
  method: Method,
  url: string,
  opts: RequestOptions<T> = {},
): Promise<T> {
  const { params, data, mock, config } = opts;
  if (USE_MOCK && typeof mock !== 'undefined') {
    return mock;
  }
  const res = await http.request<T>({ method, url, params, data, ...(config || {}) });
  return res.data as T;
}

export const get = <T>(
  url: string,
  params?: Record<string, any>,
  mock?: T,
  config?: AxiosRequestConfig,
) => request<T>('GET', url, { params, mock, config });

export const post = <T>(
  url: string,
  data?: any,
  mock?: T,
  config?: AxiosRequestConfig,
) => request<T>('POST', url, { data, mock, config });

export const put = <T>(
  url: string,
  data?: any,
  mock?: T,
  config?: AxiosRequestConfig,
) => request<T>('PUT', url, { data, mock, config });

export const del = <T>(
  url: string,
  params?: Record<string, any>,
  mock?: T,
  config?: AxiosRequestConfig,
) => request<T>('DELETE', url, { params, mock, config });

/** Backward-compat aliases (구 코드 호환) */
export const mockOrApiGet = get;
export const mockOrApiPost = post;
export const mockOrApiPut = put;
export const mockOrApiDelete = del;