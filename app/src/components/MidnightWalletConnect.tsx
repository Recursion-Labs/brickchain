import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useMidnightWallet, useMidnightWalletConnection, useMidnightWalletState } from '@/lib/midnight-wallet-provider';
import { useStore } from '@/lib/store';

export default function MidnightWalletConnect() {
  const { isConnected, isConnecting, error, connect, disconnect } = useMidnightWalletConnection();
  const { walletState, refresh, address, balance } = useMidnightWalletState();
  const { isWalletInstalled, getServiceConfig } = useMidnightWallet();
  const { connectWallet, disconnectWallet } = useStore();
  
  const [copied, setCopied] = useState(false);
  const [serviceConfig, setServiceConfig] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load service configuration
  const loadServiceConfig = async () => {
    if (isConnected) {
      try {
        console.log('🔄 Loading service configuration...');
        const config = await getServiceConfig();
        setServiceConfig(config);
        console.log('✅ Service configuration loaded:', config);
      } catch (error) {
        console.error('❌ Failed to load service configuration:', error);
        setServiceConfig({ node: false, indexer: false, proofServer: false });
      }
    }
  };

  // Combined refresh function
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log('🔄 Refreshing wallet and services...');
      
      // Refresh wallet state
      await refresh();
      
      // Refresh service configuration
      await loadServiceConfig();
      
      console.log('✅ Refresh completed!');
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync with global store when wallet state changes
  useEffect(() => {
    if (isConnected && walletState) {
      connectWallet(null, walletState.address, {
        balance: walletState.balance,
        name: 'Midnight Lace Wallet',
      });
    } else {
      disconnectWallet();
    }
  }, [isConnected, walletState, connectWallet, disconnectWallet]);

  // Load service configuration when connected
  useEffect(() => {
    loadServiceConfig();
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const openLaceWallet = () => {
    window.open('https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg', '_blank');
  };

  if (!isWalletInstalled()) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Midnight Lace Wallet Required</h3>
            <p className="text-sm text-gray-400">Connect to the Midnight Network</p>
          </div>
        </div>
        
        <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Please install the Midnight Lace wallet browser extension to continue.
          </AlertDescription>
        </Alert>

        <Button
          onClick={openLaceWallet}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Install Lace Wallet
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Connect Midnight Wallet</h3>
            <p className="text-sm text-gray-400">Access privacy-preserving features</p>
          </div>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>

        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>• Zero-knowledge privacy protection</p>
          <p>• Secure asset management</p>
          <p>• Testnet compatible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-green-500/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
            <p className="text-sm text-gray-400">Midnight Lace Wallet</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Connected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline" 
            size="sm"
            onClick={disconnect}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Wallet Info */}
        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-300">Address</label>
            <div className="flex items-center space-x-2 mt-1 p-3 bg-slate-700/50 rounded-lg">
              <code className="text-sm text-gray-300 font-mono flex-1">
                {address ? formatAddress(address) : 'Loading...'}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <label className="text-sm font-medium text-gray-300">Balance</label>
            <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
              <span className="text-lg font-semibold text-white">
                {balance ? `${balance} tDUST` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Public Keys */}
        {walletState && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Coin Public Key</label>
              <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
                <code className="text-xs text-gray-400 font-mono break-all">
                  {formatAddress(walletState.coinPublicKey)}
                </code>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300">Encryption Public Key</label>
              <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
                <code className="text-xs text-gray-400 font-mono break-all">
                  {formatAddress(walletState.encryptionPublicKey)}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Configuration - Full Width Bottom */}
      {serviceConfig && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Network Configuration</label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText('cd docker/prod && docker-compose up -d')}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Command
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Node:</span>
              <span className="text-lg">{serviceConfig.node ? '✅' : '❌'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Indexer:</span>
              <span className="text-lg">{serviceConfig.indexer ? '✅' : '❌'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Proof Server:</span>
              <span className="text-lg">{serviceConfig.proofServer ? '✅' : '❌'}</span>
            </div>
          </div>
          
          {/* Services Offline Warning */}
          {(!serviceConfig.node || !serviceConfig.indexer || !serviceConfig.proofServer) && (
            <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <div className="space-y-3">
                  <p className="font-semibold">⚠️ Network Services Status</p>
                  <p className="text-sm">
                    {!serviceConfig.node && 'Node service is not responding. '}
                    {!serviceConfig.indexer && 'Indexer service needs attention. '}
                    {!serviceConfig.proofServer && 'Proof Server is offline. '}
                    {serviceConfig._configWarning?.usingRemoteNode ? 
                      'Using remote services for Node and Indexer.' : 
                      'Start local Docker services for full functionality:'
                    }
                  </p>
                  
                  {!serviceConfig._configWarning?.usingRemoteNode && (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-yellow-300">Quick Start (All Services):</p>
                        <div className="text-xs font-mono bg-slate-800/50 p-2 rounded border border-slate-600">
                          cd docker/prod && docker-compose up -d
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-yellow-300">Check Status:</p>
                        <div className="text-xs font-mono bg-slate-800/50 p-2 rounded border border-slate-600">
                          docker-compose ps
                        </div>
                      </div>

                      <div className="text-xs text-yellow-200">
                        💡 Tip: Use the "Copy Command" button above, then paste in your terminal
                      </div>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}