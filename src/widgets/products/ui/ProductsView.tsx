'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, Loader2, Package, Trash2 } from 'lucide-react';
import { Button } from '@zaemoru/react';
import { AxiosError } from 'axios';
import {
  filterProducts,
  productPlaceName,
  useAdminProducts,
} from '@/entities/product';
import { Card, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Select } from '@/shared/ui/Select';
import { formatNumber } from '@/shared/lib/format';
import { useDebouncedValue } from '@/shared/lib/debounce';
import {
  PRODUCT_TYPE_KOR,
  productModeLabel,
  productModeOptions,
  productTypeOptions,
  type Product,
  type ProductMode,
  type ProductType,
} from '@/shared/types/product';
import { cn } from '@/shared/lib/cn';
import { DeleteProductDialog } from './DeleteProductDialog';

const ALL = '';

const requestErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401)
      return '로그인이 만료되었어요. 다시 로그인해주세요. (401)';
    if (status === 403) return '조회 권한이 없는 계정이에요. (403)';
    if (status === 404) return '서버에 판매 목록 API가 없어요. (404)';
    if (status) return `요청이 실패했어요. (${status})`;
    if (error.code === 'ERR_NETWORK') {
      return 'API 서버에 연결할 수 없어요. NEXT_PUBLIC_API_URL을 확인해주세요.';
    }
  }
  return '잠시 후 다시 시도해주세요.';
};

export function ProductsView() {
  const [type, setType] = useState<string>(ALL);
  const [mode, setMode] = useState<string>(ALL);
  const [keyword, setKeyword] = useState('');
  const [target, setTarget] = useState<Product | null>(null);
  const debouncedKeyword = useDebouncedValue(keyword, 250);

  const filter = useMemo(
    () => ({
      type: (type || undefined) as ProductType | undefined,
      mode: (mode || undefined) as ProductMode | undefined,
    }),
    [mode, type],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminProducts(filter);

  const loaded = useMemo(() => data?.pages.flat() ?? [], [data]);

  const products = useMemo(
    () => filterProducts(loaded, debouncedKeyword),
    [debouncedKeyword, loaded],
  );

  const keywordActive = !!debouncedKeyword.trim();
  const hasFilter = !!type || !!mode || keywordActive;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">판매 목록 관리</h1>
        <p className="text-body4 text-gray-600">
          동네 구분 없이 전체 게시글을 확인하고, 부적절한 게시글을 삭제해요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.5fr]">
        <Select
          label="구분"
          value={type || undefined}
          onChange={setType}
          placeholder="전체 구분"
          options={[{ value: ALL, label: '전체 구분' }, ...productTypeOptions]}
        />
        <Select
          label="유형"
          value={mode || undefined}
          onChange={setMode}
          placeholder="전체 유형"
          options={[{ value: ALL, label: '전체 유형' }, ...productModeOptions]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-label text-gray-700">게시글 검색</label>
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="제목 / 작성자 / 동네"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package size={18} className="text-main-600" />
            <h2 className="text-body1 text-gray-900">
              게시글 {data ? formatNumber(products.length) : '…'}건
            </h2>
            {isFetching && !isLoading ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : null}
          </div>
          {keywordActive && data ? (
            // 서버에 검색 파라미터가 없어서, 지금까지 불러온 범위 안에서만 걸러져요.
            <span className="text-caption text-gray-500">
              불러온 {formatNumber(loaded.length)}건에서 검색 중
            </span>
          ) : null}
        </CardHeader>

        {isLoading ? (
          <div className="flex flex-col gap-px p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-md bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          // 빈 목록과 요청 실패는 화면에서 구분돼야 해요.
          <EmptyState
            icon={<AlertCircle size={20} />}
            title="게시글을 불러오지 못했어요"
            description={requestErrorMessage(error)}
            action={
              <Button
                variant="secondary"
                size="medium"
                onClick={() => void refetch()}
              >
                다시 시도
              </Button>
            }
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package size={20} />}
            title="게시글이 없어요"
            description={
              hasFilter
                ? '검색어나 필터를 바꿔보세요.'
                : '아직 등록된 게시글이 없어요.'
            }
          />
        ) : (
          <div className="max-h-[640px] overflow-auto border-t border-gray-100">
            <table className="w-full min-w-[880px]">
              <thead className="sticky top-0 z-[1] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                <tr className="text-left text-caption text-gray-600">
                  <th className="px-6 py-3 font-medium">게시글</th>
                  <th className="px-3 py-3 font-medium">구분</th>
                  <th className="px-3 py-3 font-medium">유형</th>
                  <th className="px-3 py-3 font-medium">작성자</th>
                  <th className="px-3 py-3 font-medium">동네</th>
                  <th className="px-3 py-3 text-right font-medium">광산</th>
                  <th className="px-6 py-3 text-right font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="max-w-[320px] px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-body4 font-semibold text-gray-900">
                          {product.title}
                        </span>
                        {product.isCompleted && (
                          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-caption text-gray-600">
                            거래 완료
                          </span>
                        )}
                        {!product.isCompleted && product.isReserved && (
                          <span className="shrink-0 rounded-full bg-sub2-100 px-2 py-0.5 text-caption text-sub2-700">
                            예약중
                          </span>
                        )}
                      </div>
                      <p className="truncate text-caption text-gray-500">
                        {product.content}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-body5 text-gray-700">
                      {PRODUCT_TYPE_KOR[product.type]}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium',
                          product.mode === 'GIVER'
                            ? 'bg-main-100 text-main-700'
                            : 'bg-sub2-100 text-sub2-700',
                        )}
                      >
                        {productModeLabel(product.type, product.mode)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-body5 text-gray-700">
                      {product.member.nickname}
                    </td>
                    <td className="px-3 py-3 text-body5 text-gray-700">
                      {productPlaceName(product)}
                    </td>
                    <td className="px-3 py-3 text-right text-body4 font-semibold tabular-nums text-gray-900">
                      {formatNumber(product.gwangsan)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setTarget(product)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-body5 font-semibold text-error-500 transition hover:bg-red-100"
                      >
                        <Trash2 size={14} /> 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasNextPage && !isLoading ? (
          <div className="flex justify-center border-t border-gray-100 px-6 py-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => void fetchNextPage()}
              loading={isFetchingNextPage}
              disabled={isFetchingNextPage}
            >
              더 보기
            </Button>
          </div>
        ) : null}
      </Card>

      <DeleteProductDialog
        open={!!target}
        onClose={() => setTarget(null)}
        product={target}
      />
    </div>
  );
}
