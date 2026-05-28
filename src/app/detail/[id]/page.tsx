import { NoticeDetailView } from '@/widgets/notice-detail/ui/NoticeDetailView';

export const metadata = { title: '공지 상세 · 광산 어드민' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetailView id={id} />;
}
