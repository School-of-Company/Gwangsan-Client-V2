import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPhone,
  roleLabel,
} from './format';

describe('format helpers', () => {
  it('formats dates and date-times for the admin UI', () => {
    expect(formatDate('2026-05-28T12:34:56')).toBe('2026.05.28');
    expect(formatDateTime('2026-05-28T12:34:56')).toBe('2026.05.28 12:34');
  });

  it('keeps empty date values display-safe', () => {
    expect(formatDate()).toBe('-');
    expect(formatDateTime()).toBe('-');
  });

  it('formats Korean phone numbers and numbers', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
    expect(formatPhone('0212345678')).toBe('021-234-5678');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('maps known member roles to Korean labels', () => {
    expect(roleLabel('ROLE_HEAD_ADMIN')).toBe('사무국');
    expect(roleLabel('ROLE_PLACE_ADMIN')).toBe('코디네이터');
    expect(roleLabel('ROLE_USER')).toBe('일반 회원');
    expect(roleLabel('UNKNOWN')).toBe('-');
  });
});
