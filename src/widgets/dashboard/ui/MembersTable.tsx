'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useMembers } from '@/entities/member';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { RoleBadge } from '@/shared/ui/RoleBadge';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { SearchInput } from '@/shared/ui/SearchInput';
import { Select } from '@/shared/ui/Select';
import { placeLabel, placeOptions } from '@/shared/constants/place';
import { formatNumber, formatPhone } from '@/shared/lib/format';
import { getRole } from '@/shared/lib/auth';

const ALL_PLACES = '__all__';

export function MembersTable() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [debouncedNickname, setDebouncedNickname] = useState('');
  const [placeId, setPlaceId] = useState<string>(ALL_PLACES);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedNickname(nickname.trim()), 250);
    return () => clearTimeout(t);
  }, [nickname]);

  const filter = useMemo(
    () => ({
      nickname: debouncedNickname || undefined,
      placeId: placeId !== ALL_PLACES ? Number(placeId) : undefined,
    }),
    [debouncedNickname, placeId],
  );

  const { data, isLoading } = useMembers(filter);

  const showPlaceFilter = role !== 'ROLE_PLACE_ADMIN';

  const reset = () => {
    setNickname('');
    setPlaceId(ALL_PLACES);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users size={18} className="text-main-600" />
          <h2 className="text-body1 text-gray-900">회원 목록</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-caption font-semibold text-gray-700">
            {data ? formatNumber(data.length) : '…'}
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-2.5 py-1.5 text-body5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          초기화
        </button>
      </CardHeader>

      <CardBody className="flex flex-col gap-3 pb-3">
        <SearchInput
          value={nickname}
          onChange={setNickname}
          placeholder="닉네임 / 이름 검색"
        />
        {showPlaceFilter && (
          <Select
            value={placeId === ALL_PLACES ? undefined : placeId}
            onChange={(v) => setPlaceId(v || ALL_PLACES)}
            placeholder="전체 지점"
            options={[
              { value: '', label: '전체 지점' },
              ...placeOptions,
            ]}
          />
        )}
      </CardBody>

      <div className="border-t border-gray-100">
        {isLoading ? (
          <SkeletonRows />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="조건에 맞는 회원이 없어요"
            description="검색어와 지점 필터를 다시 확인해주세요."
          />
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-[1] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                <tr className="text-left text-caption text-gray-600">
                  <th className="px-6 py-3 font-medium">회원</th>
                  <th className="px-3 py-3 font-medium">역할</th>
                  <th className="px-3 py-3 font-medium">상태</th>
                  <th className="px-3 py-3 text-right font-medium">광산</th>
                  <th className="px-6 py-3 font-medium">지점</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr
                    key={m.memberId}
                    onClick={() => router.push(`/profile/${m.memberId}`)}
                    className="cursor-pointer border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-main-100 text-body4 font-semibold text-main-700">
                          {m.nickname.slice(0, 1) || '?'}
                        </div>
                        <div className="min-w-0">
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
                    <td className="px-3 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-3 py-3 text-right text-body4 font-semibold text-gray-900 tabular-nums">
                      {formatNumber(m.gwangsan ?? 0)}
                    </td>
                    <td className="px-6 py-3 text-body5 text-gray-700">
                      {placeLabel(m.placeId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-px p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-md bg-gray-100" />
      ))}
    </div>
  );
}
