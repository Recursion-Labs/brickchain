// Midnight Lace Wallet Provider Implementation
// Based on official Midnight Network documentation and create-midnight-dapp patterns

export interface MidnightWalletState {
  address: string; // Bech32m-encoded address
  coinPublicKey: string; // Bech32m-encoded coin public key
  encryptionPublicKey: string; // Bech32m-encoded encryption public key
  balance?: string;
  isConnected: boolean;
}

export interface MidnightWalletAPI {
  state(): Promise<{
    address: string;
    coinPublicKey: string;
    encryptionPublicKey: string;
    addressLegacy?: string; // Deprecated
    coinPublicKeyLegacy?: string; // Deprecated
    encryptionPublicKeyLegacy?: string; // Deprecated
  }>;
  submitTransaction(tx: any): Promise<string>;
  isEnabled(): Promise<boolean>;
  enable(): Promise<MidnightWalletAPI>;
}

export interface MidnightLaceProvider {
  enable(): Promise<MidnightWalletAPI>;
  isEnabled(): Promise<boolean>;
  serviceUriConfig(): Promise<any>;
}

// Global window extensions for Midnight Lace wallet
declare global {
  interface Window {
    midnight?: {
      mnLace?: MidnightLaceProvider;
    };
  }
}

export class MidnightWalletError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'MidnightWalletError';
  }
}

export const WALLET_ERRORS = {
  NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  NOT_ENABLED: 'WALLET_NOT_ENABLED',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
} as const;

export type WalletErrorCode = typeof WALLET_ERRORS[keyof typeof WALLET_ERRORS];