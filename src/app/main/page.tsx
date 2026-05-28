import { AlertsPanel } from '@/widgets/dashboard/ui/AlertsPanel';
import { MembersTable } from '@/widgets/dashboard/ui/MembersTable';

export const metadata = { title: '대시보드 · 광산 어드민' };

export default function MainPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <header className="flex-shrink-0">
        <h1 className="text-titleMedium2 text-gray-900">대시보드</h1>
        <p className="text-body5 text-gray-600">
          가입 승인, 신고, 회원 관리를 한 곳에서 처리해요.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_360px)_minmax(0,_1fr)]">
        <AlertsPanel />
        <MembersTable />
      </div>
    </div>
  );
}
