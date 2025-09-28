import { useState, useEffect, useCallback } from 'react';
import { useWallet as useMeshWallet, useAddress, useLovelace, useNetwork } from '@meshsdk/react';
import { useStore } from '@/lib/store';

// Cardano testnet configuration for Midnight compatibility
const CARDANO_TESTNET_CONFIG = {
  networkId: 0, // Cardano testnet
  networkName: 'Cardano Testnet',
  explorerUrl: 'https://preprod.cardanoscan.io',
  faucetUrl: 'https://faucet.preprod.cardano.org/faucet'
};

// Midnight testnet configuration
const MIDNIGHT_TESTNET_CONFIG = {
  networkId: 'testnet',
  chainId: 'midnight-testnet',
  rpcUrl: 'https://rpc.testnet.midnight.network',
  explorerUrl: 'https://explorer.testnet.midnight.network',
  faucetUrl: 'https://faucet.testnet.midnight.network'
};

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: string | null;
  networkId: number | null;
  error: string | null;
  walletName: string | null;
}

interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchToMidnightTestnet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export const useWallet = (): WalletState & WalletActions => {
  const { wallet, connected, name, connecting, error: meshError } = useMeshWallet();
  const address = useAddress();
  const balance = useLovelace(); // Use Mesh.js hook for balance
  const network = useNetwork(); // Use Mesh.js hook for network
  const { connectWallet, disconnectWallet, setError, clearError } = useStore();
  
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    balance: null,
    networkId: null,
    error: null,
    walletName: null
  });

  // Update state when Mesh wallet changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected: connected,
      isConnecting: connecting,
      address: address || null,
      balance: balance || null,
      networkId: network || null,
      walletName: name || null,
      error: meshError ? String(meshError) : null
    }));
  }, [connected, connecting, address, balance, network, name, meshError]);

  // Fetch wallet details when connected
  const fetchWalletDetails = useCallback(async () => {
    if (!wallet || !connected || !address) return;

    try {
      const [
        walletBalance,
        networkId,
        usedAddresses,
        unusedAddresses,
        rewardAddresses,
        assets,
        policyIds
      ] = await Promise.all([
        wallet.getLovelace().catch(() => balance || '0'),
        wallet.getNetworkId().catch(() => network || 0),
        wallet.getUsedAddresses().catch(() => []),
        wallet.getUnusedAddresses().catch(() => []),
        wallet.getRewardAddresses().catch(() => []),
        wallet.getAssets().catch(() => []),
        wallet.getPolicyIds().catch(() => [])
      ]);

      // Update global store with comprehensive wallet info
      connectWallet(name || 'Cardano Wallet', address, {
        balance: walletBalance || balance || '0',
        name: name || 'Cardano Wallet',
        networkId: networkId || network || 0,
        usedAddresses: usedAddresses.map((addr: any) => addr.toString()),
        unusedAddresses: unusedAddresses.map((addr: any) => addr.toString()),
        rewardAddresses: rewardAddresses.map((addr: any) => addr.toString()),
        assets,
        policyIds
      });

      clearError();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet details';
      setState(prev => ({ ...prev, error: errorMessage }));
      setError(errorMessage);
    }
  }, [wallet, connected, address, balance, network, name, connectWallet, setError, clearError]);

  // Auto-fetch details when wallet connects
  useEffect(() => {
    if (connected && wallet && address) {
      fetchWalletDetails();
    }
  }, [connected, wallet, address, fetchWalletDetails]);

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      clearError();
      
      // The actual connection is handled by Mesh's CardanoWallet component
      // This function is mainly for state management
      if (connected && wallet) {
        await fetchWalletDetails();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setState(prev => ({ ...prev, error: errorMessage }));
      setError(errorMessage);
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [connected, wallet, fetchWalletDetails, setError, clearError]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      disconnectWallet();
      setState({
        isConnected: false,
        isConnecting: false,
        address: null,
        balance: null,
        networkId: null,
        error: null,
        walletName: null
      });
      clearError();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setState(prev => ({ ...prev, error: errorMessage }));
      setError(errorMessage);
    }
  }, [disconnectWallet, setError, clearError]);

  // Switch to Midnight testnet (validate Cardano testnet connection)
  const switchToMidnightTestnet = useCallback(async () => {
    try {
      console.log('Validating Cardano testnet for Midnight compatibility...', MIDNIGHT_TESTNET_CONFIG);
      
      const currentNetwork = network || (wallet ? await wallet.getNetworkId() : null);
      console.log('Current network ID:', currentNetwork);
      
      // Check if we're on Cardano testnet (networkId 0)
      if (currentNetwork !== 0) {
        const errorMsg = `Please switch to Cardano testnet in your wallet. Current network: ${getNetworkName(currentNetwork || 1)}`;
        setState(prev => ({ ...prev, error: errorMsg }));
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // If on testnet, show success message
      console.log('✅ Connected to Cardano testnet - Midnight features available');
      clearError();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate network';
      setState(prev => ({ ...prev, error: errorMessage }));
      setError(errorMessage);
    }
  }, [wallet, network, setError, clearError]);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (wallet && connected) {
      await fetchWalletDetails();
    }
  }, [wallet, connected, fetchWalletDetails]);

  return {
    ...state,
    connect,
    disconnect,
    switchToMidnightTestnet,
    refreshBalance
  };
};

// Helper function to format ADA balance
export const formatADA = (lovelace: string | number): string => {
  const ada = typeof lovelace === 'string' ? parseFloat(lovelace) : lovelace;
  return (ada / 1_000_000).toFixed(6);
};

// Helper function to format address for display
export const formatAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
};

// Helper function to get network name
export const getNetworkName = (networkId: number): string => {
  switch (networkId) {
    case 0: return 'Testnet';
    case 1: return 'Mainnet';
    default: return `Network ${networkId}`;
  };
};