'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { NoticeImage } from '@/shared/types/notice';
import { cn } from '@/shared/lib/cn';

interface NoticeImageGalleryProps {
  images: NoticeImage[];
}

export function NoticeImageGallery({ images }: NoticeImageGalleryProps) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const image = images[index];
  if (!image) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          key={image.imageId}
          src={image.imageUrl}
          alt={`공지 이미지 ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
          priority={index === 0}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="이전 이미지"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="다음 이미지"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-0.5 text-caption text-white backdrop-blur">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.imageId}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition',
                i === index
                  ? 'border-main-500'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={img.imageUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
