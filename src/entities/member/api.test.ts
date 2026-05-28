import { api } from '@/shared/lib/api';
import { listMembers } from './api';

jest.mock('@/shared/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('member api', () => {
  it('passes head, place, and nickname filters to the members endpoint', async () => {
    const getMock = api.get as jest.Mock;
    getMock.mockResolvedValue({ data: [] });

    await listMembers({ headId: 12, placeId: 3, nickname: 'kim' });

    expect(getMock).toHaveBeenCalledWith('/member/all', {
      params: { headId: 12, nickname: 'kim', placeId: 3 },
    });
  });
});
