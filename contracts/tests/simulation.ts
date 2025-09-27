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

  public mint(to: bigint, amount: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.mint(
      this.circuitContext,
      to,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public transfer(from: bigint, to: bigint, amount: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.transfer(
      this.circuitContext,
      from,
      to,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public approve(owner: bigint, spender: bigint, amount: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.approve(
      this.circuitContext,
      owner,
      spender,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public burn(from: bigint, amount: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.burn(
      this.circuitContext,
      from,
      amount
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public pause_token(): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.pause_token(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public unpause_token(): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.unpause_token(
      this.circuitContext
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public register_property(property_id: Uint8Array, owner_id: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.register_property(
      this.circuitContext,
      property_id,
      owner_id
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public tokenize_property(property_id: Uint8Array, token_id: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.tokenize_property(
      this.circuitContext,
      property_id,
      token_id
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public transfer_property_ownership(property_id: Uint8Array, new_owner_id: bigint): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.transfer_property_ownership(
      this.circuitContext,
      property_id,
      new_owner_id
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }

  public deactivate_property(property_id: Uint8Array): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.deactivate_property(
      this.circuitContext,
      property_id
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }
}

function createRealEstateTokenPrivateState(): RealEstateTokenPrivateState {
  return {
    privateKey: undefined,
  };
}