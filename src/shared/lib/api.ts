'use client';

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { authConfig } from '@/shared/config/auth';
import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  clearAuth,
  getAccessToken,
  getRefreshToken,
} from './auth';
import { setCookie } from './cookies';

export const baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const api = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let waitingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (err: unknown, token: string | null) => {
  waitingQueue.forEach(({ resolve, reject }) => {
    if (err) reject(err);
    else resolve(token!);
  });
  waitingQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e: AxiosError) => Promise.reject(e),
);

const SKIP_REFRESH_PATHS = [
  '/admin/signin',
  '/api/auth/reissue',
  '/auth/reissue',
  '/api/password-reset',
];

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    if (typeof window === 'undefined') return Promise.reject(error);

    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status !== 401) return Promise.reject(error);

    const url = original.url ?? '';
    if (SKIP_REFRESH_PATHS.some((p) => url.includes(p))) {
      return Promise.reject(error);
    }
    if (original._retry) return Promise.reject(error);
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('no_refresh_token');

      const { data } = await refreshClient.patch<{ accessToken: string }>(
        '/api/auth/reissue',
        null,
        { headers: { refreshtoken: refreshToken } },
      );

      setCookie(AUTH_TOKEN_KEY, data.accessToken, { maxAge: 86400 });
      flushQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      clearAuth();

      const path = window.location.pathname;
      const isProtected = authConfig.protectedPages.some((p) =>
        path.startsWith(p),
      );
      if (isProtected) window.location.replace(authConfig.signInPage);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY };
