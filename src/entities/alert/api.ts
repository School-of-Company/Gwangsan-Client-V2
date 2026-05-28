import { api } from '@/shared/lib/api';
import type { NoticeImage } from '@/shared/types/notice';

export type ReportType = 'FRAUD' | 'BAD_LANGUAGE' | 'MEMBER' | 'ETC';

export const REPORT_TYPE_KOR: Record<ReportType, string> = {
  FRAUD: '사기 신고',
  BAD_LANGUAGE: '욕설 신고',
  MEMBER: '회원 신고',
  ETC: '기타 신고',
};

export interface SignupAlert {
  id: string;
  memberId: number;
  nickname: string;
  title: string;
  placeId: number;
  recommenderNickname: string;
  created_at: string;
}

export interface ReportAlert {
  id: number;
  nickname: string;
  reportedMemberId: number;
  reportedMemberName: string;
  title: string;
  placeId: number;
  createdAt: string;
  report: {
    reportType: ReportType;
    content: string;
    reportId: number;
    images: NoticeImage[];
  };
}

export interface TradeCancelAlert {
  id: number;
  nickname: string;
  title: string;
  reason: string;
  placeId: number;
  createdAt: string;
  images: NoticeImage[];
  product: {
    id: number;
    title: string;
    content: string;
    gwangsan: number;
    type: 'OBJECT' | 'SERVICE';
    mode: 'GIVER' | 'RECEIVER';
    member: {
      memberId: number;
      nickname: string;
      placeId: number;
      light: number;
    };
  };
}

export interface AlertBucket {
  reports?: ReportAlert[];
  signups?: SignupAlert[];
  tradeCancels?: TradeCancelAlert[];
}

export const getAlerts = () =>
  api.get<AlertBucket>('/admin/alert').then((r) => r.data);

export const dismissAlert = (id: string | number) =>
  api.delete(`/admin/${id}`).then((r) => r.data);

export const acceptSignup = (id: string | number) =>
  api.patch(`/admin/verify/signup/${id}`).then((r) => r.data);

export const cancelTrade = (id: string | number) =>
  api.patch(`/admin/trade/${id}`).then((r) => r.data);
