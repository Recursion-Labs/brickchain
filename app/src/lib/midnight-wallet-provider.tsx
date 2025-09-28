// Midnight Lace Wallet Provider Implementation
// Based on official Midnight Network documentation and create-midnight-dapp patterns

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  MidnightWalletState, 
  MidnightWalletAPI, 
  MidnightLaceProvider,
  MidnightWalletError,
  WALLET_ERRORS 
} from './midnight-wallet-types';
import { initializeMidnightClient } from './midnight';

interface MidnightWalletContextType {
  // Wallet state
  isConnected: boolean;
  isConnecting: boolean;
  walletState: MidnightWalletState | null;
  error: string | null;
  
  // Wallet actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletState: () => Promise<void>;
  
  // Transaction methods
  submitTransaction: (tx: any) => Promise<string>;
  
  // Utility methods
  isWalletInstalled: () => boolean;
  getServiceConfig: () => Promise<any>;
}

const MidnightWalletContext = createContext<MidnightWalletContextType | null>(null);

interface MidnightWalletProviderProps {
  children: ReactNode;
}

export function MidnightWalletProvider({ children }: MidnightWalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletState, setWalletState] = useState<MidnightWalletState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletAPI, setWalletAPI] = useState<MidnightWalletAPI | null>(null);

  // Check if Midnight Lace wallet is installed
  const isWalletInstalled = useCallback((): boolean => {
    return !!(window.midnight && window.midnight.mnLace);
  }, []);

  // Get the Midnight Lace provider
  const getMidnightProvider = useCallback((): MidnightLaceProvider | null => {
    if (window.midnight && window.midnight.mnLace) {
      return window.midnight.mnLace;
    }
    return null;
  }, []);

  // Connect to Midnight Lace wallet
  const connectWallet = useCallback(async (): Promise<void> => {
    if (!isWalletInstalled()) {
      throw new MidnightWalletError(
        'Midnight Lace wallet is not installed. Please install the Lace wallet extension.',
        WALLET_ERRORS.NOT_INSTALLED
      );
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = getMidnightProvider();
      if (!provider) {
        throw new MidnightWalletError(
          'Unable to access Midnight Lace provider',
          WALLET_ERRORS.CONNECTION_FAILED
        );
      }

      console.log('🔌 Requesting wallet connection...');
      
      // Request wallet access (triggers user popup)
      const api = await provider.enable();
      console.log('✅ Wallet connection authorized');

      // Get wallet state
      const state = await api.state();
      console.log('📋 Wallet state retrieved:', {
        address: state.address,
        coinPublicKey: state.coinPublicKey?.substring(0, 20) + '...',
        encryptionPublicKey: state.encryptionPublicKey?.substring(0, 20) + '...'
      });

      // Update context state
      setWalletAPI(api);
      setWalletState({
        address: state.address,
        coinPublicKey: state.coinPublicKey,
        encryptionPublicKey: state.encryptionPublicKey,
        isConnected: true,
        balance: '0' // Will be updated by balance checking
      });
      setIsConnected(true);

      console.log('🎉 Midnight wallet connected successfully!');
      
      // Initialize Midnight client for contract interactions
      try {
        console.log('🔧 Initializing Midnight client...');
        await initializeMidnightClient();
        console.log('✅ Midnight client initialized successfully!');
      } catch (clientError) {
        console.warn('⚠️ Failed to initialize Midnight client:', clientError);
        // Don't throw here - wallet is connected, client initialization is secondary
      }
      
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
      setError(errorMessage);
      throw new MidnightWalletError(errorMessage, WALLET_ERRORS.CONNECTION_FAILED);
    } finally {
      setIsConnecting(false);
    }
  }, [isWalletInstalled, getMidnightProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback((): void => {
    console.log('🔌 Disconnecting wallet...');
    setIsConnected(false);
    setWalletState(null);
    setWalletAPI(null);
    setError(null);
    
    // Clear Midnight client from store
    try {
      const { useStore } = require('./store');
      useStore.getState().setMidnightClient(null);
      console.log('🧹 Midnight client cleared from store');
    } catch (err) {
      console.warn('Failed to clear Midnight client:', err);
    }
    
    console.log('👋 Wallet disconnected');
  }, []);

  // Refresh wallet state
  const refreshWalletState = useCallback(async (): Promise<void> => {
    if (!walletAPI || !isConnected) {
      return;
    }

    try {
      const state = await walletAPI.state();
      setWalletState(prev => prev ? {
        ...prev,
        address: state.address,
        coinPublicKey: state.coinPublicKey,
        encryptionPublicKey: state.encryptionPublicKey,
      } : null);
    } catch (err) {
      console.error('Failed to refresh wallet state:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh wallet state');
    }
  }, [walletAPI, isConnected]);

  // Submit transaction
  const submitTransaction = useCallback(async (tx: any): Promise<string> => {
    if (!walletAPI || !isConnected) {
      throw new MidnightWalletError(
        'Wallet not connected',
        WALLET_ERRORS.NOT_ENABLED
      );
    }

    try {
      console.log('📤 Submitting transaction...');
      const txHash = await walletAPI.submitTransaction(tx);
      console.log('✅ Transaction submitted:', txHash);
      return txHash;
    } catch (err) {
      console.error('❌ Transaction failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      throw new MidnightWalletError(errorMessage, WALLET_ERRORS.TRANSACTION_FAILED);
    }
  }, [walletAPI, isConnected]);

  // Check if a service is running by making a health check request
  const checkServiceHealth = async (url: string, serviceName: string): Promise<boolean> => {
    try {
      // Try to connect to the service with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(url, { 
        method: 'GET',
        mode: 'no-cors', // Use no-cors to avoid CORS issues
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // With no-cors mode, if the request completes without error, the service is likely running
      console.log(`🔍 ${serviceName} health check (${url}): ✅ (service responding)`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorString = err instanceof Error ? err.toString() : String(err);
      
      console.log(`🔍 ${serviceName} health check error details:`, { errorMessage, errorString, err });
      
      // Check for specific connection refused errors (service is definitely down)
      if (errorString.includes('ERR_CONNECTION_REFUSED') || 
          errorMessage.includes('CONNECTION_REFUSED') ||
          errorMessage.includes('refused') ||
          errorString.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log(`🔍 ${serviceName} health check (${url}): ❌ (connection refused - service is down)`);
        return false;
      }
      
      // Check for other network-related errors that indicate the service is down
      if (errorMessage.includes('NetworkError') || 
          errorMessage.includes('timeout') ||
          errorMessage.includes('aborted')) {
        console.log(`🔍 ${serviceName} health check (${url}): ❌ (network error - ${errorMessage})`);
        return false;
      }
      
      // If the error is about CORS, the service might be running but blocking access
      if (errorMessage.includes('CORS') || errorMessage.includes('cors')) {
        console.log(`🔍 ${serviceName} health check (${url}): ✅ (CORS blocked but service is running)`);
        return true;
      }
      
      // For "Failed to fetch" errors, default to service down since we can't distinguish
      if (errorMessage.includes('Failed to fetch')) {
        console.log(`🔍 ${serviceName} health check (${url}): ❌ (failed to fetch - service likely down)`);
        return false;
      }
      
      // For other errors, assume service is down
      console.log(`🔍 ${serviceName} health check (${url}): ❌ (unknown error - ${errorMessage})`);
      return false;
    }
  };

  // Get service configuration with health checks
  const getServiceConfig = useCallback(async (): Promise<any> => {
    const provider = getMidnightProvider();
    if (!provider) {
      throw new MidnightWalletError(
        'Midnight provider not available',
        WALLET_ERRORS.NOT_INSTALLED
      );
    }

    try {
      // Get the service URI configuration from the wallet
      const config = await provider.serviceUriConfig();
      console.log('⚙️ Service configuration from wallet:', config);
      
      // Perform health checks on each service with timeout
      const healthCheckPromises = [
        // Node health check - has specific health endpoint
        checkServiceHealth('http://localhost:9944/health', 'Node'),
        // Indexer health check - try root endpoint
        checkServiceHealth('http://localhost:8088/', 'Indexer'),
        // Proof server health check - try root endpoint  
        checkServiceHealth('http://localhost:6300/', 'Proof Server')
      ];

      // Wait for health checks with timeout
      const healthChecks = await Promise.allSettled(healthCheckPromises);

      // Extract health status - if the fetch worked (even with CORS), service is probably up
      const nodeHealth = healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : false;
      const indexerHealth = healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : false; 
      const proofServerHealth = healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : false;

      // Check if wallet is configured for local or remote services
      const isUsingLocalServices = config.proverServerUri?.includes('localhost:6300');
      const isUsingRemoteNode = config.substrateNodeUri?.includes('testnet-02.midnight.network');
      const isUsingRemoteIndexer = config.indexerUri?.includes('testnet-02.midnight.network');

      const healthStatus = {
        ...config, // Include original config
        node: nodeHealth,
        indexer: indexerHealth,
        proofServer: proofServerHealth,
        // Also include the raw config for debugging
        _rawConfig: config,
        _dockerStatus: 'Services should be running on localhost:9944, localhost:8088, localhost:6300',
        _configWarning: {
          usingRemoteNode: isUsingRemoteNode,
          usingRemoteIndexer: isUsingRemoteIndexer,
          usingLocalProofServer: isUsingLocalServices,
          message: isUsingRemoteNode || isUsingRemoteIndexer ? 
            'Wallet is configured for remote testnet services. Some features may require local Docker services.' : 
            'Wallet configured for local development services.'
        }
      };

      console.log('🏥 Service health status:', healthStatus);
      
      // Add to window for debugging
      if (typeof window !== 'undefined') {
        (window as any).debugServiceHealth = {
          checkNode: () => checkServiceHealth('http://localhost:9944/health', 'Node'),
          checkIndexer: () => checkServiceHealth('http://localhost:8088/', 'Indexer'),
          checkProofServer: () => checkServiceHealth('http://localhost:6300/', 'Proof Server'),
          lastResult: healthStatus
        };
      }
      
      return healthStatus;
    } catch (err) {
      console.error('Failed to get service config:', err);
      throw err;
    }
  }, [getMidnightProvider]);

  // Check for wallet on mount
  useEffect(() => {
    if (isWalletInstalled()) {
      console.log('🦎 Midnight Lace wallet detected');
    } else {
      console.log('⚠️ Midnight Lace wallet not installed');
    }
  }, [isWalletInstalled]);

  // Auto-reconnect if previously connected
  useEffect(() => {
    const checkPreviousConnection = async () => {
      if (!isWalletInstalled()) return;

      try {
        const provider = getMidnightProvider();
        if (!provider) return;

        const isEnabled = await provider.isEnabled();
        if (isEnabled) {
          console.log('🔄 Auto-reconnecting to previously authorized wallet...');
          await connectWallet();
        }
      } catch (err) {
        console.log('No previous wallet connection found');
      }
    };

    checkPreviousConnection();
  }, [isWalletInstalled, getMidnightProvider, connectWallet]);

  const contextValue: MidnightWalletContextType = {
    isConnected,
    isConnecting,
    walletState,
    error,
    connectWallet,
    disconnectWallet,
    refreshWalletState,
    submitTransaction,
    isWalletInstalled,
    getServiceConfig,
  };

  return (
    <MidnightWalletContext.Provider value={contextValue}>
      {children}
    </MidnightWalletContext.Provider>
  );
}

// Custom hook to use Midnight wallet context
export function useMidnightWallet(): MidnightWalletContextType {
  const context = useContext(MidnightWalletContext);
  if (!context) {
    throw new Error('useMidnightWallet must be used within a MidnightWalletProvider');
  }
  return context;
}

// Utility hook for wallet connection status
export function useMidnightWalletConnection() {
  const { isConnected, isConnecting, error, connectWallet, disconnectWallet } = useMidnightWallet();
  
  return {
    isConnected,
    isConnecting,
    error,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
}

// Utility hook for wallet state
export function useMidnightWalletState() {
  const { walletState, refreshWalletState } = useMidnightWallet();
  
  return {
    walletState,
    refresh: refreshWalletState,
    address: walletState?.address || null,
    coinPublicKey: walletState?.coinPublicKey || null,
    encryptionPublicKey: walletState?.encryptionPublicKey || null,
    balance: walletState?.balance || '0',
  };
}