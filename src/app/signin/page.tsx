import Image from 'next/image';
import { SignInForm } from '@/widgets/auth/ui/SignInForm';

export const metadata = {
  title: '로그인 · 광산 어드민',
};

export default function SignInPage() {
  return (
    <div className="-mx-6 -my-8 flex h-full min-h-[44rem] items-center justify-center bg-gradient-to-b from-main-100/40 via-white to-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/gwangsan-logo.png"
            alt="광산"
            width={56}
            height={56}
            className="mb-4 h-14 w-14"
            priority
          />
          <h1 className="text-titleLarge text-gray-900">광산 어드민</h1>
          <p className="mt-2 text-body4 text-gray-600">
            광산구 시민 화폐 광산 운영 콘솔
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-card">
          <SignInForm />
        </div>

        <p className="mt-6 text-center text-caption text-gray-500">
          관리자 계정으로만 로그인할 수 있어요.
        </p>
      </div>
    </div>
  );
}
