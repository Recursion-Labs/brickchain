
import {
  NetworkId,
  setNetworkId
} from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";
import { RealEstateTokenSimulator } from "./simulation";

setNetworkId(NetworkId.Undeployed);

describe("Real Estate Token smart contract", () => {
  it("generates initial ledger state deterministically", () => {
    const simulator0 = new RealEstateTokenSimulator();
    const simulator1 = new RealEstateTokenSimulator();
    expect(simulator0.getLedger()).toEqual(simulator1.getLedger());
  });

  it("properly initializes ledger state and private state", () => {
    const simulator = new RealEstateTokenSimulator();
    const initialLedgerState = simulator.getLedger();
    expect(initialLedgerState.total_supply).toEqual(0n);
    expect(initialLedgerState.circulating_supply).toEqual(0n);
    expect(initialLedgerState.nonce).toEqual(0n);
    expect(initialLedgerState.token_state).toEqual(0); // Active
    expect(initialLedgerState.holder_count).toEqual(0n);
    expect(initialLedgerState.balances.isEmpty()).toBe(true);
    expect(initialLedgerState.holders.isEmpty()).toBe(true);
    expect(initialLedgerState.property_statuses.isEmpty()).toBe(true);
    expect(initialLedgerState.property_owners.isEmpty()).toBe(true);
    expect(initialLedgerState.property_token_ids.isEmpty()).toBe(true);

    const initialPrivateState = simulator.getPrivateState();
    expect(initialPrivateState).toEqual({ privateKey: undefined });
  });

  describe("Token operations", () => {
    it("mints tokens correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const recipient = 1n;
      const amount = 1000n;

      const newLedgerState = simulator.mint(recipient, amount);

      expect(newLedgerState.total_supply).toEqual(amount);
      expect(newLedgerState.circulating_supply).toEqual(amount);
      expect(newLedgerState.nonce).toEqual(1n);
      expect(newLedgerState.holder_count).toEqual(1n);
      expect(newLedgerState.balances.lookup(recipient)).toEqual(amount);
      expect(newLedgerState.holders.lookup(recipient)).toBe(true);
    });

    it("transfers tokens correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const sender = 1n;
      const recipient = 2n;
      const amount = 500n;

      // First mint some tokens
      simulator.mint(sender, 1000n);

      const transferLedgerState = simulator.transfer(sender, recipient, amount);

      expect(transferLedgerState.total_supply).toEqual(1000n);
      expect(transferLedgerState.circulating_supply).toEqual(1000n);
      expect(transferLedgerState.nonce).toEqual(2n);
      expect(transferLedgerState.holder_count).toEqual(2n);
      expect(transferLedgerState.balances.lookup(sender)).toEqual(500n);
      expect(transferLedgerState.balances.lookup(recipient)).toEqual(amount);
      expect(transferLedgerState.holders.lookup(sender)).toBe(true);
      expect(transferLedgerState.holders.lookup(recipient)).toBe(true);
    });

    it("burns tokens correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const holder = 1n;
      const mintAmount = 1000n;
      const burnAmount = 300n;

      // First mint some tokens
      simulator.mint(holder, mintAmount);

      const burnLedgerState = simulator.burn(holder, burnAmount);

      expect(burnLedgerState.total_supply).toEqual(mintAmount - burnAmount);
      expect(burnLedgerState.circulating_supply).toEqual(mintAmount - burnAmount);
      expect(burnLedgerState.nonce).toEqual(2n);
      expect(burnLedgerState.balances.lookup(holder)).toEqual(mintAmount - burnAmount);
    });

    it("fails to mint when token is paused", () => {
      const simulator = new RealEstateTokenSimulator();

      // Pause the token
      simulator.pause_token();

      expect(() => {
        simulator.mint(1n, 1000n);
      }).toThrow("Token is not active");
    });

    it("fails to transfer when token is paused", () => {
      const simulator = new RealEstateTokenSimulator();

      // Mint some tokens first
      simulator.mint(1n, 1000n);

      // Pause the token
      simulator.pause_token();

      expect(() => {
        simulator.transfer(1n, 2n, 500n);
      }).toThrow("Token is not active");
    });

    it("fails to transfer with insufficient balance", () => {
      const simulator = new RealEstateTokenSimulator();

      // Mint some tokens
      simulator.mint(1n, 500n);

      expect(() => {
        simulator.transfer(1n, 2n, 1000n);
      }).toThrow("Insufficient balance");
    });

    it("fails to transfer from non-existent account", () => {
      const simulator = new RealEstateTokenSimulator();

      expect(() => {
        simulator.transfer(1n, 2n, 100n);
      }).toThrow("Sender has no balance");
    });

    it("pauses and unpauses token correctly", () => {
      const simulator = new RealEstateTokenSimulator();

      // Initially active
      expect(simulator.getLedger().token_state).toEqual(0);

      // Pause token
      const pausedLedgerState = simulator.pause_token();
      expect(pausedLedgerState.token_state).toEqual(1); // Paused
      expect(pausedLedgerState.nonce).toEqual(1n);

      // Unpause token
      const unpausedLedgerState = simulator.unpause_token();
      expect(unpausedLedgerState.token_state).toEqual(0); // Active
      expect(unpausedLedgerState.nonce).toEqual(2n);
    });

    it("fails to unpause when token is not paused", () => {
      const simulator = new RealEstateTokenSimulator();

      expect(() => {
        simulator.unpause_token();
      }).toThrow("Token is not paused");
    });
  });

  describe("Property operations", () => {
    it("registers property correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const ownerId = 1n;

      const newLedgerState = simulator.register_property(propertyId, ownerId);

      expect(newLedgerState.nonce).toEqual(1n);
      expect(newLedgerState.property_statuses.lookup(propertyId)).toEqual(0); // Registered
      expect(newLedgerState.property_owners.lookup(propertyId)).toEqual(ownerId);
    });

    it("tokenizes property correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const ownerId = 1n;
      const tokenId = 100n;

      // Register property first
      simulator.register_property(propertyId, ownerId);

      const tokenizedLedgerState = simulator.tokenize_property(propertyId, tokenId);

      expect(tokenizedLedgerState.nonce).toEqual(2n);
      expect(tokenizedLedgerState.property_statuses.lookup(propertyId)).toEqual(1); // Tokenized
      expect(tokenizedLedgerState.property_token_ids.lookup(propertyId)).toEqual(tokenId);
    });

    it("transfers property ownership correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const originalOwner = 1n;
      const newOwner = 2n;

      // Register property first
      simulator.register_property(propertyId, originalOwner);

      const transferredLedgerState = simulator.transfer_property_ownership(propertyId, newOwner);

      expect(transferredLedgerState.nonce).toEqual(2n);
      expect(transferredLedgerState.property_statuses.lookup(propertyId)).toEqual(2); // Transferred
      expect(transferredLedgerState.property_owners.lookup(propertyId)).toEqual(newOwner);
    });

    it("deactivates property correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const ownerId = 1n;

      // Register property first
      simulator.register_property(propertyId, ownerId);

      const deactivatedLedgerState = simulator.deactivate_property(propertyId);

      expect(deactivatedLedgerState.nonce).toEqual(2n);
      expect(deactivatedLedgerState.property_statuses.lookup(propertyId)).toEqual(3); // Deactivated
    });

    it("fails to register already registered property", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const ownerId = 1n;

      // Register property first
      simulator.register_property(propertyId, ownerId);

      expect(() => {
        simulator.register_property(propertyId, 2n);
      }).toThrow("Property already registered");
    });

    it("fails to tokenize unregistered property", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const tokenId = 100n;

      expect(() => {
        simulator.tokenize_property(propertyId, tokenId);
      }).toThrow("Property not registered");
    });

    it("fails to tokenize property not in registered state", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const ownerId = 1n;
      const tokenId = 100n;

      // Register and tokenize property
      simulator.register_property(propertyId, ownerId);
      simulator.tokenize_property(propertyId, tokenId);

      // Try to tokenize again
      expect(() => {
        simulator.tokenize_property(propertyId, 200n);
      }).toThrow("Property not in Registered state");
    });

    it("fails to transfer ownership of unregistered property", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);
      const newOwner = 2n;

      expect(() => {
        simulator.transfer_property_ownership(propertyId, newOwner);
      }).toThrow("Property not registered");
    });

    it("fails to deactivate unregistered property", () => {
      const simulator = new RealEstateTokenSimulator();
      const propertyId = new Uint8Array(32).fill(1);

      expect(() => {
        simulator.deactivate_property(propertyId);
      }).toThrow("Property not registered");
    });
  });

  describe("Edge cases and validation", () => {
    it("fails to mint zero amount", () => {
      const simulator = new RealEstateTokenSimulator();

      expect(() => {
        simulator.mint(1n, 0n);
      }).toThrow("Amount must be positive");
    });

    it("fails to transfer zero amount", () => {
      const simulator = new RealEstateTokenSimulator();

      // Mint some tokens first
      simulator.mint(1n, 1000n);

      expect(() => {
        simulator.transfer(1n, 2n, 0n);
      }).toThrow("Amount must be positive");
    });

    it("fails to burn zero amount", () => {
      const simulator = new RealEstateTokenSimulator();

      // Mint some tokens first
      simulator.mint(1n, 1000n);

      expect(() => {
        simulator.burn(1n, 0n);
      }).toThrow("Amount must be positive");
    });

    it("handles multiple mints to same address correctly", () => {
      const simulator = new RealEstateTokenSimulator();
      const recipient = 1n;
      const amount1 = 500n;
      const amount2 = 300n;

      simulator.mint(recipient, amount1);
      const finalLedgerState = simulator.mint(recipient, amount2);

      expect(finalLedgerState.total_supply).toEqual(amount1 + amount2);
      expect(finalLedgerState.circulating_supply).toEqual(amount1 + amount2);
      expect(finalLedgerState.balances.lookup(recipient)).toEqual(amount1 + amount2);
      expect(finalLedgerState.holder_count).toEqual(1n); // Still only one holder
      expect(finalLedgerState.nonce).toEqual(2n);
    });

    it("handles transfer to existing holder correctly", () => {
      const simulator = new RealEstateTokenSimulator();

      // Mint to both addresses
      simulator.mint(1n, 1000n);
      simulator.mint(2n, 500n);

      // Transfer from 1 to 2
      const transferLedgerState = simulator.transfer(1n, 2n, 300n);

      expect(transferLedgerState.balances.lookup(1n)).toEqual(700n);
      expect(transferLedgerState.balances.lookup(2n)).toEqual(800n);
      expect(transferLedgerState.holder_count).toEqual(2n); // Still 2 holders
    });
  });
});