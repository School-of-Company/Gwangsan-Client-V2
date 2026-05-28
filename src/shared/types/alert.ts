export type AlertKind = 'REPORT' | 'SIGNUP' | 'TRADE_CANCEL' | string;

export interface AdminAlert {
  id: number;
  type: AlertKind;
  title: string;
  message: string;
  targetId?: string | number;
  createdAt: string;
}
