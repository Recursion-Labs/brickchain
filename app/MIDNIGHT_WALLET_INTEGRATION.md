# 🌙 Midnight Lace Wallet Integration

This implementation provides a complete integration with the Midnight Lace wallet, following the official Midnight Network documentation and the patterns from the `create-midnight-dapp` package.

## 🚀 Features

- **Zero-Knowledge Privacy**: Full privacy-preserving transaction support
- **Bech32m Address Format**: Uses the latest Midnight address standard  
- **Auto-Reconnection**: Remembers previous wallet connections
- **Real-time State Management**: Live updates of wallet status and balance
- **Service Configuration**: Automatic detection of network services
- **TypeScript Support**: Full type safety with TypeScript interfaces
- **Error Handling**: Comprehensive error management with user-friendly messages

## 📦 Components

### Core Files

1. **`midnight-wallet-types.ts`** - TypeScript interfaces and types
2. **`midnight-wallet-provider.tsx`** - React context provider with hooks
3. **`MidnightWalletConnect.tsx`** - UI component for wallet connection
4. **Updated `_app.tsx`** - Provider integration
5. **Updated `Dashboard.tsx`** - Wallet status display

### Key Interfaces

```typescript
interface MidnightWalletState {
  address: string;              // Bech32m-encoded address
  coinPublicKey: string;        // Bech32m-encoded coin public key  
  encryptionPublicKey: string;  // Bech32m-encoded encryption public key
  balance?: string;
  isConnected: boolean;
}

interface MidnightWalletAPI {
  state(): Promise<WalletState>;
  submitTransaction(tx: any): Promise<string>;
  isEnabled(): Promise<boolean>;
  enable(): Promise<MidnightWalletAPI>;
}
```

## 🎣 Hooks

### `useMidnightWallet()`
Main hook providing full wallet functionality:
```typescript
const { 
  isConnected, 
  isConnecting, 
  walletState, 
  error,
  connectWallet, 
  disconnectWallet,
  submitTransaction,
  isWalletInstalled,
  getServiceConfig 
} = useMidnightWallet();
```

### `useMidnightWalletConnection()`
Simplified hook for connection management:
```typescript
const { 
  isConnected, 
  isConnecting, 
  error, 
  connect, 
  disconnect 
} = useMidnightWalletConnection();
```

### `useMidnightWalletState()`
Hook for wallet state information:
```typescript
const { 
  walletState, 
  refresh, 
  address, 
  coinPublicKey,
  encryptionPublicKey, 
  balance 
} = useMidnightWalletState();
```

## 🔧 Usage Examples

### Basic Connection
```typescript
import { useMidnightWalletConnection } from '@/lib/midnight-wallet-provider';

function MyComponent() {
  const { isConnected, connect, disconnect } = useMidnightWalletConnection();
  
  return (
    <div>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect Wallet</button>
      ) : (
        <button onClick={connect}>Connect Midnight Wallet</button>
      )}
    </div>
  );
}
```

### Wallet State Display
```typescript
import { useMidnightWalletState } from '@/lib/midnight-wallet-provider';

function WalletInfo() {
  const { address, balance, coinPublicKey } = useMidnightWalletState();
  
  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} tDUST</p>
      <p>Coin Key: {coinPublicKey?.substring(0, 20)}...</p>
    </div>
  );
}
```

### Transaction Submission
```typescript
import { useMidnightWallet } from '@/lib/midnight-wallet-provider';

function TransactionComponent() {
  const { submitTransaction, isConnected } = useMidnightWallet();
  
  const handleTransaction = async () => {
    if (!isConnected) return;
    
    try {
      const txHash = await submitTransaction(myTransaction);
      console.log('Transaction submitted:', txHash);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
  
  return (
    <button onClick={handleTransaction}>
      Submit Transaction
    </button>
  );
}
```

## 🌐 Wallet Detection

The integration automatically detects the Midnight Lace wallet using the official detection pattern:

```typescript
// Primary detection method
if (window.midnight && window.midnight.mnLace) {
  const provider = window.midnight.mnLace;
  // Wallet is available
}
```

## 🚦 Connection Flow

1. **Detection**: Check if Lace wallet is installed
2. **Authorization**: Request user permission via `enable()`
3. **State Retrieval**: Get wallet state with `state()`
4. **Service Config**: Optionally fetch service configuration
5. **Auto-Reconnect**: Check for previous authorization on page load

## 🎨 UI Components

### MidnightWalletConnect
A complete wallet connection component that handles:
- Wallet installation detection
- Connection/disconnection UI
- Wallet state display
- Error handling
- Service configuration display

### Integration with Navigation
The wallet state is automatically synced with the global store and displays in the navigation bar.

## 🔐 Security Features

- **Bech32m Addresses**: Uses the latest secure address format
- **Legacy Support**: Handles deprecated hex addresses gracefully
- **Error Boundaries**: Comprehensive error handling for all operations
- **Auto-Reconnection**: Secure session management

## 📋 Prerequisites

1. **Lace Wallet Extension**: Users must install the Lace wallet browser extension
2. **Midnight Network**: Wallet must be configured for Midnight testnet
3. **Browser Support**: Modern browsers with extension support

## 🚀 Getting Started

1. The wallet provider is already integrated in `_app.tsx`
2. Use the provided hooks in any component
3. The `MidnightWalletConnect` component provides a complete UI
4. Check the Dashboard component for a real-world example

## 🐛 Error Handling

The integration includes comprehensive error handling:

```typescript
export const WALLET_ERRORS = {
  NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  NOT_ENABLED: 'WALLET_NOT_ENABLED', 
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
} as const;
```

Each error provides user-friendly messages and specific error codes for debugging.

## 🔄 State Management

The wallet state is managed through:
1. **React Context**: Local component state management
2. **Zustand Store**: Global application state sync
3. **Auto-Sync**: Automatic synchronization between providers

## 📱 Responsive Design

The wallet components are fully responsive and work on:
- Desktop browsers
- Mobile browsers (where supported)
- Different screen sizes
- Dark/light theme compatible

## 🧪 Testing

To test the integration:
1. Install the Lace wallet extension
2. Create or restore a Midnight-compatible wallet
3. Navigate to the application
4. Connect your wallet using the UI
5. Verify wallet information displays correctly

## 📚 References

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Lace Wallet Guide](https://docs.midnight.network/blog/connect-dapp-lace-wallet)
- [create-midnight-dapp Package](https://www.npmjs.com/package/create-midnight-dapp)
- [Midnight Network GitHub](https://github.com/midnight-ntwrk)

## 🤝 Contributing

When contributing to the wallet integration:
1. Follow the official Midnight documentation patterns
2. Maintain TypeScript type safety
3. Add comprehensive error handling
4. Test with actual Lace wallet connections
5. Update documentation for any changes

---

✨ **Happy Building with Midnight Network!** ✨