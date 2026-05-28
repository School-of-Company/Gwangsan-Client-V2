'use client';

import { useState } from 'react';
import { Coins, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useMember } from '@/entities/member';
import { BackHeader } from '@/shared/ui/BackHeader';
import { Card, CardBody } from '@/shared/ui/Card';
import { RoleBadge } from '@/shared/ui/RoleBadge';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { formatDate, formatNumber, formatPhone } from '@/shared/lib/format';
import { placeLabel } from '@/shared/constants/place';
import { RoleDialog } from './RoleDialog';
import { StatusDialog } from './StatusDialog';

interface ProfileViewProps {
  memberId: string;
}

export function ProfileView({ memberId }: ProfileViewProps) {
  const { data, isLoading, isError } = useMember(memberId);
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <div className="-mx-6 -mt-8">
      <BackHeader title="회원 정보" fallbackHref="/main" />

      <div className="mx-auto max-w-3xl px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ) : isError || !data ? (
          <Card>
            <CardBody>
              <p className="text-center text-body4 text-gray-700">
                회원 정보를 불러오지 못했어요.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-5">
            <Card>
              <CardBody className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-main-100 text-titleSmall font-semibold text-main-700">
                  {data.nickname.slice(0, 1) || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-titleSmall text-gray-900">
                      {data.nickname}
                    </h1>
                    <span className="text-body5 text-gray-500">
                      · {data.name}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RoleBadge role={data.role} />
                    <StatusBadge status={data.status} />
                    <span className="text-body5 text-gray-600">
                      {placeLabel(data.placeId)}
                    </span>
                  </div>
                </div>
                <div className="hidden flex-col items-end gap-0.5 text-right md:flex">
                  <span className="text-caption text-gray-500">광산</span>
                  <span className="inline-flex items-center gap-1 text-titleSmall font-semibold text-main-700 tabular-nums">
                    <Coins size={16} />
                    {formatNumber(data.gwangsan ?? 0)}
                  </span>
                </div>
              </CardBody>
            </Card>

            <Card>
              <ul className="divide-y divide-gray-100">
                <Row
                  icon={<Phone size={16} />}
                  label="전화번호"
                  value={formatPhone(data.phoneNumber)}
                />
                <Row
                  icon={<UserRound size={16} />}
                  label="가입일"
                  value={formatDate(data.joinedAt)}
                />
                <Row
                  icon={<Coins size={16} />}
                  label="광산 포인트"
                  value={`${formatNumber(data.gwangsan ?? 0)} 광산`}
                />
                <Row
                  icon={<ShieldCheck size={16} />}
                  label="회원 ID"
                  value={data.memberId}
                  mono
                />
              </ul>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setStatusOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-body4 font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
              >
                상태 변경
              </button>
              <button
                type="button"
                onClick={() => setRoleOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-main-500 px-4 text-body4 font-medium text-white transition hover:bg-main-600"
              >
                역할 변경
              </button>
            </div>

            <RoleDialog
              open={roleOpen}
              onClose={() => setRoleOpen(false)}
              memberId={data.memberId}
              currentRole={data.role}
              currentPlaceId={data.placeId}
            />
            <StatusDialog
              open={statusOpen}
              onClose={() => setStatusOpen(false)}
              memberId={data.memberId}
              currentStatus={data.status}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-6 py-4">
      <span className="inline-flex items-center gap-2 text-body4 text-gray-600">
        <span className="text-gray-500">{icon}</span>
        {label}
      </span>
      <span
        className={
          'text-body4 font-medium text-gray-900 ' +
          (mono ? 'font-mono text-body5' : '')
        }
      >
        {value}
      </span>
    </li>
  );
}
