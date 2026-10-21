'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { FeedbackStatusUpdate } from '@/shared/types/feedback';
import {
  ADMIN_FEEDBACK_PAGE_SIZE,
  answerAdminFeedback,
  getAdminFeedback,
  listAdminFeedback,
  updateAdminFeedbackStatus,
  type FeedbackFilter,
} from './api';

export const feedbackKeys = {
  all: ['feedback'] as const,
  list: (filter: FeedbackFilter) => ['feedback', 'list', filter] as const,
  detail: (id: number) => ['feedback', 'detail', id] as const,
};

export const useAdminFeedbackList = (filter: FeedbackFilter = {}) =>
  useInfiniteQuery({
    queryKey: feedbackKeys.list(filter),
    queryFn: ({ pageParam }) =>
      listAdminFeedback({ ...filter, lastId: pageParam }),
    initialPageParam: undefined as number | undefined,
    // 마지막(가장 작은) feedbackId가 다음 페이지의 커서예요.
    getNextPageParam: (lastPage) =>
      lastPage.length < ADMIN_FEEDBACK_PAGE_SIZE
        ? undefined
        : lastPage[lastPage.length - 1]?.feedbackId,
  });

export const useAdminFeedback = (feedbackId: number) =>
  useQuery({
    queryKey: feedbackKeys.detail(feedbackId),
    queryFn: () => getAdminFeedback(feedbackId),
    enabled: Number.isFinite(feedbackId),
  });

export const useAnswerFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedbackId,
      answer,
    }: {
      feedbackId: number;
      answer: string;
    }) => answerAdminFeedback(feedbackId, answer),
    onSuccess: () => {
      toast.success('답변을 저장하고 작성자에게 알림을 보냈어요.');
      void qc.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: () => toast.error('답변 저장에 실패했어요.'),
  });
};

export const useUpdateFeedbackStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedbackId,
      status,
    }: {
      feedbackId: number;
      status: FeedbackStatusUpdate;
    }) => updateAdminFeedbackStatus(feedbackId, status),
    onSuccess: () => {
      toast.success('상태를 변경했어요.');
      void qc.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: () => toast.error('상태 변경에 실패했어요.'),
  });
};
