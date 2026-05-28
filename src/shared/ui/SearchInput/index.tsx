'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = '검색어를 입력해주세요',
  className,
  ariaLabel,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-main-500 focus-within:ring-2 focus-within:ring-main-100',
        className,
      )}
    >
      <Search size={18} className="text-gray-500" aria-hidden />
      <input
        aria-label={ariaLabel ?? placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => onChange('')}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
