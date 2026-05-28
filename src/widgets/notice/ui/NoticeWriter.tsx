'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ImagePlus, Pencil, X } from 'lucide-react';
import { Button } from '@zaemoru/react';
import {
  noticeSchema,
  useCreateNotice,
  useEditNotice,
  useNotice,
  useUploadNoticeImages,
  type NoticeForm,
} from '@/entities/notice';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Select } from '@/shared/ui/Select';
import { placeOptions } from '@/shared/constants/place';
import { cn } from '@/shared/lib/cn';

const TITLE_MAX = 100;
const CONTENT_MAX = 1000;

interface ImagePreview {
  id: number;
  url: string;
  objectUrl?: boolean;
}

export function NoticeWriter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get('id');
  const isEditing = !!editingId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef(new Set<string>());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [placeId, setPlaceId] = useState<string>('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: existing } = useNotice(editingId);
  const uploadImages = useUploadNoticeImages();
  const createNotice = useCreateNotice();
  const editNotice = useEditNotice();

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setPlaceId(String(existing.place));
      setImages(
        (existing.images ?? []).map((img) => ({
          id: img.imageId,
          url: img.imageUrl,
          objectUrl: false,
        })),
      );
    }
  }, [existing]);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    const files = Array.from(e.currentTarget.files);
    if (files.length === 0) return;
    const newIds = await uploadImages.mutateAsync(files);
    const previews = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);
      return {
        id: newIds[i],
        url,
        objectUrl: true,
      };
    });
    setImages((prev) => [...prev, ...previews]);
    e.currentTarget.value = '';
  };

  const removeImage = (id: number) =>
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.objectUrl) {
        URL.revokeObjectURL(target.url);
        objectUrlsRef.current.delete(target.url);
      }
      return prev.filter((img) => img.id !== id);
    });

  const reset = () => {
    objectUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    objectUrlsRef.current.clear();
    setTitle('');
    setContent('');
    setPlaceId('');
    setImages([]);
    setErrors({});
  };

  const submit = () => {
    const payload: NoticeForm = {
      title,
      content,
      placeId: Number(placeId),
      imageIds: images.map((img) => img.id),
    };
    const parsed = noticeSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const key = i.path[0] as string;
        if (!next[key]) next[key] = i.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    if (isEditing && editingId) {
      editNotice.mutate(
        { id: editingId, data: parsed.data },
        {
          onSuccess: () => {
            reset();
            router.push('/notice');
          },
        },
      );
    } else {
      createNotice.mutate(parsed.data, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  const submitting = createNotice.isPending || editNotice.isPending;

  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Pencil size={18} className="text-main-600" />
          <h2 className="text-body1 text-gray-900">
            {isEditing ? '공지 수정' : '공지 작성'}
          </h2>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              reset();
              router.push('/notice');
            }}
            className="rounded-lg px-2.5 py-1.5 text-body5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            새 공지 작성
          </button>
        )}
      </CardHeader>

      <CardBody className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5">
          <Field
            label="제목"
            error={errors.title}
            hint={`${title.length} / ${TITLE_MAX}`}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="제목을 입력하세요"
              className={cn(
                'h-11 w-full rounded-xl border bg-white px-3 text-body4 text-gray-900 transition placeholder:text-gray-400 focus:outline-none focus:ring-2',
                errors.title
                  ? 'border-error-500 focus:ring-red-100'
                  : 'border-gray-200 focus:border-main-500 focus:ring-main-100',
              )}
            />
          </Field>

          <Field
            label="내용"
            error={errors.content}
            hint={`${content.length} / ${CONTENT_MAX}`}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
              placeholder="내용을 입력하세요"
              rows={6}
              className={cn(
                'w-full rounded-xl border bg-white px-3 py-2.5 text-body4 text-gray-900 transition placeholder:text-gray-400 focus:outline-none focus:ring-2',
                errors.content
                  ? 'border-error-500 focus:ring-red-100'
                  : 'border-gray-200 focus:border-main-500 focus:ring-main-100',
              )}
            />
          </Field>

          <Select
            label="대상 지점"
            value={placeId || undefined}
            onChange={setPlaceId}
            placeholder="대상 지점을 선택해주세요"
            options={placeOptions}
          />
          {errors.placeId && (
            <p className="-mt-3 text-caption text-error-500">
              {errors.placeId}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-label text-gray-700">첨부 이미지</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImages.isPending}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 transition hover:border-main-400 hover:bg-main-100/30 hover:text-main-700"
              >
                <ImagePlus size={18} />
                <span className="text-caption">
                  {uploadImages.isPending ? '업로드 중' : '추가'}
                </span>
              </button>
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-100 bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt="첨부 이미지"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    aria-label="이미지 제거"
                    onClick={() => removeImage(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="large"
            fullWidth
            loading={submitting}
            disabled={submitting}
            onClick={submit}
          >
            {isEditing ? '수정하기' : '게시하기'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-label text-gray-700">{label}</label>
        {hint && <span className="text-caption text-gray-500">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-caption text-error-500">{error}</p>}
    </div>
  );
}
