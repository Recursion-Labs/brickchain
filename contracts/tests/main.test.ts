// main.test.ts
import { describe, it, expect } from "vitest";
import { NetworkId, setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";

import { RealEstateTokenSimulator } from "./simulation";

setNetworkId(NetworkId.TestNet);

const makeSimulator = () => new RealEstateTokenSimulator();

describe("Real Estate Token smart contract", () => {
  it("initializes correctly", () => {
    const simulator = makeSimulator();
    const ledger = simulator.getLedger();

    expect(ledger.total_supply).toEqual(0n);
    expect(ledger.circulating_supply).toEqual(0n);
    expect(ledger.nonce).toEqual(0n);
    expect(ledger.token_state).toEqual(0); // Active
    expect(ledger.holder_count).toEqual(0n);
    expect(ledger.balances.isEmpty()).toBe(true);
    expect(ledger.holders.isEmpty()).toBe(true);
    expect(ledger.property_statuses.isEmpty()).toBe(true);
  });

  describe("Token operations", () => {
    it("mints tokens correctly", () => {
      const simulator = makeSimulator();
      const recipient = 1n;
      const amount = 1000n;

      simulator.mint(recipient, amount);
      const ledger = simulator.getLedger();

      expect(ledger.total_supply).toEqual(amount);
      expect(ledger.circulating_supply).toEqual(amount);
      expect(ledger.balances.lookup(recipient)).toEqual(amount);
      expect(ledger.holders.lookup(recipient)).toBe(true);
      expect(ledger.holder_count).toEqual(1n);
    });

    it("transfers tokens correctly", () => {
      const simulator = makeSimulator();
      simulator.mint(1n, 1000n);
      simulator.transfer(1n, 2n, 400n);

      const ledger = simulator.getLedger();
      expect(ledger.balances.lookup(1n)).toEqual(600n);
      expect(ledger.balances.lookup(2n)).toEqual(400n);
      expect(ledger.holder_count).toEqual(2n);
    });

    it("burns tokens correctly", () => {
      const simulator = makeSimulator();
      simulator.mint(1n, 1000n);
      simulator.burn(1n, 300n);

      const ledger = simulator.getLedger();
      expect(ledger.total_supply).toEqual(700n);
      expect(ledger.circulating_supply).toEqual(700n);
      expect(ledger.balances.lookup(1n)).toEqual(700n);
    });

    it("pauses and unpauses token", () => {
      const simulator = makeSimulator();

      simulator.pause_token();
      expect(simulator.getLedger().token_state).toEqual(1); // Paused

      simulator.unpause_token();
      expect(simulator.getLedger().token_state).toEqual(0); // Active
    });

    it("fails to mint when paused", () => {
      const simulator = makeSimulator();
      simulator.pause_token();
      expect(() => simulator.mint(1n, 100n)).toThrow("Token is not active");
    });

    it("fails to transfer with insufficient balance", () => {
      const simulator = makeSimulator();
      simulator.mint(1n, 100n);
      expect(() => simulator.transfer(1n, 2n, 200n)).toThrow("Insufficient balance");
    });
  });

  describe("Property operations", () => {
    it("registers property correctly", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const owner = 1n;

      simulator.register_property(propertyId, owner);
      const ledger = simulator.getLedger();

      expect(ledger.property_statuses.lookup(propertyId)).toEqual(0); // Registered
      expect(ledger.property_owners.lookup(propertyId)).toEqual(owner);
    });

    it("tokenizes registered property", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(2);

      simulator.register_property(propertyId, 1n);
      simulator.tokenize_property(propertyId, 100n);

      const ledger = simulator.getLedger();
      expect(ledger.property_statuses.lookup(propertyId)).toEqual(1); // Tokenized
      expect(ledger.property_token_ids.lookup(propertyId)).toEqual(100n);
    });

    it("transfers ownership", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(3);

      simulator.register_property(propertyId, 1n);
      simulator.transfer_property_ownership(propertyId, 2n);

      const ledger = simulator.getLedger();
      expect(ledger.property_statuses.lookup(propertyId)).toEqual(2); // Transferred
      expect(ledger.property_owners.lookup(propertyId)).toEqual(2n);
    });

    it("deactivates property", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(4);

      simulator.register_property(propertyId, 1n);
      simulator.deactivate_property(propertyId);

      const ledger = simulator.getLedger();
      expect(ledger.property_statuses.lookup(propertyId)).toEqual(3); // Deactivated
    });
  });

  describe("Validation checks", () => {
    it("fails to mint zero amount", () => {
      const simulator = makeSimulator();
      expect(() => simulator.mint(1n, 0n)).toThrow("Amount must be positive");
    });

    it("fails to burn zero amount", () => {
      const simulator = makeSimulator();
      simulator.mint(1n, 100n);
      expect(() => simulator.burn(1n, 0n)).toThrow("Amount must be positive");
    });

    it("fails to tokenize unregistered property", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(9);
      expect(() => simulator.tokenize_property(propertyId, 123n)).toThrow("Property not registered");
    });

    it("fails to re-register property", () => {
      const simulator = makeSimulator();
      const propertyId = new Uint8Array(32).fill(5);

      simulator.register_property(propertyId, 1n);
      expect(() => simulator.register_property(propertyId, 2n)).toThrow("Property already registered");
    });
  });
});
