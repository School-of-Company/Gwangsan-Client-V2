'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@zaemoru/react';
import { Check } from 'lucide-react';
import {
  passwordResetNewSchema,
  passwordResetPhoneSchema,
  passwordResetVerifySchema,
  useResetPassword,
  useSendPasswordResetCode,
  useVerifyPasswordResetCode,
} from '@/entities/user';
import { authConfig } from '@/shared/config/auth';
import { cn } from '@/shared/lib/cn';

type Step = 'phone' | 'code' | 'newPassword';
type ErrorField = 'phoneNumber' | 'code' | 'newPassword' | 'confirmPassword';

const STEPS: { id: Step; label: string }[] = [
  { id: 'phone', label: '전화번호' },
  { id: 'code', label: '인증번호' },
  { id: 'newPassword', label: '새 비밀번호' },
];

export function PasswordResetForm() {
  const router = useRouter();
  const sendCode = useSendPasswordResetCode();
  const verifyCode = useVerifyPasswordResetCode();
  const submitNewPassword = useResetPassword();

  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<ErrorField, string>>>({});

  const setError = (field: ErrorField, message?: string) =>
    setErrors((prev) => ({ ...prev, [field]: message ?? '' }));

  const stepIndex = useMemo(
    () => STEPS.findIndex((s) => s.id === step),
    [step],
  );

  const handleSendCode = () => {
    const parsed = passwordResetPhoneSchema.safeParse({ phoneNumber });
    if (!parsed.success) {
      setError('phoneNumber', parsed.error.issues[0]?.message);
      return;
    }
    setError('phoneNumber', '');
    sendCode.mutate(phoneNumber, { onSuccess: () => setStep('code') });
  };

  const handleVerifyCode = () => {
    const parsed = passwordResetVerifySchema.safeParse({ phoneNumber, code });
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === 'code');
      setError('code', issue?.message ?? '');
      return;
    }
    setError('code', '');
    verifyCode.mutate(
      { phoneNumber, code },
      { onSuccess: () => setStep('newPassword') },
    );
  };

  const handleResetPassword = () => {
    const parsed = passwordResetNewSchema.safeParse({
      phoneNumber,
      newPassword,
      confirmPassword,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const key = i.path[0] as ErrorField;
        if (!next[key]) next[key] = i.message;
      }
      setErrors((prev) => ({ ...prev, ...next }));
      return;
    }
    setErrors({});
    submitNewPassword.mutate(
      { phoneNumber, newPassword },
      { onSuccess: () => router.replace(authConfig.signInPage) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex items-center gap-2" aria-label="진행 단계">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-semibold transition',
                  done && 'bg-main-500 text-white',
                  current && 'bg-main-100 text-main-700 ring-2 ring-main-500',
                  !done && !current && 'bg-gray-100 text-gray-500',
                )}
                aria-current={current ? 'step' : undefined}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-body5 font-medium',
                  (done || current) ? 'text-gray-900' : 'text-gray-500',
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="ml-1 h-px flex-1 bg-gray-200" />
              )}
            </li>
          );
        })}
      </ol>

      {step === 'phone' && (
        <div className="flex flex-col gap-4">
          <TextField
            label="전화번호"
            type="tel"
            placeholder="01012345678"
            value={phoneNumber}
            onInput={(v) => setPhoneNumber(v.replace(/\D/g, ''))}
            invalid={!!errors['phoneNumber']}
            errorMessage={errors['phoneNumber']}
            helperText="가입하신 휴대폰 번호로 인증번호를 보내드려요."
            size="large"
          />
          <Button
            type="button"
            variant="primary"
            size="large"
            fullWidth
            loading={sendCode.isPending}
            disabled={sendCode.isPending}
            onClick={handleSendCode}
          >
            인증번호 받기
          </Button>
        </div>
      )}

      {step === 'code' && (
        <div className="flex flex-col gap-4">
          <TextField
            label="인증번호"
            type="text"
            placeholder="6자리 숫자"
            value={code}
            onInput={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            invalid={!!errors['code']}
            errorMessage={errors['code']}
            helperText={`${phoneNumber}로 보낸 인증번호를 입력해주세요.`}
            size="large"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={() => setStep('phone')}
              disabled={verifyCode.isPending || sendCode.isPending}
            >
              이전
            </Button>
            <div className="flex-1">
              <Button
                type="button"
                variant="primary"
                size="large"
                fullWidth
                loading={verifyCode.isPending}
                disabled={verifyCode.isPending}
                onClick={handleVerifyCode}
              >
                인증 확인
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => sendCode.mutate(phoneNumber)}
            disabled={sendCode.isPending || verifyCode.isPending}
            className="text-center text-body5 text-gray-600 underline-offset-4 transition hover:text-main-700 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            {sendCode.isPending ? '발송 중…' : '인증번호 다시 받기'}
          </button>
        </div>
      )}

      {step === 'newPassword' && (
        <div className="flex flex-col gap-4">
          <TextField
            label="새 비밀번호"
            type="password"
            placeholder="영문, 숫자 포함 8자 이상"
            value={newPassword}
            onInput={(v) => setNewPassword(v)}
            invalid={!!errors['newPassword']}
            errorMessage={errors['newPassword']}
            size="large"
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            placeholder="새 비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onInput={(v) => setConfirmPassword(v)}
            invalid={!!errors['confirmPassword']}
            errorMessage={errors['confirmPassword']}
            size="large"
          />
          <Button
            type="button"
            variant="primary"
            size="large"
            fullWidth
            loading={submitNewPassword.isPending}
            disabled={submitNewPassword.isPending}
            onClick={handleResetPassword}
          >
            비밀번호 재설정
          </Button>
        </div>
      )}
    </div>
  );
}
