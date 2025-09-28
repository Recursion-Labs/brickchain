import { useWallet, useAddress } from '@meshsdk/react';
import { useStore } from './store';

// Enhanced Mesh.js Wallet Widget provider for wallet integration with Midnight
export const initializeMeshWallet = () => {
  const { wallet, connected, name, connecting, error } = useWallet();
  const address = useAddress();
  const { connectWallet, disconnectWallet } = useStore.getState();

  // Function to handle wallet connection
  const handleConnect = async () => {
    if (connected && wallet && address) {
      try {
        // Get wallet details
        const walletBalance = await wallet.getBalance();
        const usedAddresses = await wallet.getUsedAddresses();
        const unusedAddresses = await wallet.getUnusedAddresses();
        
        // Calculate total balance in lovelace
        const totalBalance = walletBalance.reduce((sum, asset) => {
          if (asset.unit === 'lovelace') {
            return sum + parseInt(asset.quantity);
          }
          return sum;
        }, 0);

        // Update store with wallet info
        connectWallet(wallet, address, {
          balance: totalBalance.toString(),
          name: name || 'Cardano Wallet',
          usedAddresses: usedAddresses.map(addr => addr.toString()),
          unusedAddresses: unusedAddresses.map(addr => addr.toString())
        });
      } catch (err) {
        console.error('Wallet connection error:', err);
      }
    }
  };

  // Function to handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      disconnectWallet();
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    }
  };

  return {
    wallet,
    connected,
    name,
    connecting,
    error,
    address,
    handleConnect,
    handleDisconnect
  };
};

// Hook to use Mesh wallet
export const useMeshWallet = () => {
  return initializeMeshWallet();
};