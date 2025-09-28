# BrickChain CLI Usage Guide

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Command Overview](#command-overview)
4. [Contract Commands](#contract-commands)
5. [Token Management Commands](#token-management-commands)
6. [Property Management Commands](#property-management-commands)
7. [Network Commands](#network-commands)
8. [Wallet Commands](#wallet-commands)
9. [Testing Commands](#testing-commands)
10. [Advanced Usage](#advanced-usage)
11. [Scripting and Automation](#scripting-and-automation)
12. [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites
```bash
# Ensure Node.js is installed
node --version  # Should be >= 18.0.0

# Ensure npm is installed
npm --version   # Should be >= 9.0.0
```

### Installing the CLI

#### Local Project Installation
```bash
# Navigate to project directory
cd /path/to/brickchain

# Install CLI locally
cd cli
npm install

# Build the CLI
npm run build

# Create alias for convenience
alias brickchain="node $(pwd)/dist/index.js"
```

#### Development Installation
```bash
# Clone repository
git clone https://github.com/your-org/brickchain.git
cd brickchain/cli

# Install dependencies
npm install

# Link for development
npm link

# Now available globally as 'brickchain'
brickchain --help
```

## Configuration

### Initial Setup
```bash
# Initialize CLI configuration
brickchain init

# This creates ~/.brickchain/config.json with:
# - Network settings
# - Wallet configuration
# - API endpoints
```

### Configuration File Structure
```json
{
  "network": "testnet",
  "networks": {
    "local": {
      "rpcUrl": "http://localhost:8545",
      "proofServer": "http://localhost:6300",
      "indexer": "http://localhost:8080"
    },
    "testnet": {
      "rpcUrl": "https://node.midnight-testnet.network",
      "proofServer": "https://proof.midnight-testnet.network",
      "indexer": "https://indexer.midnight-testnet.network"
    },
    "mainnet": {
      "rpcUrl": "https://node.midnight.network",
      "proofServer": "https://proof.midnight.network",
      "indexer": "https://indexer.midnight.network"
    }
  },
  "wallet": {
    "path": "~/.brickchain/wallet.json",
    "encrypted": true
  },
  "contracts": {
    "token": "0x...",
    "governance": "0x..."
  },
  "gas": {
    "limit": 5000000,
    "price": "auto"
  }
}
```

### Environment Variables
```bash
# Set network via environment
export MIDNIGHT_NETWORK=testnet

# Set proof server URL
export PROOF_SERVER_URL=http://localhost:6300

# Set private key (not recommended for production)
export PRIVATE_KEY=0x...

# Set contract address
export CONTRACT_ADDRESS=0x...
```

## Command Overview

### Basic Command Structure
```bash
brickchain [command] [subcommand] [options] [arguments]
```

### Global Options
```bash
# Available for all commands
--network, -n <network>    # Specify network (local/testnet/mainnet)
--config, -c <path>        # Path to config file
--verbose, -v              # Verbose output
--quiet, -q                # Minimal output
--json                     # Output in JSON format
--help, -h                 # Show help
--version                  # Show version
```

### Command Categories
```bash
# View all available commands
brickchain --help

Commands:
  contract    Smart contract management
  token       Token operations
  property    Property management
  wallet      Wallet operations
  network     Network utilities
  test        Testing utilities
  admin       Administrative functions
```

## Contract Commands

### Deploy Contract
```bash
# Deploy new contract
brickchain contract deploy [options]

Options:
  --contract, -c <path>      Path to contract file (default: ./contracts/main.compact)
  --network, -n <network>    Target network (local/testnet/mainnet)
  --gas-limit <amount>       Gas limit for deployment
  --gas-price <price>        Gas price in gwei
  --constructor-args <args>  Constructor arguments (JSON)
  --verify                   Verify contract after deployment

Examples:
# Deploy to testnet
brickchain contract deploy --network testnet

# Deploy with constructor arguments
brickchain contract deploy --constructor-args '{"initialSupply": 1000000}'

# Deploy and verify
brickchain contract deploy --network mainnet --verify
```

### Compile Contract
```bash
# Compile Compact contracts
brickchain contract compile [options]

Options:
  --source, -s <path>        Source file or directory
  --output, -o <path>        Output directory for artifacts
  --optimize                 Enable optimization
  --runs <number>            Optimization runs (default: 200)

Examples:
# Compile single contract
brickchain contract compile --source contracts/main.compact

# Compile all contracts with optimization
brickchain contract compile --source contracts/ --optimize

# Custom output directory
brickchain contract compile --output build/contracts
```

### Verify Contract
```bash
# Verify deployed contract
brickchain contract verify [options]

Options:
  --address <address>        Contract address
  --contract <name>          Contract name
  --constructor-args <args>  Constructor arguments used
  --network <network>        Network where contract is deployed

Example:
brickchain contract verify \
  --address 0x123... \
  --contract RealEstateToken \
  --network testnet
```

### Contract Info
```bash
# Get contract information
brickchain contract info <address> [options]

Options:
  --abi                      Show contract ABI
  --bytecode                 Show bytecode
  --storage                  Show storage layout
  --functions                List all functions

Examples:
# Basic info
brickchain contract info 0x123...

# Show ABI
brickchain contract info 0x123... --abi

# Show all functions
brickchain contract info 0x123... --functions
```

## Token Management Commands

### Mint Tokens
```bash
# Mint new tokens
brickchain token mint [options]

Options:
  --to <address>             Recipient address
  --amount <amount>          Amount to mint
  --property-id <id>         Associated property ID
  --metadata <data>          Additional metadata (JSON)

Examples:
# Basic minting
brickchain token mint --to 0xabc... --amount 1000000

# Mint with property association
brickchain token mint \
  --to 0xabc... \
  --amount 1000000 \
  --property-id 101

# Mint with metadata
brickchain token mint \
  --to 0xabc... \
  --amount 1000000 \
  --metadata '{"description": "Property A tokens"}'
```

### Transfer Tokens
```bash
# Transfer tokens between addresses
brickchain token transfer [options]

Options:
  --from <address>           Sender address (default: current wallet)
  --to <address>             Recipient address
  --amount <amount>          Amount to transfer
  --shielded                 Use shielded transfer
  --memo <text>              Transfer memo

Examples:
# Basic transfer
brickchain token transfer --to 0xdef... --amount 500

# Shielded transfer
brickchain token transfer --to 0xdef... --amount 500 --shielded

# Transfer with memo
brickchain token transfer \
  --to 0xdef... \
  --amount 500 \
  --memo "Payment for property share"
```

### Burn Tokens
```bash
# Burn tokens from circulation
brickchain token burn [options]

Options:
  --from <address>           Address to burn from
  --amount <amount>          Amount to burn
  --reason <text>            Reason for burning

Examples:
# Burn tokens
brickchain token burn --amount 1000

# Burn with reason
brickchain token burn --amount 1000 --reason "Buyback program"
```

### Check Balance
```bash
# Check token balance
brickchain token balance [address] [options]

Options:
  --token <address>          Token contract address
  --format <format>          Output format (wei/ether/human)
  --include-locked           Include locked tokens

Examples:
# Check own balance
brickchain token balance

# Check specific address
brickchain token balance 0xabc...

# Check with formatting
brickchain token balance --format human

# Include locked tokens
brickchain token balance --include-locked
```

### Token Info
```bash
# Get token information
brickchain token info [options]

Options:
  --supply                   Show total and circulating supply
  --holders                  Show holder count
  --state                    Show token state (active/paused)
  --metadata                 Show token metadata

Examples:
# Basic info
brickchain token info

# Show supply details
brickchain token info --supply

# Show all information
brickchain token info --supply --holders --state --metadata
```

## Property Management Commands

### Register Property
```bash
# Register new property
brickchain property register [options]

Options:
  --id <id>                  Property ID
  --document <path>          Path to property document
  --metadata <json>          Property metadata
  --ipfs                     Store document on IPFS

Examples:
# Basic registration
brickchain property register --id 101 --document ./docs/property.pdf

# Register with IPFS storage
brickchain property register \
  --id 101 \
  --document ./docs/property.pdf \
  --ipfs

# Register with metadata
brickchain property register \
  --id 101 \
  --document ./docs/property.pdf \
  --metadata '{"address": "123 Main St", "size": "2000 sqft"}'
```

### Update Property
```bash
# Update property details
brickchain property update [options]

Options:
  --id <id>                  Property ID
  --document <path>          New document path
  --metadata <json>          Updated metadata
  --hash <hash>              Document hash

Example:
brickchain property update \
  --id 101 \
  --metadata '{"status": "renovated", "value": 500000}'
```

### Get Property Details
```bash
# Get property information
brickchain property get <id> [options]

Options:
  --include-history          Include transaction history
  --include-holders          Include current token holders
  --format <format>          Output format (json/table)

Examples:
# Basic property info
brickchain property get 101

# With history
brickchain property get 101 --include-history

# With holders
brickchain property get 101 --include-holders
```

### List Properties
```bash
# List all properties
brickchain property list [options]

Options:
  --owner <address>          Filter by owner
  --status <status>          Filter by status
  --limit <number>           Maximum results
  --offset <number>          Pagination offset

Examples:
# List all properties
brickchain property list

# Filter by owner
brickchain property list --owner 0xabc...

# Paginated results
brickchain property list --limit 10 --offset 20
```

## Network Commands

### Network Status
```bash
# Check network status
brickchain network status [options]

Options:
  --detailed                 Show detailed information
  --endpoints                Show all endpoints

Examples:
# Basic status
brickchain network status

# Detailed status
brickchain network status --detailed
```

### Switch Network
```bash
# Switch active network
brickchain network switch <network>

Examples:
# Switch to testnet
brickchain network switch testnet

# Switch to local
brickchain network switch local
```

### Sync Status
```bash
# Check blockchain sync status
brickchain network sync [options]

Options:
  --watch                    Watch sync progress
  --interval <seconds>       Update interval (default: 5)

Examples:
# Check sync status
brickchain network sync

# Watch progress
brickchain network sync --watch
```

### Gas Estimation
```bash
# Estimate gas for transaction
brickchain network gas [options]

Options:
  --function <name>          Function to estimate
  --args <json>              Function arguments
  --from <address>           Transaction sender

Example:
brickchain network gas \
  --function transfer \
  --args '{"to": "0xabc...", "amount": 1000}'
```

## Wallet Commands

### Create Wallet
```bash
# Create new wallet
brickchain wallet create [options]

Options:
  --name <name>              Wallet name
  --password <password>      Wallet password
  --mnemonic                 Use mnemonic phrase
  --path <path>              Derivation path

Examples:
# Create basic wallet
brickchain wallet create --name primary

# Create with mnemonic
brickchain wallet create --name primary --mnemonic

# Custom derivation path
brickchain wallet create --path "m/44'/60'/0'/0/0"
```

### Import Wallet
```bash
# Import existing wallet
brickchain wallet import [options]

Options:
  --private-key <key>        Private key to import
  --mnemonic <phrase>        Mnemonic phrase
  --keystore <path>          Keystore file path
  --password <password>      Keystore password

Examples:
# Import private key
brickchain wallet import --private-key 0x...

# Import mnemonic
brickchain wallet import --mnemonic "word1 word2 ..."

# Import keystore
brickchain wallet import --keystore ./keystore.json
```

### List Wallets
```bash
# List all wallets
brickchain wallet list [options]

Options:
  --show-address             Show wallet addresses
  --show-balance             Show balances

Example:
brickchain wallet list --show-address --show-balance
```

### Export Wallet
```bash
# Export wallet
brickchain wallet export [options]

Options:
  --wallet <name>            Wallet to export
  --format <format>          Export format (private-key/keystore/mnemonic)
  --output <path>            Output file path

Examples:
# Export as private key
brickchain wallet export --wallet primary --format private-key

# Export as keystore
brickchain wallet export \
  --wallet primary \
  --format keystore \
  --output ./backup.json
```

## Testing Commands

### Run Tests
```bash
# Run contract tests
brickchain test run [options]

Options:
  --file <path>              Specific test file
  --pattern <pattern>        Test file pattern
  --network <network>        Test network
  --coverage                 Generate coverage report
  --gas-report               Generate gas usage report

Examples:
# Run all tests
brickchain test run

# Run specific test file
brickchain test run --file test/token.test.ts

# Run with coverage
brickchain test run --coverage

# Generate gas report
brickchain test run --gas-report
```

### Integration Tests
```bash
# Run integration tests
brickchain test integration [options]

Options:
  --scenario <name>          Specific scenario to test
  --environment <env>        Test environment
  --parallel                 Run tests in parallel

Example:
brickchain test integration --scenario property-tokenization
```

### Stress Testing
```bash
# Run stress tests
brickchain test stress [options]

Options:
  --transactions <number>    Number of transactions
  --concurrent <number>      Concurrent transactions
  --duration <seconds>       Test duration

Example:
brickchain test stress \
  --transactions 1000 \
  --concurrent 10 \
  --duration 60
```

## Advanced Usage

### Batch Operations
```bash
# Execute batch operations from file
brickchain batch execute <file> [options]

Options:
  --dry-run                  Simulate execution
  --continue-on-error        Continue if operation fails
  --parallel <number>        Parallel execution count

Example batch file (batch.json):
```json
{
  "operations": [
    {
      "type": "mint",
      "params": {
        "to": "0xabc...",
        "amount": 1000
      }
    },
    {
      "type": "transfer",
      "params": {
        "to": "0xdef...",
        "amount": 500
      }
    }
  ]
}
```

```bash
# Execute batch
brickchain batch execute batch.json

# Dry run
brickchain batch execute batch.json --dry-run
```

### Script Execution
```bash
# Execute JavaScript/TypeScript scripts
brickchain script run <script> [options]

Options:
  --args <json>              Script arguments
  --timeout <seconds>        Execution timeout

Example script (distribute.js):
```javascript
async function main(args) {
  const { recipients, amount } = args;
  
  for (const recipient of recipients) {
    await brickchain.token.transfer({
      to: recipient,
      amount: amount / recipients.length
    });
  }
}

module.exports = main;
```

```bash
# Run script
brickchain script run distribute.js \
  --args '{"recipients": ["0xabc...", "0xdef..."], "amount": 1000}'
```

### Interactive Mode
```bash
# Start interactive REPL
brickchain console [options]

Options:
  --network <network>        Network to connect
  --preload <file>           Preload script

Example session:
> brickchain console --network testnet
Welcome to BrickChain CLI v1.0.0
Connected to: testnet

brickchain> await token.balance()
1000000n

brickchain> await token.transfer({ to: "0xabc...", amount: 100n })
Transaction: 0x123...

brickchain> .exit
```

### Export/Import Data
```bash
# Export blockchain data
brickchain export [options]

Options:
  --type <type>              Data type (transactions/holders/properties)
  --format <format>          Export format (csv/json/excel)
  --output <path>            Output file path
  --from-block <number>      Starting block
  --to-block <number>        Ending block

Examples:
# Export transactions to CSV
brickchain export \
  --type transactions \
  --format csv \
  --output transactions.csv

# Export holders list
brickchain export \
  --type holders \
  --format json \
  --output holders.json

# Import data
brickchain import <file> [options]

Options:
  --type <type>              Data type to import
  --validate                 Validate before importing
  --batch-size <number>      Batch size for imports

Example:
brickchain import properties.csv --type properties --validate
```

## Scripting and Automation

### Shell Scripts
```bash
#!/bin/bash
# deploy-and-initialize.sh

# Set network
export MIDNIGHT_NETWORK=testnet

# Deploy contract
CONTRACT_ADDRESS=$(brickchain contract deploy --json | jq -r '.address')
echo "Contract deployed at: $CONTRACT_ADDRESS"

# Initialize token
brickchain token mint \
  --to $OWNER_ADDRESS \
  --amount 1000000

# Register properties
for i in {1..10}; do
  brickchain property register \
    --id $i \
    --document "./properties/property_$i.pdf"
done

echo "Deployment complete!"
```

### Node.js Scripts
```javascript
// automation.js
const { CLI } = require('@brickchain/cli');

async function main() {
  const cli = new CLI({
    network: 'testnet',
    silent: false
  });
  
  // Deploy contract
  const contract = await cli.contract.deploy({
    source: './contracts/main.compact',
    verify: true
  });
  
  // Mint initial supply
  await cli.token.mint({
    to: process.env.OWNER_ADDRESS,
    amount: '1000000'
  });
  
  // Batch transfer
  const recipients = [
    '0xabc...',
    '0xdef...',
    '0xghi...'
  ];
  
  for (const recipient of recipients) {
    await cli.token.transfer({
      to: recipient,
      amount: '1000'
    });
  }
  
  console.log('Automation complete!');
}

main().catch(console.error);
```

### GitHub Actions Integration
```yaml
# .github/workflows/deploy.yml
name: Deploy Contract

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install CLI
        run: npm install -g @brickchain/cli
      
      - name: Deploy Contract
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          MIDNIGHT_NETWORK: testnet
        run: |
          brickchain contract deploy
          brickchain contract verify
```

## Troubleshooting

### Common Issues

#### 1. Connection Issues
```bash
# Error: Cannot connect to network
Solution:
- Check network status: brickchain network status
- Verify endpoints in config
- Check firewall settings
- Try different RPC endpoint
```

#### 2. Transaction Failures
```bash
# Error: Transaction reverted
Solution:
- Check gas settings: brickchain network gas
- Verify contract state: brickchain token info --state
- Check account balance: brickchain wallet balance
- Review transaction details: brickchain tx <hash>
```

#### 3. Wallet Issues
```bash
# Error: Cannot unlock wallet
Solution:
- Verify password
- Check wallet file permissions
- Restore from backup: brickchain wallet import
```

#### 4. Compilation Errors
```bash
# Error: Contract compilation failed
Solution:
- Check Compact syntax
- Verify compiler version
- Clear build cache: rm -rf build/
- Reinstall dependencies: npm install
```

### Debug Mode
```bash
# Enable debug output
export DEBUG=brickchain:*

# Run command with debug
DEBUG=brickchain:* brickchain token transfer --to 0xabc... --amount 100

# Verbose logging
brickchain --verbose token info
```

### Getting Help
```bash
# Command help
brickchain [command] --help

# Full documentation
brickchain docs

# Open issue
brickchain issue create --title "Bug report" --body "Description"

# Community support
brickchain community
```

## Configuration Templates

### Multi-Network Setup
```json
{
  "profiles": {
    "development": {
      "network": "local",
      "gas": { "limit": 8000000, "price": 1 }
    },
    "staging": {
      "network": "testnet",
      "gas": { "limit": 5000000, "price": "auto" }
    },
    "production": {
      "network": "mainnet",
      "gas": { "limit": 3000000, "price": "auto" },
      "confirmations": 3
    }
  }
}
```

### CI/CD Configuration
```json
{
  "ci": {
    "autoVerify": true,
    "testBeforeDeploy": true,
    "generateReports": true,
    "notificationWebhook": "https://..."
  }
}
```

## Best Practices

1. **Security**
   - Never commit private keys
   - Use hardware wallets for mainnet
   - Enable 2FA where possible
   - Regular security audits

2. **Performance**
   - Batch operations when possible
   - Use appropriate gas settings
   - Cache frequently accessed data
   - Optimize contract calls

3. **Maintenance**
   - Regular backups
   - Monitor gas prices
   - Update CLI regularly
   - Document custom scripts

4. **Development**
   - Use testnet for development
   - Implement comprehensive testing
   - Version control configurations
   - Automate repetitive tasks

## Conclusion

The BrickChain CLI provides comprehensive tools for managing smart contracts, tokens, and properties on the Midnight Network. This guide covers basic to advanced usage patterns, enabling efficient blockchain operations and automation.
