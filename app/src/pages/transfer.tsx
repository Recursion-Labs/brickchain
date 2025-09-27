'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import TransferTokens from '@/components/TransferTokens';
import Navigation from '@/components/Navigation';

export default function TransferPage() {
  const { isConnected } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-gray-700">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <TransferTokens />
    </div>
  );
}