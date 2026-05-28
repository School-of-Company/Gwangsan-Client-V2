import { ProfileView } from '@/widgets/profile/ui/ProfileView';

export const metadata = { title: '회원 정보 · 광산 어드민' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  return <ProfileView memberId={id} />;
}
