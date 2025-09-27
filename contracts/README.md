# Real Estate Token Contract (`main.compact`)

## Overview

`main.compact` is a **Compact language smart contract** that implements a **fungible token system** for real estate properties. It allows minting, transferring, and burning of tokens while tracking token holders, supply, and property metadata. The contract supports advanced features like **pausing and resuming token operations**, making it suitable for secure and flexible property-backed token management.

---

## Features

1. **Token Management**
   - **Minting:** Create new tokens and assign them to addresses.
   - **Transfer:** Move tokens between addresses securely.
   - **Burning:** Remove tokens from circulation.

2. **Advanced Token States**
   - `Active`: Token operations are allowed.
   - `Paused`: Token operations are temporarily disabled.
   - `Frozen`: Reserved for future extensions (currently unused).

3. **Supply Tracking**
   - `total_supply`: Total number of tokens ever minted.
   - `circulating_supply`: Number of tokens currently in circulation.
   - `nonce`: A counter for state changes, incremented on every operation.

4. **Holder Management**
   - `balances`: Ledger mapping of address → token balance.
   - `holders`: Ledger mapping of addresses holding tokens.
   - `holder_count`: Number of unique token holders.

5. **Property Metadata**
   - `property_details`: Ledger mapping property ID → hash of property document or metadata.
   - Sensitive property information is stored off-chain, while the hash ensures integrity on-chain.

6. **Pausing and Resuming**
   - `pause_token()`: Pauses all token transfers and operations.
   - `unpause_token()`: Resumes token operations if previously paused.

---

## Ledger Structure

| Ledger Name           | Type                       | Description                                           |
|----------------------|----------------------------|-------------------------------------------------------|
| `total_supply`        | `Uint<64>`                 | Total tokens minted                                   |
| `circulating_supply`  | `Uint<64>`                 | Tokens currently in circulation                      |
| `nonce`               | `Counter`                  | Tracks state changes                                  |
| `balances`            | `Map<Uint<32>, Uint<64>>` | Mapping of addresses to their token balances         |
| `token_state`         | `TokenState`               | Current operational state of the token               |
| `holder_count`        | `Uint<64>`                 | Total number of unique token holders                 |
| `holders`             | `Map<Uint<32>, Boolean>`   | Tracks whether an address holds any tokens           |
| `property_details`    | `Map<Uint<32>, Bytes<64>>`| Stores a hash representing property metadata         |

---

## Circuits (Functions)

### `mint(to: Uint<32>, amount: Uint<64>)`
- **Purpose:** Mint new tokens to a given address.
- **Checks:** Token must be active, amount must be positive.
- **Updates:** Balances, total supply, circulating supply, holder count, nonce.

### `transfer(from: Uint<32>, to: Uint<32>, amount: Uint<64>)`
- **Purpose:** Transfer tokens from one address to another.
- **Checks:** Token must be active, amount positive, sender has enough balance.
- **Updates:** Sender & recipient balances, holder count, nonce.

### `burn(from: Uint<32>, amount: Uint<64>)`
- **Purpose:** Burn tokens from a holder’s balance.
- **Checks:** Token must be active, amount positive, holder has enough balance.
- **Updates:** Balances, total & circulating supply, nonce.

### `set_property_details(property_id: Uint<32>, details_hash: Bytes<64>)`
- **Purpose:** Store hash of property details on-chain.
- **Updates:** `property_details` ledger and nonce.

### `pause_token()`
- **Purpose:** Temporarily disable token operations.
- **Updates:** Token state to `Paused` and increments nonce.

### `unpause_token()`
- **Purpose:** Re-enable token operations if paused.
- **Checks:** Token must be paused.
- **Updates:** Token state to `Active` and increments nonce.

---

## Example Use Case: Real Estate Tokenization

### Scenario
- **Property ID:** `101`
- **Owner:** Address `1`
- **Buyer:** Address `2`
- **Token Representation:** 1000 tokens represent 1 property

### Steps

1. **Set Property Metadata**
```
ts
const propertyId = 101;
const propertyHash = new Uint8Array(64).fill(123); // hash of property document
contract.set_property_details(propertyId, propertyHash);
```

2. **Mint Tokens to Owner**

```
ts
contract.mint(1, 1000n); // 1000 tokens represent ownership of property 101
```
3. **Transfer Tokens to Buyer (Partial Sale)**

```
ts
contract.transfer(1, 2, 300n); // buyer purchases 30% of property
```
4. **Check Balances**

```
ts
console.log(contract.balances.lookup(1)); // 700n
console.log(contract.balances.lookup(2)); // 300n
```

5. **Pause Token Transfers (Maintenance / Audit)**

```
ts
contract.pause_token();
```

6. **Resume Token Transfers**

```
ts
contract.unpause_token();
```

7. **Burn Tokens (Optional for Buyback / Redemption)**

```
ts
contract.burn(2, 100n); // buyer returns 100 tokens to reduce circulation
```

### Notes

Security: Only the active token state allows minting, transfers, and burning.

Extensibility: The contract can be extended with additional token states, property metadata, or permission controls.

Off-chain Storage: Sensitive property details should be stored off-chain; only the hash is stored on-chain for integrity verification.

