'use client';

import { getCookie, removeCookie, setCookie } from './cookies';

export const AUTH_TOKEN_KEY = 'accessToken';
export const AUTH_REFRESH_TOKEN_KEY = 'refreshToken';
export const AUTH_ROLE_KEY = 'role';

const ONE_WEEK = 60 * 60 * 24 * 7;

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}

export const saveTokens = ({ accessToken, refreshToken }: UserToken): void => {
  setCookie(AUTH_TOKEN_KEY, accessToken, { maxAge: ONE_WEEK });
  setCookie(AUTH_REFRESH_TOKEN_KEY, refreshToken, { maxAge: ONE_WEEK });
};

export const saveRole = (role: string): void => {
  setCookie(AUTH_ROLE_KEY, role, { maxAge: ONE_WEEK });
};

export const clearAuth = (): void => {
  removeCookie(AUTH_TOKEN_KEY);
  removeCookie(AUTH_REFRESH_TOKEN_KEY);
  removeCookie(AUTH_ROLE_KEY);
};

export const getAccessToken = () => getCookie(AUTH_TOKEN_KEY);
export const getRefreshToken = () => getCookie(AUTH_REFRESH_TOKEN_KEY);
export const getRole = () => getCookie(AUTH_ROLE_KEY);

export const isAuthenticated = (): boolean => !!getAccessToken();
