# 📄 Frontend.md – Midnight dApp Frontend Plan

---

## 🎯 Goal

Build a **React-based frontend** using **Mesh.js** (wallets, balances) and **Midnight.js** (proofs, shielded transfers) to showcase the dApp MVP flow.  

---

## 🛠 Tech

- **Framework:** React ( Next.js).  
- **UI:** Tailwind CSS / shadcn (for forms, tabs, modals).  
- **Wallet SDK:** Mesh.js.  
- **Privacy SDK:** Midnight.js.  

---

## 📂 Pages & Components

### 1. **Wallet & Dashboard**
- Connect Wallet (Mesh.js `useWallet()` hook).  
- Show balances of PROPERTY tokens.  
- Navigation Tabs: **Register | Mint | Transfer | Verify**.  

---

### 2. **Property Registration Page**
- **Upload Component** → upload dummy PDF.  
- **Hash Function** → SHA-256 (JS hashing).  
- **Register Button** → Midnight.js contract call (register property hash).  
- **Output** → Transaction hash + proof message.  

---

### 3. **Tokenization Page**
- **Form**: Property Value + Number of Tokens.  
- **Mint Button** → Midnight.js contract call (mint tokens).  
- **Output**: “1000 PROPERTY123 tokens minted → added to your wallet.”  

---

### 4. **Transfer Page**
- **Form**: Recipient Wallet + Token Amount.  
- **Shielded Transfer Button** → Midnight.js private transaction.  
- **Output**: Tx hash + success message.  

---

### 5. **Ownership Verification Page**
- **Dropdown/Input**: Select property ID.  
- **Verify Button** → Midnight.js selective disclosure proof.  
- **Output JSON Viewer**:  
  ```json
  {
    "propertyID": "hash123",
    "owner": "walletX",
    "share": "20%"
  }


## 🔑 Integration Plan

- **Mesh.js** → Handles wallet connection, reading balances, sending transactions.  
- **Midnight.js** → Handles property registration, shielded transfers, ZK proofs.  
- **React Components** → UI wrappers for inputs + buttons → call Mesh + Midnight SDK functions.  

---

## ✅ Deliverables (Frontend)

- **`WalletConnect.tsx`** → wallet connect UI.  
- **`RegisterProperty.tsx`** → upload + register property.  
- **`TokenizeProperty.tsx`** → mint property tokens.  
- **`TransferTokens.tsx`** → shielded transfer form.  
- **`VerifyOwnership.tsx`** → proof request + JSON output.  
- **`Dashboard.tsx`** → navigation + balance viewer.  

## 📁 Project Structure

```
app/
 ├─ src/
 │   ├─ components/
 │   │   ├─ WalletConnect.tsx
 │   │   ├─ RegisterProperty.tsx
 │   │   ├─ TokenizeProperty.tsx
 │   │   ├─ TransferTokens.tsx
 │   │   ├─ VerifyOwnership.tsx
 │   │   └─ Dashboard.tsx
 │   │
 │   ├─ hooks/
 │   │   └─ useWallet.ts
 │   │
 │   ├─ lib/
 │   │   ├─ midnight.ts   # Midnight SDK setup
 │   │   └─ mesh.ts       # Mesh.js wallet setup
 │   │
 │   ├─ pages/            # Next.js routing
 │   │   ├─ index.tsx     # Dashboard
 │   │   ├─ register.tsx
 │   │   ├─ tokenize.tsx
 │   │   ├─ transfer.tsx
 │   │   └─ verify.tsx
 │   │
 │   └─ styles/
 │       └─ globals.css   # Tailwind setup
 │
 └─ tsconfig.json
