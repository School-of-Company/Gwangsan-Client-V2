import { z } from 'zod';

export const signInSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '별칭을 입력해주세요.')
    .regex(/^[가-힣A-Za-z0-9]+$/, '별칭은 한글·영문·숫자만 사용해요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});
export type SignInForm = z.infer<typeof signInSchema>;

const phone = z
  .string()
  .trim()
  .regex(/^010\d{8}$/, '010으로 시작하는 11자리 숫자를 입력해주세요.');

const code = z.string().trim().length(6, '인증번호 6자리를 입력해주세요.');

const newPassword = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이에요.')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/,
    '영문과 숫자를 모두 포함해야 해요.',
  );

export const passwordResetPhoneSchema = z.object({ phoneNumber: phone });
export const passwordResetVerifySchema = z.object({
  phoneNumber: phone,
  code,
});
export const passwordResetNewSchema = z
  .object({
    phoneNumber: phone,
    newPassword,
    confirmPassword: z.string().min(1, '비밀번호를 다시 입력해주세요.'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['confirmPassword'],
  });
