import { z } from 'zod';

export const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(100, '최대 100자까지 입력할 수 있어요.'),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해주세요.')
    .max(1000, '최대 1000자까지 입력할 수 있어요.'),
  placeId: z.number().int().positive('지역을 선택해주세요.'),
  imageIds: z.array(z.number().int().positive()).default([]),
});

export type NoticeForm = z.infer<typeof noticeSchema>;
