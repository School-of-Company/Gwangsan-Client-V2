'use client';

import { ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/shared/lib/query';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Register zaemoru custom elements on the client. Importing on mount
    // avoids SSR issues with the underlying Lit components.
    void import('@zaemoru/elements');
  }, []);

  return (
    <QueryProvider>
      {children}
      <Toaster position="top-center" expand richColors closeButton />
    </QueryProvider>
  );
}
