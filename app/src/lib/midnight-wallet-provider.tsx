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

  // Get service configuration
  const getServiceConfig = useCallback(async (): Promise<any> => {
    const provider = getMidnightProvider();
    if (!provider) {
      throw new MidnightWalletError(
        'Midnight provider not available',
        WALLET_ERRORS.NOT_INSTALLED
      );
    }

    try {
      const config = await provider.serviceUriConfig();
      console.log('⚙️ Service configuration:', config);
      return config;
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