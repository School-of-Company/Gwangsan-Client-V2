import { api } from '@/shared/lib/api';
import type { MemberRole } from '@/shared/constants/role';
import { isSamePlace, PLACES } from '@/shared/constants/place';
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
  // 서버는 placeName 완전 일치로만 필터링하고 placeId는 받지 않아요.
  // 지점명 표기가 DB와 달라도 조회되도록 응답의 placeName을 정규화해서 직접 걸러요.
  const placeName = filter.placeId ? PLACES[filter.placeId] : undefined;
  if (!placeName) return data;
  return data.filter((m) => isSamePlace(m.placeName, placeName));
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
