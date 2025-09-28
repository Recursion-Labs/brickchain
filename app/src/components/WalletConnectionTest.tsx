'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Network,
  Coins,
  Wallet,
  RefreshCw
} from 'lucide-react';

export default function WalletConnectionTest() {
  const {
    isConnected,
    isConnecting,
    address,
    balance,
    networkId,
    error,
    walletName,
    refreshBalance,
    switchToMidnightTestnet
  } = useWallet();

  const [testResults, setTestResults] = useState<{
    connection: boolean;
    network: boolean;
    balance: boolean;
    midnight: boolean;
  }>({
    connection: false,
    network: false,
    balance: false,
    midnight: false
  });

  const runConnectionTest = async () => {
    const results = {
      connection: isConnected,
      network: networkId === 0,
      balance: balance !== null && parseFloat(balance) > 0,
      midnight: networkId === 0 && isConnected
    };
    
    setTestResults(results);
    
    // Test Midnight network validation
    if (results.connection && results.network) {
      try {
        await switchToMidnightTestnet();
        setTestResults(prev => ({ ...prev, midnight: true }));
      } catch (err) {
        setTestResults(prev => ({ ...prev, midnight: false }));
      }
    }
  };

  const getTestStatus = (test: boolean) => {
    return test ? (
      <CheckCircle2 className="h-4 w-4 text-green-400" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-400" />
    );
  };

  const getTestBadge = (test: boolean) => {
    return (
      <Badge variant={test ? "default" : "destructive"} className="text-xs">
        {test ? "Pass" : "Fail"}
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <TestTube className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Wallet Connection Test</CardTitle>
            <CardDescription className="text-gray-300">
              Verify your wallet setup for Midnight development
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Test Button */}
        <Button
          onClick={runConnectionTest}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <TestTube className="h-4 w-4 mr-2" />
          )}
          Run Connection Test
        </Button>

        {/* Test Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Test Results</h4>
          
          {/* Connection Test */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-purple-500/10">
            <div className="flex items-center gap-2">
              {getTestStatus(testResults.connection)}
              <span className="text-sm text-gray-300">Wallet Connection</span>
            </div>
            <div className="flex items-center gap-2">
              {getTestBadge(testResults.connection)}
              <span className="text-xs text-gray-400">
                {isConnected ? `Connected: ${walletName}` : 'Not connected'}
              </span>
            </div>
          </div>

          {/* Network Test */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-purple-500/10">
            <div className="flex items-center gap-2">
              {getTestStatus(testResults.network)}
              <span className="text-sm text-gray-300">Testnet Network</span>
            </div>
            <div className="flex items-center gap-2">
              {getTestBadge(testResults.network)}
              <span className="text-xs text-gray-400">
                Network ID: {networkId !== null ? networkId : 'Unknown'}
              </span>
            </div>
          </div>

          {/* Balance Test */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-purple-500/10">
            <div className="flex items-center gap-2">
              {getTestStatus(testResults.balance)}
              <span className="text-sm text-gray-300">Test ADA Balance</span>
            </div>
            <div className="flex items-center gap-2">
              {getTestBadge(testResults.balance)}
              <span className="text-xs text-gray-400">
                {balance ? `${(parseFloat(balance) / 1_000_000).toFixed(2)} ADA` : '0 ADA'}
              </span>
            </div>
          </div>

          {/* Midnight Compatibility Test */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-purple-500/10">
            <div className="flex items-center gap-2">
              {getTestStatus(testResults.midnight)}
              <span className="text-sm text-gray-300">Midnight Ready</span>
            </div>
            <div className="flex items-center gap-2">
              {getTestBadge(testResults.midnight)}
              <span className="text-xs text-gray-400">
                {testResults.midnight ? 'ZK features available' : 'Setup required'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-slate-800/30 p-3 rounded-lg border border-purple-500/10">
          <h5 className="text-sm font-medium text-white mb-2">Current Status</h5>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Wallet:</span>
              <span>{walletName || 'Not connected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Address:</span>
              <span>{address ? `${address.substring(0, 12)}...` : 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span>{networkId === 0 ? 'Testnet' : networkId === 1 ? 'Mainnet' : 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance:</span>
              <span>{balance ? `${(parseFloat(balance) / 1_000_000).toFixed(6)} ADA` : '0 ADA'}</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="border-red-500/30 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <p className="font-semibold">Test Error</p>
              <p className="text-sm">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshBalance}
            disabled={!isConnected}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://faucet.preprod.cardano.org/faucet', '_blank')}
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            <Coins className="h-3 w-3 mr-1" />
            Get Test ADA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}