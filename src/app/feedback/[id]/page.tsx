import { FeedbackDetailView } from '@/widgets/feedback/ui/FeedbackDetailView';

export const metadata = { title: '문의 상세 · 광산 어드민' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <FeedbackDetailView id={id} />;
}
