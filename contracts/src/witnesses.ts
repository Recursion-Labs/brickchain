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
  balances: Map<bigint, bigint>;
  token_state: number; // Enum: 0 = Active, 1 = Paused, 2 = Frozen
  holder_count: bigint;
  holders: Map<bigint, boolean>;
  property_details: Map<bigint, Uint8Array>;
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
   * Witness for set_property_details
   */
  set_property_details: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>,
    property_id: bigint,
    details_hash: Uint8Array
  ): [RealEstateTokenPrivateState, null] => {
    // Can optionally validate property hash off-chain
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
   * Example witness to access the private key
   */
  getPrivateKey: (
    ctx: WitnessContext<RealEstateTokenLedger, RealEstateTokenPrivateState>
  ): [RealEstateTokenPrivateState, Uint8Array | null] => {
    return [ctx.privateState, ctx.privateState.privateKey ?? null];
  },
};
