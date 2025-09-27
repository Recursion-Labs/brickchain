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

// This is a simulator for testing the Real Estate Token Compact contract.
export class RealEstateTokenSimulator {
  readonly contract: Contract<RealEstateTokenPrivateState>;
  circuitContext: CircuitContext<RealEstateTokenPrivateState>;

  constructor() {
    this.contract = new Contract<RealEstateTokenPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      constructorContext(createRealEstateTokenPrivateState(), "0".repeat(64))
    );
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

  public getLedger(): Ledger {
    return ledger(this.circuitContext.transactionContext.state);
  }

  public getPrivateState(): RealEstateTokenPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  // ---- Circuits from main.compact ---- //

  public mint(to: bigint, amount: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.mint(
      this.circuitContext,
      to,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public transfer(from: bigint, to: bigint, amount: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.transfer(
      this.circuitContext,
      from,
      to,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public burn(from: bigint, amount: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.burn(
      this.circuitContext,
      from,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public set_property_details(propertyId: Uint8Array, details: Uint8Array): Ledger {
    this.circuitContext = this.contract.impureCircuits.set_property_details(
      this.circuitContext,
      propertyId,
      details
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public pause_token(): Ledger {
    this.circuitContext = this.contract.impureCircuits.pause_token(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public unpause_token(): Ledger {
    this.circuitContext = this.contract.impureCircuits.unpause_token(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }
}

// ---- Private state initializer ---- //
function createRealEstateTokenPrivateState(): RealEstateTokenPrivateState {
  return {
    privateKey: undefined,
  };
}
