# 🔗 Lace Wallet Integration Guide

This guide explains how to integrate Lace wallet (Cardano's modern wallet) into your application for Cardano and Midnight network access.

## 🎯 **What is Lace Wallet?**

Lace is Cardano's modern wallet designed for:
- **Multi-Network Support**: Cardano and Midnight networks
- **User-Friendly Interface**: Modern, intuitive design
- **Secure Transactions**: Industry-standard security
- **Cross-Platform**: Available on multiple platforms

## 🔧 **Integration Overview**

### **Key Components Updated**

1. **WalletConnect.tsx**: Main connection interface for Lace
2. **useWallet.ts**: Hook updated to support Lace wallet detection
3. **Cardano-specific features**: ADA transactions, native tokens

### **Lace vs Other Cardano Wallets**

| Feature | Lace Wallet | Other Wallets (Nami, Yoroi) |
|---------|-------------|------------------------------|
| **Interface** | Modern, user-friendly | Varies by wallet |
| **Networks** | Cardano + Midnight | Primarily Cardano |
| **Design** | Contemporary UI/UX | Traditional interfaces |
| **Features** | Multi-network support | Standard Cardano features |
| **Use Case** | Modern dApps | General Cardano ecosystem |

## 🚀 **Implementation Details**

### **Lace Wallet Detection**
```typescript
// Check if Lace wallet is available
const isLaceWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).cardano?.lace;
};

// Connect to Lace wallet
const connectLaceWallet = async () => {
  if (typeof window !== 'undefined' && (window as any).cardano?.lace) {
    const lace = (window as any).cardano.lace;
    const result = await lace.enable();
    return result;
  }
  throw new Error('Lace wallet not found');
};
```

### **Connection Flow**
```
1. User clicks "Connect Lace Wallet"
   ↓
2. Check if Lace extension is installed
   ↓
3. If not installed → Redirect to Lace installation
   ↓
4. If installed → Request connection permission
   ↓
5. User approves in Lace wallet popup
   ↓
6. Connection established → Show user form
   ↓
7. User enters profile info → Access granted
```

## 🎨 **UI/UX Improvements**

### **Visual Design**
- **Wallet Icon**: Modern wallet icon representing Lace
- **Blue/Indigo Gradient**: Lace's brand colors
- **User-Friendly Messaging**: Emphasizes modern interface
- **Clean Interface**: Simple, readable design

### **User Experience**
- **Clear Value Proposition**: "Modern wallet for Cardano"
- **Feature Highlights**: Multi-network, user-friendly, secure
- **Installation Guide**: Easy Lace wallet setup
- **Error Handling**: Clear messages for missing wallet

## 🔐 **Cardano Features**

### **ADA Transactions**
```typescript
// Example: Send ADA transaction
const sendADA = async (recipient: string, amount: number) => {
  if (lace) {
    const tx = await lace.createTransaction({
      to: recipient,
      amount: amount * 1_000_000, // Convert ADA to Lovelace
    });
    return await lace.signAndSubmit(tx);
  }
};
```

### **Native Token Support**
```typescript
// Example: Handle Cardano native tokens
const getAssets = async () => {
  if (lace) {
    const assets = await lace.getAssets();
    return assets.filter(asset => asset.policyId !== ''); // Filter native tokens
  }
};
```

## 📱 **Component Structure**

### **WalletConnect Component States**

1. **Not Connected**:
   - Lace connection button
   - Feature highlights (Multi-network, User-friendly, Secure)
   - Installation guide for missing wallet

2. **User Info Form**:
   - Name input (required)
   - Email input (optional)
   - "Enter Platform" button

3. **Connected Dashboard**:
   - Connection success message
   - Wallet summary (Lace, balance, address)
   - "Access Platform Features" button

### **Error Handling**

```typescript
// Common error scenarios
const handleLaceErrors = (error: any) => {
  switch (error.code) {
    case 'WALLET_NOT_FOUND':
      return 'Lace wallet not installed. Please install Lace extension.';
    case 'CONNECTION_REJECTED':
      return 'Connection rejected. Please approve in Lace wallet.';
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection.';
    default:
      return 'Unknown error occurred. Please try again.';
  }
};
```

## 🌐 **Network Configuration**

### **Cardano Testnet**
```typescript
const CARDANO_TESTNET_CONFIG = {
  networkId: 0, // Cardano testnet
  networkName: 'Cardano Testnet',
  explorerUrl: 'https://preprod.cardanoscan.io',
  faucetUrl: 'https://faucet.preprod.cardano.org/faucet',
  walletName: 'Lace'
};
```

### **Network Validation**
```typescript
// Ensure user is on correct network
const validateCardanoNetwork = async () => {
  if (lace) {
    const network = await lace.getNetworkId();
    if (network !== 0) {
      throw new Error('Please switch to Cardano testnet');
    }
  }
};
```

## 🛠 **Development Setup**

### **Prerequisites**
1. **Lace Wallet Extension**: Install from lace.io
2. **Cardano Testnet**: Configure wallet for testnet
3. **Test ADA**: Get from Cardano faucet
4. **Development Environment**: Node.js 18+, TypeScript

### **Installation Steps**

1. **Install Lace Wallet**:
   ```bash
   # Visit https://www.lace.io/
   # Download and install browser extension
   ```

2. **Configure Testnet**:
   ```bash
   # In Lace wallet settings:
   # - Switch to "Cardano Testnet"
   # - Generate new address
   # - Request test ADA from faucet
   ```

3. **Test Connection**:
   ```typescript
   // In browser console:
   console.log(window.cardano?.lace); // Should show Lace API
   ```

## 🧪 **Testing Guide**

### **Manual Testing**

1. **Connection Test**:
   - Click "Connect Lace Wallet"
   - Verify popup appears
   - Approve connection
   - Check success state

2. **Network Test**:
   - Verify testnet connection
   - Check network ID
   - Validate RPC endpoint

3. **Feature Test**:
   - Test ADA transactions
   - Try native token handling
   - Verify balance display

### **Automated Testing**

```typescript
// Jest test example
describe('Lace Wallet Integration', () => {
  test('should detect Lace wallet', () => {
    // Mock Lace wallet
    (window as any).cardano = { lace: { enable: jest.fn() } };
    expect(isLaceWalletAvailable()).toBe(true);
  });

  test('should handle missing wallet', () => {
    delete (window as any).cardano;
    expect(isLaceWalletAvailable()).toBe(false);
  });
});
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **"Lace wallet not found"**
   - **Solution**: Install Lace wallet extension
   - **Check**: Extension is enabled in browser

2. **"Connection rejected"**
   - **Solution**: Approve connection in Lace popup
   - **Check**: Popup blocker is disabled

3. **"Wrong network"**
   - **Solution**: Switch to Cardano testnet in Lace
   - **Check**: Network settings in wallet

4. **"No test ADA"**
   - **Solution**: Request from Cardano faucet
   - **Check**: Faucet limits and cooldowns

### **Debug Tools**

```typescript
// Debug Lace wallet state
const debugLaceWallet = async () => {
  console.log('Lace available:', !!(window as any).cardano?.lace);
  
  if ((window as any).cardano?.lace) {
    const lace = (window as any).cardano.lace;
    console.log('Network:', await lace.getNetworkId());
    console.log('Address:', await lace.getChangeAddress());
    console.log('Balance:', await lace.getBalance());
  }
};
```

## 📚 **Resources**

### **Official Documentation**
- **Lace Wallet**: [https://www.lace.io/](https://www.lace.io/)
- **Cardano**: [https://cardano.org/](https://cardano.org/)
- **Developer Docs**: [https://developers.cardano.org/](https://developers.cardano.org/)
- **Mesh.js**: [https://meshjs.dev/](https://meshjs.dev/)

### **Community**
- **Cardano Discord**: [https://discord.gg/cardano](https://discord.gg/cardano)
- **GitHub**: [https://github.com/input-output-hk/lace](https://github.com/input-output-hk/lace)
- **Forum**: [https://forum.cardano.org/](https://forum.cardano.org/)

### **Examples**
- **Lace Examples**: [https://github.com/input-output-hk/lace/tree/main/examples](https://github.com/input-output-hk/lace/tree/main/examples)
- **Cardano dApps**: [https://github.com/cardano-foundation/developer-portal](https://github.com/cardano-foundation/developer-portal)
- **Mesh.js Examples**: [https://meshjs.dev/examples](https://meshjs.dev/examples)

## 🚀 **Next Steps**

1. **Install Lace Wallet**: Get the extension from lace.io
2. **Test Connection**: Use the WalletConnect component
3. **Explore Features**: Try ADA transactions and native tokens
4. **Build Cardano dApps**: Leverage Cardano's ecosystem
5. **Join Community**: Connect with other Cardano developers

---

**Remember**: Lace wallet provides a modern, user-friendly interface for the Cardano ecosystem. It's designed to make blockchain interactions more accessible while maintaining security and functionality.