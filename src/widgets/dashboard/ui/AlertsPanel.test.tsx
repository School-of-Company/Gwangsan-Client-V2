import { render, screen } from '@testing-library/react';
import { AlertsPanel } from './AlertsPanel';
import { useAlerts, useAcceptSignup, useCancelTrade, useDismissAlert } from '@/entities/alert';

jest.mock('@zaemoru/react', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/entities/alert', () => ({
  ...jest.requireActual('@/entities/alert'),
  useAlerts: jest.fn(),
  useAcceptSignup: jest.fn(),
  useCancelTrade: jest.fn(),
  useDismissAlert: jest.fn(),
}));

const idleMutation = () => ({
  mutate: jest.fn(),
  isPending: false,
  variables: undefined,
});

describe('AlertsPanel', () => {
  beforeEach(() => {
    (useAcceptSignup as jest.Mock).mockReturnValue(idleMutation());
    (useCancelTrade as jest.Mock).mockReturnValue(idleMutation());
    (useDismissAlert as jest.Mock).mockReturnValue(idleMutation());
  });

  it('renders pending signups from the server-shaped signUps field', () => {
    (useAlerts as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        signUps: [
          {
            id: 'a1',
            memberId: 1,
            nickname: '홍길동',
            title: '가입 요청',
            placeId: 1,
            recommenderNickname: '',
            created_at: '2026-01-01T00:00:00Z',
          },
        ],
        reports: [],
        tradeCancels: [],
      },
    });

    render(<AlertsPanel />);

    expect(screen.getByText('홍길동님이 가입을 요청했어요')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('모든 알림을 처리했어요')).not.toBeInTheDocument();
  });

  it('shows the empty state when every bucket is empty', () => {
    (useAlerts as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { signUps: [], reports: [], tradeCancels: [] },
    });

    render(<AlertsPanel />);

    expect(screen.getByText('모든 알림을 처리했어요')).toBeInTheDocument();
  });
});
