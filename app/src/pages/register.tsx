'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import RegisterProperty from '@/components/RegisterProperty';
import Navigation from '@/components/Navigation';

export default function RegisterPage() {
  const { isConnected } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-white">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <RegisterProperty />
    </div>
  );
}