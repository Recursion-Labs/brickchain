// simulator.ts

import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
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

    // build initial state
    const initCtx = constructorContext(
      createRealEstateTokenPrivateState(),
      sampleContractAddress()
    );

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
        sampleContractAddress()
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

  public set_property_details(propertyId: Uint8Array, details: Uint8Array): Ledger {
    const result = this.contract.circuits.set_property_details(
      this.circuitContext,
      propertyId,
      details
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
}

// ---- Private state initializer ----
function createRealEstateTokenPrivateState(): RealEstateTokenPrivateState {
  return {
    privateKey: undefined
  };
}
