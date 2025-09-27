'use client';

import { ReactNode } from 'react';
import { MeshProvider } from '@meshsdk/react';

interface WalletConnectionProviderProps {
  children: ReactNode;
}

export default function WalletConnectionProvider({ children }: WalletConnectionProviderProps) {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  );
}