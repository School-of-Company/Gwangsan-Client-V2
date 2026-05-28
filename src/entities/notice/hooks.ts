'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createNotice,
  deleteNotice,
  editNotice,
  getNotice,
  listNotices,
  uploadNoticeImages,
} from './api';
import type { NoticeForm } from './schema';

export const noticeKeys = {
  all: ['notices'] as const,
  detail: (id: string) => ['notices', 'detail', id] as const,
};

export const useNotices = () =>
  useQuery({ queryKey: noticeKeys.all, queryFn: listNotices });

export const useNotice = (id: string | null | undefined) =>
  useQuery({
    queryKey: noticeKeys.detail(id ?? ''),
    queryFn: () => getNotice(id as string),
    enabled: !!id,
  });

export const useCreateNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NoticeForm) => createNotice(data),
    onSuccess: () => {
      toast.success('공지를 작성했어요.');
      void qc.invalidateQueries({ queryKey: noticeKeys.all });
    },
    onError: () => toast.error('공지 작성에 실패했어요.'),
  });
};

export const useEditNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NoticeForm }) =>
      editNotice(id, data),
    onSuccess: (_d, { id }) => {
      toast.success('공지를 수정했어요.');
      void qc.invalidateQueries({ queryKey: noticeKeys.all });
      void qc.invalidateQueries({ queryKey: noticeKeys.detail(id) });
    },
    onError: () => toast.error('공지 수정에 실패했어요.'),
  });
};

export const useDeleteNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      toast.success('공지를 삭제했어요.');
      void qc.invalidateQueries({ queryKey: noticeKeys.all });
    },
    onError: () => toast.error('공지 삭제에 실패했어요.'),
  });
};

export const useUploadNoticeImages = () =>
  useMutation({
    mutationFn: (files: File[]) => uploadNoticeImages(files),
    onError: () => toast.error('이미지 업로드에 실패했어요.'),
  });
