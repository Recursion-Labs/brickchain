// simulator.ts

import {
  type CircuitContext,
  QueryContext,
  dummyContractAddress,
  constructorContext
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger
} from "../managed/main/contract/index.cjs";
import { RealEstateTokenPrivateState, witnesses } from "../src";

// Simulator wrapper for RealEstateToken Compact contract
export class RealEstateTokenSimulator {
  private contract: Contract<RealEstateTokenPrivateState>;
  private circuitContext: CircuitContext<RealEstateTokenPrivateState>;

  constructor() {
    // init contract with witnesses
    this.contract = new Contract<RealEstateTokenPrivateState>(witnesses);

    // build initial state without zswap
    const address = "01" + "00".repeat(34); // TestNet network id 1, dummy address
    const initCtx = {
      contractAddress: address,
      initialPrivateState: createRealEstateTokenPrivateState(),
      initialZswapLocalState: {
        coinPublicKey: { bytes: new Uint8Array(32) },
        currentIndex: 0n,
        inputs: [],
        outputs: []
      } // Mock zswap for testing
    };

    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(initCtx);

    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      originalState: currentContractState,
      transactionContext: new QueryContext(
        currentContractState.data,
        dummyContractAddress()
      )
    };
  }

  // accessors
  public getLedger(): Ledger {
    return ledger(this.circuitContext.transactionContext.state);
  }

  public getPrivateState(): RealEstateTokenPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  // ---- Contract methods (impure circuits) ----

  public mint(to: bigint, amount: bigint): Ledger {
    const result = this.contract.circuits.mint(
      this.circuitContext,
      to,
      amount
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public transfer(from: bigint, to: bigint, amount: bigint): Ledger {
    const result = this.contract.circuits.transfer(
      this.circuitContext,
      from,
      to,
      amount
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public burn(from: bigint, amount: bigint): Ledger {
    const result = this.contract.circuits.burn(
      this.circuitContext,
      from,
      amount
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public pause_token(): Ledger {
    const result = this.contract.circuits.pause_token(this.circuitContext);
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public unpause_token(): Ledger {
    const result = this.contract.circuits.unpause_token(this.circuitContext);
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public register_property(propertyId: Uint8Array, owner: bigint): Ledger {
    const result = this.contract.circuits.register_property(
      this.circuitContext,
      propertyId,
      owner
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public tokenize_property(propertyId: Uint8Array, tokenId: bigint): Ledger {
    const result = this.contract.circuits.tokenize_property(
      this.circuitContext,
      propertyId,
      tokenId
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public transfer_property_ownership(propertyId: Uint8Array, newOwner: bigint): Ledger {
    const result = this.contract.circuits.transfer_property_ownership(
      this.circuitContext,
      propertyId,
      newOwner
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public deactivate_property(propertyId: Uint8Array): Ledger {
    const result = this.contract.circuits.deactivate_property(
      this.circuitContext,
      propertyId
    );
    this.circuitContext = result.context;
    return ledger(this.circuitContext.transactionContext.state);
  }
}

// ---- Private state initializer ----
function createRealEstateTokenPrivateState(): RealEstateTokenPrivateState {
  return {
    privateKey: undefined
  };
}
