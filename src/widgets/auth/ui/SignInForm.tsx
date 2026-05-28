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
import { authConfig, isAdminRole } from '@/shared/config/auth';

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

  const submit = () => {
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
        const token = res?.token;
        const accessToken = token?.accessToken;
        const refreshToken = token?.refreshToken;

        if (!accessToken || !refreshToken || !res?.role) {
          console.error(
            '[signin] unexpected response shape — expected { token: { accessToken, refreshToken }, role }, got:',
            res,
          );
          toast.error(
            '로그인 응답 형식이 예상과 달라요. 콘솔을 확인해주세요.',
          );
          return;
        }

        if (!isAdminRole(res.role)) {
          toast.error('관리자 권한이 없는 계정이에요.');
          return;
        }

        saveTokens({ accessToken, refreshToken });
        saveRole(res.role);
        router.replace(authConfig.homePage);
      },
    });
  };

  const submitting = signIn.isPending;

  // zaemoru Button renders an inner <button> inside Shadow DOM, so a form's
  // native submit doesn't bubble out. We trigger submit explicitly on click
  // and on Enter while focused inside the field group.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col gap-5" onKeyDown={handleKeyDown}>
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
        variant="primary"
        size="large"
        fullWidth
        disabled={submitting}
        loading={submitting}
        onClick={submit}
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
    </div>
  );
}
