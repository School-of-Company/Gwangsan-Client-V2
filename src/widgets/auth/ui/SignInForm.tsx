'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, TextField } from '@zaemoru/react';
import { toast } from 'sonner';
import {
  signInSchema,
  useSignIn,
  type SignInForm as SignInFormData,
} from '@/entities/user';
import { saveRole, saveTokens } from '@/shared/lib/auth';
import { authConfig } from '@/shared/config/auth';
import { isAdminRole } from '@/shared/config/auth';

type FieldErrors = Partial<Record<keyof SignInFormData, string>>;

export function SignInForm() {
  const router = useRouter();
  const signIn = useSignIn();

  const [values, setValues] = useState<SignInFormData>({
    nickname: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = (key: keyof SignInFormData, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SignInFormData;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    signIn.mutate(parsed.data, {
      onSuccess: (res) => {
        if (!isAdminRole(res.role)) {
          toast.error('관리자 권한이 없는 계정이에요.');
          return;
        }
        saveTokens(res.token);
        saveRole(res.role);
        router.replace(authConfig.homePage);
        router.refresh();
      },
    });
  };

  const submitting = signIn.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-3">
        <TextField
          label="별칭"
          placeholder="별칭을 입력해 주세요"
          value={values.nickname}
          onInput={(v) => update('nickname', v)}
          autoComplete="username"
          invalid={!!errors.nickname}
          errorMessage={errors.nickname}
          size="large"
        />
        <TextField
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={values.password}
          onInput={(v) => update('password', v)}
          autoComplete="current-password"
          invalid={!!errors.password}
          errorMessage={errors.password}
          size="large"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        fullWidth
        disabled={submitting}
        loading={submitting}
      >
        로그인
      </Button>

      <div className="flex items-center justify-center">
        <Link
          href="/password"
          className="text-body5 text-gray-600 underline-offset-4 hover:text-main-700 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </form>
  );
}
