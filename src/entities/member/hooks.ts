'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adjustMemberGwangsan,
  changeMemberRole,
  changeMemberStatus,
  getMember,
  listMembers,
  type MemberFilter,
} from './api';
import type { MemberRole } from '@/shared/constants/role';
import type { MemberStatus } from '@/shared/types/member';

export const memberKeys = {
  all: ['members'] as const,
  list: (filter: MemberFilter) => ['members', 'list', filter] as const,
  detail: (id: string) => ['members', 'detail', id] as const,
};

export const useMembers = (filter: MemberFilter) =>
  useQuery({
    queryKey: memberKeys.list(filter),
    queryFn: () => listMembers(filter),
    placeholderData: keepPreviousData,
  });

export const useMember = (memberId: string | undefined) =>
  useQuery({
    queryKey: memberKeys.detail(memberId ?? ''),
    queryFn: () => getMember(memberId as string),
    enabled: !!memberId,
  });

const invalidateMembers = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: memberKeys.all });

export const useChangeMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      role,
      placeId,
    }: {
      memberId: string;
      role: MemberRole;
      placeId?: number;
    }) => changeMemberRole(memberId, role, placeId),
    onSuccess: () => {
      toast.success('역할이 변경되었어요.');
      void invalidateMembers(qc);
    },
    onError: () => toast.error('역할 변경에 실패했어요.'),
  });
};

export const useChangeMemberStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      status,
    }: {
      memberId: string;
      status: MemberStatus;
    }) => changeMemberStatus(memberId, status),
    onSuccess: () => {
      toast.success('상태가 변경되었어요.');
      void invalidateMembers(qc);
    },
    onError: () => toast.error('상태 변경에 실패했어요.'),
  });
};

export const useAdjustGwangsan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      gwangsan,
    }: {
      memberId: string;
      gwangsan: string;
    }) => adjustMemberGwangsan(memberId, gwangsan),
    onSuccess: () => {
      toast.success('광산 포인트를 조정했어요.');
      void invalidateMembers(qc);
    },
    onError: () => toast.error('포인트 조정에 실패했어요.'),
  });
};
