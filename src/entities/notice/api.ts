import { api } from '@/shared/lib/api';
import type { NoticeDetail, NoticeSummary } from '@/shared/types/notice';
import type { NoticeForm } from './schema';

export const listNotices = (): Promise<NoticeSummary[]> =>
  api.get<NoticeSummary[]>('/notice').then((r) => r.data);

export const getNotice = (id: string): Promise<NoticeDetail> =>
  api.get<NoticeDetail>(`/notice/${id}`).then((r) => r.data);

export const createNotice = (data: NoticeForm) =>
  api.post('/notice', data).then((r) => r.data);

export const editNotice = (id: string, data: NoticeForm) =>
  api.patch(`/notice/${id}`, data).then((r) => r.data);

export const deleteNotice = (id: string) =>
  api.delete(`/notice/${id}`).then((r) => r.data);

export const uploadNoticeImages = async (files: File[]): Promise<number[]> => {
  const responses = await Promise.all(
    files.map((file) =>
      api
        .postForm<{ imageId: number }>(
          '/image',
          { file },
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        .then((r) => r.data.imageId),
    ),
  );
  return responses;
};
