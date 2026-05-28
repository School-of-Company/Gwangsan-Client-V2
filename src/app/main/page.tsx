import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AlertsPanel } from '@/widgets/dashboard/ui/AlertsPanel';
import { MembersTable } from '@/widgets/dashboard/ui/MembersTable';

export const metadata = { title: '대시보드 · 광산 어드민' };

export default function MainPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">대시보드</h1>
        <p className="text-body4 text-gray-600">
          가입 승인, 신고, 회원 관리를 한 곳에서 처리해요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_360px)_minmax(0,_1fr)]">
        <AlertsPanel />
        <MembersTable />
      </div>

      <div className="flex justify-end">
        <Link
          href="/notice"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-body5 font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          공지 작성하러 가기
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
