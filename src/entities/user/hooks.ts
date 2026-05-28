'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
  resetPassword,
  sendPasswordResetCode,
  signIn,
  verifyPasswordResetCode,
} from './api';

const messageFromError = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ??
      fallback
    );
  }
  return fallback;
};

export const useSignIn = () =>
  useMutation({
    mutationKey: ['signin'],
    mutationFn: signIn,
    onError: (err) => toast.error(messageFromError(err, '로그인에 실패했어요.')),
  });

export const useSendPasswordResetCode = () =>
  useMutation({
    mutationKey: ['password-reset', 'send-code'],
    mutationFn: (phoneNumber: string) => sendPasswordResetCode(phoneNumber),
    onSuccess: () => toast.success('인증번호를 보냈어요.'),
    onError: (err) =>
      toast.error(messageFromError(err, '인증번호 발송에 실패했어요.')),
  });

export const useVerifyPasswordResetCode = () =>
  useMutation({
    mutationKey: ['password-reset', 'verify'],
    mutationFn: ({
      phoneNumber,
      code,
    }: {
      phoneNumber: string;
      code: string;
    }) => verifyPasswordResetCode(phoneNumber, code),
    onSuccess: () => toast.success('인증이 완료되었어요.'),
    onError: (err) =>
      toast.error(messageFromError(err, '인증번호 확인에 실패했어요.')),
  });

export const useResetPassword = () =>
  useMutation({
    mutationKey: ['password-reset', 'submit'],
    mutationFn: ({
      phoneNumber,
      newPassword,
    }: {
      phoneNumber: string;
      newPassword: string;
    }) => resetPassword(phoneNumber, newPassword),
    onSuccess: () =>
      toast.success('비밀번호를 재설정했어요. 다시 로그인해주세요.'),
    onError: (err) =>
      toast.error(messageFromError(err, '비밀번호 재설정에 실패했어요.')),
  });
