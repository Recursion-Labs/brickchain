// witnesses.ts
// SPDX-License-Identifier: Apache-2.0
// Witness functions for the Real Estate Token Compact contract.

import { WitnessContext } from "@midnight-ntwrk/compact-runtime";

/**
 * Ledger type matches all exported ledgers from main.compact
 */
export type RealEstateTokenLedger = {
  total_supply: bigint;
  circulating_supply: bigint;
  nonce: bigint;
  balances: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: bigint): boolean;
    lookup(key: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  token_state: number; // Enum: 0 = Active, 1 = Paused, 2 = Frozen
  holder_count: bigint;
  holders: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: bigint): boolean;
    lookup(key: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
  property_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  property_owners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  property_token_ids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: Uint8Array): boolean;
    lookup(key: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
};

/**
 * Private state for the Real Estate Token contract.
 * Can hold secrets for off-chain proofs or private computations.
 */
export type RealEstateTokenPrivateState = {
  privateKey?: Uint8Array;
  // Add more private fields if needed for proofs
};

/**
 * Helper to create default private state
 */
export const createRealEstateTokenPrivateState = (): RealEstateTokenPrivateState => ({
  privateKey: undefined,
});

/**
 * Witness functions for all state-changing circuits in main.compact
 */
export const witnesses = {
  /**
   * Witness for mint
   */
  mint: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    to: bigint,
    amount: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Here you could add off-chain logic or proofs for minting
    return [ctx.privateState, null];
  },

  /**
   * Witness for transfer
   */
  transfer: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    from: bigint,
    to: bigint,
    amount: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Add off-chain verification logic if needed
    return [ctx.privateState, null];
  },

  /**
   * Witness for approve
   */
  approve: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    owner: bigint,
    spender: bigint,
    amount: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain proofs can be added here
    return [ctx.privateState, null];
  },

  /**
   * Witness for burn
   */
  burn: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    from: bigint,
    amount: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain proofs can be added here
    return [ctx.privateState, null];
  },

  /**
   * Witness for pause_token
   */
  pause_token: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain logging or auditing can be added
    return [ctx.privateState, null];
  },

  /**
   * Witness for unpause_token
   */
  unpause_token: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain verification before unpausing can be added
    return [ctx.privateState, null];
  },

  /**
   * Witness for register_property
   */
  register_property: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    property_id: Uint8Array,
    owner_id: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain validation can be added here
    return [ctx.privateState, null];
  },

  /**
   * Witness for tokenize_property
   */
  tokenize_property: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    property_id: Uint8Array,
    token_id: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain validation can be added here
    return [ctx.privateState, null];
  },

  /**
   * Witness for transfer_property_ownership
   */
  transfer_property_ownership: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    property_id: Uint8Array,
    new_owner_id: bigint
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain validation can be added here
    return [ctx.privateState, null];
  },

  /**
   * Witness for deactivate_property
   */
  deactivate_property: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    property_id: Uint8Array
  ): [RealEstateTokenPrivateState, null] => {
    // Off-chain validation can be added here
    return [ctx.privateState, null];
  },

  /**
   * Example witness to access the private key
   */
  getPrivateKey: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>
  ): [RealEstateTokenPrivateState, Uint8Array | null] => {
    return [ctx.privateState, ctx.privateState.privateKey ?? null];
  },
};
