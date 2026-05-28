import type { MemberRole } from '@/shared/constants/role';

export interface NoticeImage {
  imageId: number;
  imageUrl: string;
}

export interface NoticeSummary {
  id: number;
  title: string;
  content: string;
  images?: NoticeImage[];
}

export interface NoticeDetail extends NoticeSummary {
  place: number;
  createdAt: string;
  role: MemberRole;
  isMe: boolean;
}
