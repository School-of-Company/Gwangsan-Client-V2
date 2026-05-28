import type { MemberRole } from '@/shared/constants/role';

export const MEMBER_STATUSES = [
  'ACTIVE',
  'SUSPENDED',
  'PENDING',
  'WITHDRAWN',
] as const;

export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export const MEMBER_STATUS_KOR: Record<MemberStatus, string> = {
  ACTIVE: '활동',
  SUSPENDED: '정지',
  PENDING: '대기',
  WITHDRAWN: '탈퇴',
};

export const memberStatusOptions = MEMBER_STATUSES.map((value) => ({
  value,
  label: MEMBER_STATUS_KOR[value],
}));

export interface Member {
  memberId: string;
  nickname: string;
  name: string;
  phoneNumber: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  gwangsan: number;
  placeId?: number;
}
