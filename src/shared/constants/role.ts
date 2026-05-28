export const MEMBER_ROLES = [
  'ROLE_USER',
  'ROLE_PLACE_ADMIN',
  'ROLE_HEAD_ADMIN',
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export const MEMBER_ROLE_KOR: Record<MemberRole, string> = {
  ROLE_USER: '일반 회원',
  ROLE_PLACE_ADMIN: '코디네이터',
  ROLE_HEAD_ADMIN: '사무국',
};

export const memberRoleOptions = MEMBER_ROLES.map((value) => ({
  value,
  label: MEMBER_ROLE_KOR[value],
}));
