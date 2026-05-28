import type { MemberRole } from '@/shared/constants/role';

export const formatDate = (iso?: string): string => {
  if (!iso) return '-';
  const [date = ''] = iso.split('T');
  return date.replaceAll('-', '.');
};

export const formatDateTime = (iso?: string): string => {
  if (!iso) return '-';
  const [date = '', time] = iso.split('T');
  return `${date.replaceAll('-', '.')} ${time?.slice(0, 5) ?? ''}`.trim();
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('ko-KR').format(n);

export const formatPhone = (raw?: string): string => {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
};

export const roleLabel = (role?: MemberRole | string): string => {
  switch (role) {
    case 'ROLE_HEAD_ADMIN':
      return '사무국';
    case 'ROLE_PLACE_ADMIN':
      return '코디네이터';
    case 'ROLE_USER':
      return '일반 회원';
    default:
      return '-';
  }
};
