'use client';

import { useState, useEffect } from 'react';
import { useWallet, formatADA, formatAddress } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Wallet,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Coins,
  Network,
  ExternalLink,
  ArrowRight,
  Moon,
  Zap
} from 'lucide-react';

export default function WalletConnect() {
  const {
    isConnected,
    isConnecting,
    address,
    balance,
    networkId,
    error,
    walletName,
    disconnect
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [isConnectingLuna, setIsConnectingLuna] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show user form after wallet connection
  useEffect(() => {
    if (isConnected && !showUserForm) {
      setShowUserForm(true);
    }
  }, [isConnected]);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address && typeof window !== 'undefined') {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if Lace Midnight Preview wallet API is available (injected by extension)
  const isLaceWalletAvailable = (): boolean => {
    return typeof window !== 'undefined' && 
           typeof (window as any).cardano !== 'undefined' && 
           (
             // Check for Lace Midnight Preview (might use different namespace)
             (typeof (window as any).cardano.lace !== 'undefined' &&
              typeof (window as any).cardano.lace.enable === 'function') ||
             // Alternative namespace possibilities for Midnight Preview
             (typeof (window as any).cardano.laceMidnight !== 'undefined' &&
              typeof (window as any).cardano.laceMidnight.enable === 'function') ||
             (typeof (window as any).cardano['lace-midnight-preview'] !== 'undefined' &&
              typeof (window as any).cardano['lace-midnight-preview'].enable === 'function')
           );
  };

  // Wait for wallet injection (extensions need time to inject APIs)
  const waitForWalletInjection = (timeout = 3000): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isLaceWalletAvailable()) {
        resolve(true);
        return;
      }

      const checkInterval = setInterval(() => {
        if (isLaceWalletAvailable()) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          resolve(true);
        }
      }, 100);

      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, timeout);
    });
  };

  // Debug function to check Lace Midnight Preview wallet API
  const debugLaceExtension = () => {
    console.log('=== Lace Midnight Preview Wallet API Debug ===');
    console.log('window.cardano exists:', typeof (window as any).cardano !== 'undefined');
    console.log('window.cardano.lace exists:', typeof (window as any).cardano?.lace !== 'undefined');
    console.log('window.cardano.laceMidnight exists:', typeof (window as any).cardano?.laceMidnight !== 'undefined');
    console.log('window.cardano["lace-midnight-preview"] exists:', typeof (window as any).cardano?.['lace-midnight-preview'] !== 'undefined');
    
    // Check regular lace namespace (might still be used by Midnight Preview)
    if ((window as any).cardano?.lace) {
      const lace = (window as any).cardano.lace;
      console.log('✅ Lace wallet API detected (standard namespace)');
      console.log('Lace API object:', lace);
      console.log('Has enable method:', typeof lace.enable === 'function');
      console.log('Has getNetworkId method:', typeof lace.getNetworkId === 'function');
      console.log('Has getBalance method:', typeof lace.getBalance === 'function');
      console.log('Lace name:', lace.name);
      console.log('Lace icon:', lace.icon);
    } else if ((window as any).cardano?.laceMidnight) {
      const laceMidnight = (window as any).cardano.laceMidnight;
      console.log('✅ Lace Midnight wallet API detected');
      console.log('Lace Midnight API object:', laceMidnight);
      console.log('Has enable method:', typeof laceMidnight.enable === 'function');
      console.log('Lace Midnight name:', laceMidnight.name);
      console.log('Lace Midnight icon:', laceMidnight.icon);
    } else if ((window as any).cardano?.['lace-midnight-preview']) {
      const laceMidnightPreview = (window as any).cardano['lace-midnight-preview'];
      console.log('✅ Lace Midnight Preview wallet API detected');
      console.log('Lace Midnight Preview API object:', laceMidnightPreview);
      console.log('Has enable method:', typeof laceMidnightPreview.enable === 'function');
      console.log('Lace Midnight Preview name:', laceMidnightPreview.name);
      console.log('Lace Midnight Preview icon:', laceMidnightPreview.icon);
    } else {
      console.log('❌ Lace Midnight Preview wallet API not found');
      if ((window as any).cardano) {
        console.log('Available wallets:', Object.keys((window as any).cardano));
      } else {
        console.log('window.cardano not found - no Cardano wallets detected');
      }
    }
  };

  // Get the correct wallet API instance
  const getWalletAPI = () => {
    if ((window as any).cardano?.lace) {
      return (window as any).cardano.lace;
    } else if ((window as any).cardano?.laceMidnight) {
      return (window as any).cardano.laceMidnight;
    } else if ((window as any).cardano?.['lace-midnight-preview']) {
      return (window as any).cardano['lace-midnight-preview'];
    }
    return null;
  };

  // Connect Lace wallet with timeout
  const connectLaceWallet = async () => {
    setIsConnectingLuna(true);
    setConnectionStatus('Checking for wallet extension...');
    
    try {
      console.log('Checking for Lace Midnight Preview wallet API...');
      
      // Wait for wallet injection (extensions need time to load)
      const walletAvailable = await waitForWalletInjection();
      
      if (!walletAvailable) {
        console.log('Lace wallet API not found after waiting');
        setConnectionStatus('');
        alert('Lace Midnight Preview wallet not detected. Please install the Lace Midnight Preview extension and refresh the page.');
        window.open('https://chromewebstore.google.com/detail/lace-midnight-preview/hgeekaiplokcnmakghbdfbgnlfheichg', '_blank');
        return;
      }

      setConnectionStatus('Wallet extension found, requesting connection...');
      console.log('Lace wallet API detected, attempting connection...');
      const walletAPI = getWalletAPI();
      
      if (!walletAPI) {
        setConnectionStatus('');
        throw new Error('Wallet API not found after detection');
      }

      console.log('Using wallet API:', walletAPI.name || 'Unknown wallet');
      setConnectionStatus('Please check your wallet for authorization popup...');
      
      // Check if wallet is already enabled
      let walletApi;
      try {
        // First try to check if already connected
        if (walletAPI.isEnabled && await walletAPI.isEnabled()) {
          console.log('Wallet is already enabled, getting API...');
          walletApi = await walletAPI.enable();
        } else {
          console.log('Requesting wallet authorization...');
          console.log('Please check for wallet popup and enter your password if prompted');
          setConnectionStatus('Waiting for authorization... Check your wallet popup!');
          
          // Add timeout to the enable call to prevent infinite loading
          const enableWithTimeout = (timeoutMs = 60000) => { // Increased to 60 seconds for user interaction
            return Promise.race([
              walletAPI.enable(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout - please check wallet popup and try again')), timeoutMs)
              )
            ]);
          };

          // Request connection to Lace wallet with longer timeout for user interaction
          walletApi = await enableWithTimeout(60000); // 60 second timeout for authorization + password
          setConnectionStatus('Authorization successful, finalizing connection...');
        }
      } catch (enableError) {
        console.error('Enable error details:', enableError);
        
        // Check if it's a user rejection
        if (enableError instanceof Error) {
          if (enableError.message.includes('User declined') || 
              enableError.message.includes('rejected') ||
              enableError.message.includes('denied')) {
            throw new Error('Connection was declined. Please approve the connection in the wallet popup.');
          } else if (enableError.message.includes('timeout')) {
            throw new Error('Connection timed out. Please make sure you:\n1. Click "Connect" in the wallet popup\n2. Enter your wallet password\n3. Approve the connection');
          }
        }
        throw enableError;
      }

      const result = walletApi;
      
      if (result) {
        console.log('Lace wallet connected successfully:', result);
        setConnectionStatus('Connected successfully!');
        setTimeout(() => setConnectionStatus(''), 2000);
        setShowUserForm(true);
      } else {
        throw new Error('Connection was not approved by user');
      }
      
    } catch (err) {
      console.error('Lace wallet connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      if (errorMessage.includes('User declined') || errorMessage.includes('rejected')) {
        alert('Connection cancelled. Please approve the connection in your Lace Midnight Preview wallet.');
      } else if (errorMessage.includes('timeout')) {
        alert('Connection timed out. Please make sure your Lace Midnight Preview wallet is unlocked and try again.');
      } else {
        alert(`Failed to connect to Lace Midnight Preview wallet: ${errorMessage}\n\nPlease make sure:\n1. The extension is installed and enabled\n2. Your wallet is unlocked\n3. You approve the connection request`);
      }
      
      // Debug information for developers
      console.log('Debug info:', {
        walletAPI: getWalletAPI(),
        cardanoObject: (window as any).cardano,
        availableWallets: (window as any).cardano ? Object.keys((window as any).cardano) : 'No cardano object'
      });
    } finally {
      setIsConnectingLuna(false);
      if (connectionStatus && !connectionStatus.includes('Connected successfully')) {
        setConnectionStatus('');
      }
    }
  };

  // Handle user info submission
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name.trim()) {
      setShowUserForm(false);
      // Here you could save user info to your backend or local storage
      console.log('User info saved:', userInfo);
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-slate-900/95 border-purple-500/20 backdrop-blur-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="ml-2 text-white">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="bg-slate-900/95 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            {isConnected ? 'Lace Connected' : 'Connect Lace Wallet'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isConnected
              ? 'Your Lace wallet is connected to Cardano network'
              : 'Connect Lace wallet to access Cardano and Midnight features'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isConnected ? (
            /* Luna Wallet Connection */
            <div className="space-y-6">
              {/* Lace Info Banner */}
              <Alert className="border-blue-500/30 bg-blue-900/20">
                <Wallet className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  <div className="space-y-2">
                    <p className="font-semibold">🔗 Lace Wallet Ready</p>
                    <p className="text-sm">Connect Lace wallet to access Cardano ecosystem and Midnight network features with a modern, user-friendly interface.</p>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Lace Connection Button */}
              <div className="text-center space-y-4">
                <Button
                  onClick={connectLaceWallet}
                  disabled={isConnectingLuna}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold"
                >
                  {isConnectingLuna ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Waiting for wallet authorization...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Lace Midnight Preview
                    </>
                  )}
                </Button>

                {connectionStatus && (
                  <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300 font-medium flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {connectionStatus}
                    </p>
                    {connectionStatus.includes('popup') && (
                      <p className="text-xs text-blue-200 mt-1">
                        1. Look for the wallet authorization popup<br/>
                        2. Click "Connect" or "Allow"<br/>
                        3. Enter your wallet password if prompted
                      </p>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-400">
                  Lace Midnight Preview wallet for Cardano and Midnight networks
                </p>
                
                {/* Debug information */}
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-gray-600">
                  <h4 className="text-xs font-semibold text-yellow-400 mb-2">Debug Info:</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>Extension detected: {isLaceWalletAvailable() ? '✅ Yes' : '❌ No'}</div>
                    <div>Cardano object: {typeof (window as any)?.cardano !== 'undefined' ? '✅ Available' : '❌ Missing'}</div>
                    <div>Available wallets: {typeof (window as any)?.cardano !== 'undefined' 
                      ? Object.keys((window as any).cardano).join(', ') || 'None' 
                      : 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/10 text-center">
                  <Network className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">Multi-Network</p>
                  <p className="text-xs text-gray-400">Cardano & Midnight</p>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/10 text-center">
                  <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">User-Friendly</p>
                  <p className="text-xs text-gray-400">Modern interface</p>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/10 text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">Secure</p>
                  <p className="text-xs text-gray-400">Industry standard</p>
                </div>
              </div>

              {/* Installation Guide */}
              <div className="bg-slate-800/20 p-4 rounded-lg border border-blue-500/10">
                <h4 className="text-sm font-semibold text-white mb-2">
                  {isLaceWalletAvailable() ? 'Lace Midnight Preview Extension Detected' : 'Lace Midnight Preview Extension Required'}
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  {isLaceWalletAvailable()
                    ? 'Lace Midnight Preview Chrome extension is installed. Click connect to proceed.'
                    : 'Install the Lace Midnight Preview Chrome extension to connect your wallet.'
                  }
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://chromewebstore.google.com/detail/lace-midnight-preview/hgeekaiplokcnmakghbdfbgnlfheichg', '_blank')}
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isLaceWalletAvailable() ? 'View Extension' : 'Install Extension'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={debugLaceExtension}
                    className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                  >
                    Debug Lace
                  </Button>
                </div>
              </div>
            </div>
          ) : showUserForm ? (
            /* User Info Form */
            <form onSubmit={handleUserInfoSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Welcome to the Platform</h3>
                <p className="text-sm text-gray-400">Complete your profile to access all features</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-800/50 border-purple-500/20 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-800/50 border-purple-500/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                disabled={!userInfo.name.trim()}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Enter Platform
              </Button>
            </form>
          ) : (
            /* Connected Wallet Dashboard */
            <div className="space-y-4">
              {/* Success Status */}
              <Alert className="border-green-500/30 bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  <p className="font-semibold">🔗 Lace Connected Successfully!</p>
                  <p className="text-sm">Welcome, {userInfo.name || 'User'}! Platform features are now available.</p>
                </AlertDescription>
              </Alert>

              {/* Wallet Summary */}
              <div className="bg-slate-800/30 p-4 rounded-lg border border-purple-500/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Wallet Summary</h4>
                  <Badge variant={networkId === 0 ? "default" : "destructive"}>
                    {networkId === 0 ? "Testnet" : "Wrong Network"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet:</span>
                    <span className="text-white">{walletName || 'Lace'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-white font-mono">
                      {balance ? formatADA(balance) : '0.000000'} ADA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-xs">
                        {formatAddress(address || '', 6)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        {copied ? (
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Warning */}
              {networkId !== 0 && (
                <Alert variant="destructive" className="border-yellow-500/30 bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-300">
                    <p className="font-semibold">⚠️ Network Issue</p>
                    <p className="text-sm">Please ensure Lace wallet is connected to Cardano testnet.</p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Access Platform Features
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://faucet.preprod.cardano.org/faucet', '_blank')}
                    className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Coins className="w-3 mr-1" />
                    Get Test ADA
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="border-red-500/30 bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <p className="font-semibold">Connection Error</p>
                <p className="text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isConnecting && (
            <Alert className="border-blue-500/30 bg-blue-900/20">
              <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
              <AlertDescription className="text-blue-300">
                <p className="font-semibold">Connecting...</p>
                <p className="text-sm">Please approve in your Lace wallet</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}