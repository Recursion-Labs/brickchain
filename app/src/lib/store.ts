import { create } from 'zustand';

// Define wallet info interface
interface WalletInfo {
  balance?: string;
  usedAddresses?: string[];
  unusedAddresses?: string[];
  rewardAddresses?: string[];
  name?: string;
  networkId?: number;
  assets?: any[];
  policyIds?: string[];
}

// Define the store state and actions
interface AppState {
  // Wallet state
  walletAddress: string | null;
  isConnected: boolean;
  walletProvider: any | null;
  walletInfo: WalletInfo | null;
  
  // Midnight client (to be initialized later)
  midnightClient: any | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions to update state
  connectWallet: (provider: any, address: string, info?: WalletInfo) => void;
  disconnectWallet: () => void;
  setMidnightClient: (client: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Create the Zustand store
export const useStore = create<AppState>((set) => ({
  // Initial state
  walletAddress: null,
  isConnected: false,
  walletProvider: null,
  walletInfo: null,
  midnightClient: null,
  isLoading: false,
  error: null,
  
  // Actions
  connectWallet: (provider, address, info) => set({
    walletProvider: provider,
    walletAddress: address,
    walletInfo: info || null,
    isConnected: true,
    error: null
  }),
  
  disconnectWallet: () => set({
    walletAddress: null,
    isConnected: false,
    walletProvider: null,
    walletInfo: null,
    error: null
  }),
  
  setMidnightClient: (client) => set({ 
    midnightClient: client,
    error: null 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));