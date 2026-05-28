'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/shared/lib/query';

// Note: don't import '@zaemoru/elements' here. Every '@zaemoru/react'
// component already does it transitively via internal/setup. Importing
// it a second time alongside `transpilePackages` produces two distinct
// module instances and triggers `CustomElementRegistry already has …`
// warnings + "Multiple versions of Lit loaded".
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-center" expand richColors closeButton />
    </QueryProvider>
  );
}
