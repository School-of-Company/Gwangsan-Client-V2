import { authConfig, isAdminRole } from './auth';

describe('auth config', () => {
  it('recognizes only admin roles', () => {
    expect(isAdminRole('ROLE_HEAD_ADMIN')).toBe(true);
    expect(isAdminRole('ROLE_PLACE_ADMIN')).toBe(true);
    expect(isAdminRole('ROLE_USER')).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });

  it('keeps protected admin routes explicit', () => {
    expect(authConfig.protectedPages).toEqual(
      expect.arrayContaining(['/main', '/notice', '/gwangsan']),
    );
    expect(authConfig.publicPages).toEqual(['/signin', '/password']);
  });
});
