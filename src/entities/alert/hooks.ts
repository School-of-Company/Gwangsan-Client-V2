'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  acceptSignup,
  cancelTrade,
  dismissAlert,
  getAlerts,
} from './api';

export const alertKeys = {
  all: ['alerts'] as const,
};

export const useAlerts = () =>
  useQuery({
    queryKey: alertKeys.all,
    queryFn: getAlerts,
    refetchInterval: 30_000,
  });

export const useDismissAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => dismissAlert(id),
    onSuccess: () => {
      toast.success('알림을 처리했어요.');
      void qc.invalidateQueries({ queryKey: alertKeys.all });
    },
    onError: () => toast.error('알림 처리에 실패했어요.'),
  });
};

export const useAcceptSignup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => acceptSignup(id),
    onSuccess: () => {
      toast.success('가입을 승인했어요.');
      void qc.invalidateQueries({ queryKey: alertKeys.all });
    },
    onError: () => toast.error('가입 승인에 실패했어요.'),
  });
};

export const useCancelTrade = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => cancelTrade(id),
    onSuccess: () => {
      toast.success('거래를 취소 처리했어요.');
      void qc.invalidateQueries({ queryKey: alertKeys.all });
    },
    onError: () => toast.error('거래 취소 처리에 실패했어요.'),
  });
};
