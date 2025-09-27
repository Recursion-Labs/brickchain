# STEPS.md – Development Guide for Midnight Real Estate Tokenization dApp Frontend

## 1. Project Context
- Next.js + TypeScript project
- TailwindCSS + shadcn/ui for UI
- Midnight.js SDKs installed
- Mesh.js Wallet Widget installed
- Zustand installed for global state management

---
## Reference 
https://midnight.meshjs.dev/en/packages/wallet_widget/0_installtion_providers
 use this docs to refer for using mesh js component for midnight 

https://docs.midnight.network/academy/module-6 
this for how to build and test dapp

## 2. Pages / Routes

| Route       | Description                                             |
|------------|---------------------------------------------------------|
| `/`        | Dashboard: show wallet balance, navigation cards       |
| `/register`| Register a property (upload document, hash, call contract) |
| `/tokenize`| Tokenize property into tokens                           |
| `/transfer`| Transfer tokens to another wallet                       |
| `/verify`  | Verify property ownership with ZK proof                 |

---

## 3. Components (`src/components/`)

### WalletConnect.tsx
- Use Mesh.js Wallet Widget
- Connect / disconnect wallet
- Show wallet address
- Update global Zustand state

### RegisterProperty.tsx
- Form to upload property PDF
- SHA-256 file hashing
- Call `registerProperty(hash)`
- Display transaction hash + ZK proof
- Loader + error handling

### TokenizeProperty.tsx
- Form for property value + total tokens
- Call `mintTokens(propertyId, amount)`
- Show confirmation + wallet token balances
- Loader + error handling

### TransferTokens.tsx
- Form: recipient wallet + token amount
- Call `shieldedTransfer(recipient, amount)`
- Display transaction hash + proof
- Loader + error handling

### VerifyOwnership.tsx
- Input: property ID
- Call `generateProof(propertyId)`
- Show proof JSON
- Loader + error handling

---

## 4. Global State (`src/lib/`)

- **Zustand store:** wallet address, connection status, Midnight client
- **midnight.ts:** Initialize Midnight.js client for contract calls, ZK proofs, shielded transactions
- **mesh.ts:** Initialize Mesh.js Wallet Widget provider for wallet integration

---

## 5. UI / Styling
- Dashboard: card layout, soft shadows, rounded corners
- Forms: inputs, buttons, proper spacing, loader states
- Success / Error toast notifications (use shadcn/ui Toasts or similar)
- Tailwind classes for spacing, colors, rounded edges, shadows

---

## 6. Integration
- Import `WalletConnect` in all pages
- Use Midnight.js functions:
  - `registerProperty(hash)`
  - `mintTokens(propertyId, amount)`
  - `shieldedTransfer(recipient, amount)`
  - `generateProof(propertyId)`
- Share wallet & contract state using Zustand hooks / React Context

---

## 7. Development Flow
1. Implement global state (`midnight.ts` + `mesh.ts`)
2. Implement `WalletConnect` component
3. Implement form components (`RegisterProperty`, `TokenizeProperty`, etc.)
4. Create pages (`index.tsx`, `register.tsx`, `tokenize.tsx`, `transfer.tsx`, `verify.tsx`)
5. Add loader/error handling, toast notifications
6. Apply TailwindCSS + shadcn/ui styling
7. Test all workflows: wallet connect, register property, mint tokens, transfer, verify
8. Optimize code for readability, TypeScript safety, and minimal UI
