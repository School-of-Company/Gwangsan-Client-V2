import { api } from '@/shared/lib/api';
import type {
  Feedback,
  FeedbackStatus,
  FeedbackStatusUpdate,
  FeedbackType,
} from '@/shared/types/feedback';

export const ADMIN_FEEDBACK_PAGE_SIZE = 20;

export interface FeedbackFilter {
  status?: FeedbackStatus;
  type?: FeedbackType;
  /** 본점 관리자만 써요. 지점 관리자의 조회 범위는 서버가 정해요. */
  placeId?: number;
}

export interface FeedbackPageParams extends FeedbackFilter {
  /** 커서. 직전 페이지 마지막 문의의 feedbackId (목록은 최신순) */
  lastId?: number;
  size?: number;
}

export const listAdminFeedback = async ({
  status,
  type,
  placeId,
  lastId,
  size = ADMIN_FEEDBACK_PAGE_SIZE,
}: FeedbackPageParams = {}): Promise<Feedback[]> => {
  const params: Record<string, string | number> = { size };
  if (status) params['status'] = status;
  if (type) params['type'] = type;
  if (placeId) params['place_id'] = placeId;
  if (lastId) params['last_id'] = lastId;
  const { data } = await api.get<Feedback[]>('/admin/feedback', { params });
  return data;
};

export const getAdminFeedback = async (
  feedbackId: number,
): Promise<Feedback> => {
  const { data } = await api.get<Feedback>(`/admin/feedback/${feedbackId}`);
  return data;
};

export const answerAdminFeedback = async (
  feedbackId: number,
  answer: string,
): Promise<void> => {
  await api.patch(`/admin/feedback/${feedbackId}/answer`, { answer });
};

export const updateAdminFeedbackStatus = async (
  feedbackId: number,
  status: FeedbackStatusUpdate,
): Promise<void> => {
  await api.patch(`/admin/feedback/${feedbackId}/status`, { status });
};
