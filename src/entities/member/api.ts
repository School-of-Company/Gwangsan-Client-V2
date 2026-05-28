import { api } from '@/shared/lib/api';
import type { MemberRole } from '@/shared/constants/role';
import type { Member, MemberStatus } from '@/shared/types/member';

export interface MemberFilter {
  headId?: number;
  nickname?: string;
  placeId?: number;
}

export const listMembers = async (filter: MemberFilter): Promise<Member[]> => {
  const params: Record<string, string | number> = {};
  if (filter.headId) params['headId'] = filter.headId;
  if (filter.nickname) params['nickname'] = filter.nickname;
  if (filter.placeId) params['placeId'] = filter.placeId;
  const { data } = await api.get<Member[]>('/member/all', { params });
  return data;
};

export const getMember = async (memberId: string): Promise<Member> =>
  api.get<Member>(`/member/${memberId}`).then((r) => r.data);

export const changeMemberRole = (
  memberId: string,
  role: MemberRole,
  placeId?: number,
) => api.patch(`/admin/role/${memberId}`, { role, placeId }).then((r) => r.data);

export const changeMemberStatus = (memberId: string, status: MemberStatus) =>
  api.patch(`/admin/status/${memberId}`, { status }).then((r) => r.data);

export const adjustMemberGwangsan = (memberId: string, gwangsan: string) =>
  api.patch(`/admin/gwangsan/${memberId}`, { gwangsan }).then((r) => r.data);
