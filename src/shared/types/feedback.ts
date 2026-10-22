export const FEEDBACK_TYPES = [
  'BUG',
  'SUGGESTION',
  'TRADE',
  'ACCOUNT',
  'ETC',
] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const FEEDBACK_TYPE_KOR: Record<FeedbackType, string> = {
  BUG: '오류·버그',
  SUGGESTION: '기능 제안·개선',
  TRADE: '거래 관련',
  ACCOUNT: '계정·로그인',
  ETC: '기타',
};

export const feedbackTypeOptions = FEEDBACK_TYPES.map((value) => ({
  value,
  label: FEEDBACK_TYPE_KOR[value],
}));

export const FEEDBACK_STATUSES = ['RECEIVED', 'IN_PROGRESS', 'DONE'] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

/** 관리자가 직접 바꿀 수 있는 상태예요. (접수는 작성 시점에만 붙어요) */
export type FeedbackStatusUpdate = Exclude<FeedbackStatus, 'RECEIVED'>;

export const FEEDBACK_STATUS_KOR: Record<FeedbackStatus, string> = {
  RECEIVED: '접수',
  IN_PROGRESS: '처리 중',
  DONE: '답변 완료',
};

export const feedbackStatusOptions = FEEDBACK_STATUSES.map((value) => ({
  value,
  label: FEEDBACK_STATUS_KOR[value],
}));

export type OsType = 'IOS' | 'ANDROID';

export const OS_TYPE_KOR: Record<OsType, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
};

export interface FeedbackImage {
  imageId: number;
  imageUrl: string;
}

// 작성자 정보는 member 객체가 아니라 최상위 필드로 내려와요. (AdminFeedbackResponse)
export interface Feedback {
  feedbackId: number;
  memberId: number;
  nickname: string;
  placeName?: string | null;
  type: FeedbackType;
  content: string;
  images?: FeedbackImage[];
  appVersion?: string | null;
  osType?: OsType | null;
  osVersion?: string | null;
  deviceModel?: string | null;
  status: FeedbackStatus;
  answer?: string | null;
  answeredAt?: string | null;
  /** 답변한 관리자 닉네임 */
  answeredBy?: string | null;
  createdAt: string;
}
