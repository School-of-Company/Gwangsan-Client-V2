'use client';

type CookieOpts = { maxAge?: number; path?: string };

export const setCookie = (
  name: string,
  value: string,
  { maxAge, path = '/' }: CookieOpts = {},
): void => {
  if (typeof document === 'undefined') return;
  const parts = [`${name}=${value}`, `path=${path}`, 'SameSite=Lax'];
  if (maxAge) parts.push(`max-age=${maxAge}`);
  document.cookie = parts.join('; ');
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const raw = `; ${document.cookie}`;
  const parts = raw.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

export const removeCookie = (name: string, path = '/'): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};
