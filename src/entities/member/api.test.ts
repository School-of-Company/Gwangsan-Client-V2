import { api } from '@/shared/lib/api';
import type { Member } from '@/shared/types/member';
import { listMembers } from './api';

jest.mock('@/shared/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const member = (memberId: string, placeName: string | null): Member => ({
  memberId,
  nickname: memberId,
  name: memberId,
  phoneNumber: '01000000000',
  role: 'ROLE_USER',
  status: 'ACTIVE',
  joinedAt: '2026-01-01',
  gwangsan: 0,
  placeName,
});

describe('member api', () => {
  const getMock = api.get as jest.Mock;

  beforeEach(() => getMock.mockReset());

  it('passes head, place, and nickname filters without an exact placeName', async () => {
    getMock.mockResolvedValue({ data: [] });

    await listMembers({ headId: 12, placeId: 3, nickname: 'kim' });

    expect(getMock).toHaveBeenCalledWith('/member/all', {
      params: { headId: 12, nickname: 'kim', placeId: 3 },
    });
  });

  it('keeps members whose placeName differs only in suffix from the selected place', async () => {
    getMock.mockResolvedValue({
      data: [
        member('a', '신창동'),
        member('b', '신창지점'),
        member('c', '고실마을'),
        member('d', null),
      ],
    });

    const result = await listMembers({ placeId: 4 });

    expect(result.map((m) => m.memberId)).toEqual(['a', 'b']);
  });

  it('returns every member when no place is selected', async () => {
    const data = [member('a', '신창동'), member('b', '고실마을')];
    getMock.mockResolvedValue({ data });

    await expect(listMembers({})).resolves.toEqual(data);
  });
});
