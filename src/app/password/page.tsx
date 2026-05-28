import Link from 'next/link';
import { PasswordResetForm } from '@/widgets/auth/ui/PasswordResetForm';

export const metadata = { title: '비밀번호 재설정 · 광산 어드민' };

export default function PasswordResetPage() {
  return (
    <div className="-mx-6 -my-8 flex h-full min-h-[44rem] items-center justify-center bg-gradient-to-b from-main-100/40 via-white to-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-titleLarge text-gray-900">비밀번호 재설정</h1>
          <p className="mt-2 text-body4 text-gray-600">
            가입한 휴대폰 번호로 인증 후 새 비밀번호를 설정해요.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-card">
          <PasswordResetForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/signin"
            className="text-body5 text-gray-600 underline-offset-4 hover:text-main-700 hover:underline"
          >
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
