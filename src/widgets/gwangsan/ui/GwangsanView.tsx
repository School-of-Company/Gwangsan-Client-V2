'use client';

import { useMemo, useState } from 'react';
import { Coins, Minus, Plus, Users } from 'lucide-react';
import { useMembers } from '@/entities/member';
import { Card, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Select } from '@/shared/ui/Select';
import { RoleBadge } from '@/shared/ui/RoleBadge';
import { headOptions, placeOptions } from '@/shared/constants/place';
import { formatNumber, formatPhone } from '@/shared/lib/format';
import type { Member } from '@/shared/types/member';
import { AdjustModal } from './AdjustModal';

const ALL = '__all__';

export function GwangsanView() {
  const [head, setHead] = useState<string>(headOptions[0]?.value ?? '');
  const [placeId, setPlaceId] = useState<string>(ALL);
  const [nickname, setNickname] = useState('');
  const [modal, setModal] = useState<{ member: Member; mode: 'add' | 'subtract' } | null>(null);

  const filter = useMemo(
    () => ({
      nickname: nickname.trim() || undefined,
      placeId: placeId !== ALL ? Number(placeId) : undefined,
    }),
    [nickname, placeId],
  );

  const { data, isLoading } = useMembers(filter);

  const total = useMemo(
    () => data?.reduce((sum, m) => sum + (m.gwangsan ?? 0), 0) ?? 0,
    [data],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-titleMedium2 text-gray-900">광산 관리</h1>
        <p className="text-body4 text-gray-600">
          회원의 광산 포인트를 추가하거나 차감해요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.5fr]">
        <Select
          label="본점"
          value={head}
          onChange={setHead}
          options={headOptions}
        />
        <Select
          label="지점"
          value={placeId === ALL ? undefined : placeId}
          onChange={(v) => setPlaceId(v || ALL)}
          placeholder="전체 지점"
          options={[{ value: '', label: '전체 지점' }, ...placeOptions]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-label text-gray-700">회원 검색</label>
          <SearchInput
            value={nickname}
            onChange={setNickname}
            placeholder="닉네임 / 이름"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-main-600" />
            <h2 className="text-body1 text-gray-900">
              회원 {data ? formatNumber(data.length) : '…'}명
            </h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-main-100 px-3 py-1 text-body5 font-semibold text-main-700">
            <Coins size={14} />
            <span className="tabular-nums">총 {formatNumber(total)} 광산</span>
          </div>
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
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="회원이 없어요"
            description="다른 본점이나 지점을 선택해보세요."
          />
        ) : (
          <div className="max-h-[640px] overflow-y-auto border-t border-gray-100">
            <table className="w-full">
              <thead className="sticky top-0 z-[1] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                <tr className="text-left text-caption text-gray-600">
                  <th className="px-6 py-3 font-medium">회원</th>
                  <th className="px-3 py-3 font-medium">역할</th>
                  <th className="px-3 py-3 text-right font-medium">광산</th>
                  <th className="px-6 py-3 text-right font-medium">조정</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr
                    key={m.memberId}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-main-100 text-body4 font-semibold text-main-700">
                          {m.nickname.slice(0, 1) || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-body4 font-semibold text-gray-900">
                              {m.nickname}
                            </span>
                            <span className="text-caption text-gray-500">
                              · {m.name}
                            </span>
                          </div>
                          <p className="text-caption text-gray-500">
                            {formatPhone(m.phoneNumber)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <RoleBadge role={m.role} />
                    </td>
                    <td className="px-3 py-3 text-right text-body3 font-semibold text-gray-900 tabular-nums">
                      {formatNumber(m.gwangsan ?? 0)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ member: m, mode: 'add' })}
                          className="inline-flex items-center gap-1 rounded-lg bg-main-100 px-3 py-1.5 text-body5 font-semibold text-main-700 transition hover:bg-main-200"
                        >
                          <Plus size={14} /> 추가
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModal({ member: m, mode: 'subtract' })
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-body5 font-semibold text-error-500 transition hover:bg-red-100"
                        >
                          <Minus size={14} /> 차감
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AdjustModal
        open={!!modal}
        onClose={() => setModal(null)}
        member={modal?.member ?? null}
        mode={modal?.mode ?? 'add'}
      />
    </div>
  );
}
