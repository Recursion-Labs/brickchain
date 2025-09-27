# 🌙 Midnight Real Estate Tokenization Platform

A cutting-edge Next.js application for tokenizing real estate assets using the Midnight blockchain protocol with zero-knowledge privacy features.

## ✨ Features

### 🔐 **Privacy-First Architecture**
- **Zero-Knowledge Proofs**: Property details remain private while enabling verification
- **Shielded Transactions**: Private token transfers with cryptographic privacy
- **Selective Disclosure**: Share only necessary information with counterparties

### 🏠 **Real Estate Tokenization**
- **Property Registration**: Secure on-chain property registration
- **Asset Tokenization**: Convert properties into tradeable digital tokens
- **Fractional Ownership**: Enable partial property ownership through tokens
- **Ownership Verification**: Cryptographic proof of property ownership

### 💼 **Wallet Integration**
- **Multi-Wallet Support**: Compatible with Lace, Nami, Eternl, and other Cardano wallets
- **Testnet Ready**: Optimized for Cardano testnet and Midnight protocol
- **Real-time Balance**: Live ADA balance and transaction monitoring
- **Network Detection**: Automatic network validation and switching prompts

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark Theme**: Sleek dark mode with gradient accents
- **shadcn/ui Components**: Modern, accessible UI components
- **Real-time Updates**: Live wallet status and transaction feedback

## 🛠 Tech Stack

### **Frontend**
- **Next.js 15**: React framework with Pages Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components

### **Blockchain**
- **Midnight Network**: Privacy-focused blockchain protocol
- **Cardano**: Layer 1 blockchain for wallet integration
- **Mesh.js**: Cardano wallet integration library
- **Zero-Knowledge Proofs**: Privacy-preserving cryptography

### **State Management**
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **Custom Hooks**: Reusable wallet and blockchain logic

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** installed
- **Cardano Wallet** (Lace recommended for Midnight)
- **Cardano Testnet** access for development

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── WalletConnect.tsx   # Enhanced wallet connection
│   ├── Navigation.tsx      # Responsive navigation
│   ├── RegisterProperty.tsx
│   ├── TokenizeProperty.tsx
│   ├── TransferTokens.tsx
│   ├── VerifyOwnership.tsx
│   └── Dashboard.tsx
├── pages/              # Next.js pages
│   ├── _app.tsx        # App configuration
│   ├── _document.tsx   # Document structure
│   ├── index.tsx       # Home page
│   ├── landing.tsx     # Landing page
│   ├── register.tsx
│   ├── tokenize.tsx
│   ├── transfer.tsx
│   └── verify.tsx
├── hooks/              # Custom React hooks
│   └── useWallet.ts    # Wallet integration hook
├── lib/                # Utility libraries
│   ├── store.ts        # Zustand store
│   ├── mesh.ts         # Mesh.js configuration
│   ├── midnight.ts     # Midnight protocol integration
│   └── utils.ts        # Utility functions
└── styles/             # Global styles
```

## 🔧 Configuration

### Wallet Configuration
The app automatically detects and connects to available Cardano wallets. Supported wallets:
- **Lace** (Recommended for Midnight)
- **Nami**
- **Eternl**
- **Flint**
- **Typhon**

### Network Configuration
- **Testnet**: Cardano Preprod testnet
- **Midnight**: Midnight testnet integration
- **Automatic Detection**: Network validation and switching prompts

## 🌐 Midnight Protocol Integration

### Zero-Knowledge Features
- **Private Transactions**: Shielded token transfers
- **Selective Disclosure**: Reveal only necessary information
- **Proof Generation**: Cryptographic ownership proofs
- **Privacy Preservation**: No transaction graph analysis

### Smart Contracts
- **Property Registry**: On-chain property registration
- **Token Minting**: Automated token generation
- **Transfer Logic**: Secure token transfer mechanisms
- **Verification**: Ownership and authenticity verification

## 🎨 UI Components

### Enhanced Wallet Connection
- **Multi-step Connection**: Guided wallet connection process
- **Real-time Status**: Live connection and balance updates
- **Error Handling**: Comprehensive error states and recovery
- **Network Validation**: Automatic testnet verification

### Responsive Navigation
- **Mobile-First**: Optimized for all screen sizes
- **Active States**: Visual feedback for current page
- **Wallet Status**: Integrated wallet connection indicator
- **Smooth Animations**: Fluid transitions and interactions

### Modern Design System
- **Dark Theme**: Consistent dark mode throughout
- **Gradient Accents**: Purple/blue gradient branding
- **Glass Morphism**: Backdrop blur effects
- **Micro-interactions**: Subtle hover and focus states

## 🔒 Security Features

### Wallet Security
- **No Private Key Storage**: Wallets remain in user control
- **Secure Communication**: Encrypted wallet communication
- **Permission Requests**: Explicit user consent for actions
- **Session Management**: Secure session handling

### Privacy Protection
- **Zero-Knowledge Proofs**: Mathematical privacy guarantees
- **Selective Disclosure**: Minimal information sharing
- **Encrypted Storage**: Secure local data storage
- **No Tracking**: Privacy-first analytics approach

## 🧪 Testing

### Testnet Setup
1. **Get Test ADA**: Use Cardano testnet faucet
2. **Switch Network**: Ensure wallet is on testnet
3. **Connect Wallet**: Use the enhanced wallet connection
4. **Test Features**: Try property registration and tokenization

## 📚 Resources

### Documentation
- [Midnight Network Docs](https://docs.midnight.network/)
- [Mesh.js Documentation](https://meshjs.dev/)
- [Cardano Developer Portal](https://developers.cardano.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License.