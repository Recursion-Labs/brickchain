'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import VerifyOwnership from '@/components/VerifyOwnership';
import Navigation from '@/components/Navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
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
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to verify property ownership.
              </AlertDescription>
            </Alert>
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Wallet Not Connected
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Cardano wallet to access the verification features.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <VerifyOwnership />
        )}
      </div>
    </div>
  );
}