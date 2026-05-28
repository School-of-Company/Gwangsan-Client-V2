export type AuthConfig = {
  signInPage: string;
  homePage: string;
  protectedPages: readonly string[];
  publicPages: readonly string[];
};

export const authConfig: AuthConfig = {
  signInPage: '/signin',
  homePage: '/main',
  protectedPages: [
    '/main',
    '/notice',
    '/detail',
    '/profile',
    '/graph',
    '/gwangsan',
  ],
  publicPages: ['/signin', '/password'],
} as const;

export const ADMIN_ROLES = ['ROLE_HEAD_ADMIN', 'ROLE_PLACE_ADMIN'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const isAdminRole = (value?: string | null): value is AdminRole =>
  value === 'ROLE_HEAD_ADMIN' || value === 'ROLE_PLACE_ADMIN';
