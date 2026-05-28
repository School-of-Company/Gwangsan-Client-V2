import { api } from '@/shared/lib/api';
import type { UserToken } from '@/shared/lib/auth';

export interface SignInRequest {
  nickname: string;
  password: string;
}

export interface SignInResponse {
  token: UserToken;
  role: string;
}

export const signIn = (data: SignInRequest) =>
  api.post<SignInResponse>('/admin/signin', data).then((r) => r.data);

export const sendPasswordResetCode = (phoneNumber: string) =>
  api.post('/sms/password', { phoneNumber }).then((r) => r.data);

export const verifyPasswordResetCode = (phoneNumber: string, code: string) =>
  api.post('/sms/password/verify', { phoneNumber, code }).then((r) => r.data);

export const resetPassword = (phoneNumber: string, newPassword: string) =>
  api.patch('/auth/password', { phoneNumber, newPassword }).then((r) => r.data);

export const deleteAccount = () =>
  api.delete('/member').then((r) => r.data);
