#!/usr/bin/env node

import { logger } from './utils/logger';
import { getTestNetConfig, getProofServerConfig, getStandaloneConfig } from './config/global';
import {
  setLogger,
  deploy,
  joinContract,
  mint,
  displayTokenState,
  buildFreshWallet,
  configureProviders,
} from './api';

// Set up logger
setLogger(logger);

function printUsage() {
  console.log(`
BrickChain CLI - Real Estate Token Contract Interface

Usage: node dist/index.js <command> [args...]

Commands:
  deploy                    Deploy a new Real Estate Token contract
  join <contractAddress>    Join an existing contract
  mint <to> <amount>        Mint tokens to an address (requires -c contract)
  status                    Display contract status (requires -c contract)


Options:
  -c <address>             Contract address
  -n <network>             Network: testnet, proofserver, standalone (default: testnet)
  --seed <hex>             Use a specific wallet seed (advanced)
  -h                       Show this help

Examples:
  node dist/index.js deploy
  node dist/index.js deploy -n standalone
  node dist/index.js join 0x123... -n testnet
  node dist/index.js mint 123 1000 -c 0x123... -n testnet
  node dist/index.js status -c 0x123... -n standalone
`);
}

// Parse arguments
function parseArgs(args: string[]) {
  const parsed: { command: string; contractAddress?: string; network: string; seed?: string; args: string[] } = {
    command: '',
    network: 'testnet',
    seed: undefined,
    args: []
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '-c') {
      parsed.contractAddress = args[++i];
    } else if (arg === '-n' || arg === '--network') {
      parsed.network = args[++i];
    } else if (arg === '--seed') {
      parsed.seed = args[++i];
    } else if (!parsed.command) {
      parsed.command = arg;
    } else {
      parsed.args.push(arg);
    }
  }

  return parsed;
}

// Main execution
async function main() {
  try {
  const { command, contractAddress, network, seed, args } = parseArgs(process.argv.slice(2));

    if (!command) {
      printUsage();
      process.exit(1);
    }

    // Select network config
    let config: any;
    switch (network.toLowerCase()) {
      case 'testnet':
        config = getTestNetConfig();
        break;
      case 'proofserver':
        config = getProofServerConfig();
        break;
      case 'standalone':
        config = getStandaloneConfig();
        break;
      default:
        console.error(`Unknown network: ${network}. Supported networks: testnet, proofserver, standalone`);
        process.exit(1);
    }

    // Set the network ID
    config.setNetworkId();
    // Pass seed to config for setupWalletAndProviders
    if (seed) config.seed = seed;

    switch (command) {
      case 'deploy':
        logger.info('Deploying contract on testnet...');
        const { wallet, providers } = await setupWalletAndProviders(config);
        const deployedContract = await deploy(providers, { privateKey: undefined });
        logger.info(`Contract deployed at: ${deployedContract.deployTxData.public.contractAddress}`);
        break;

      case 'join':
        if (args.length !== 1) {
          throw new Error('Join command requires contract address');
        }
        const joinContractAddress = args[0];
        logger.info(`Joining contract ${joinContractAddress}...`);
        const { providers: joinProviders } = await setupWalletAndProviders(config);
        const joinedContract = await joinContract(joinProviders, joinContractAddress);
        logger.info(`Joined contract at: ${joinedContract.deployTxData.public.contractAddress}`);
        break;

      case 'mint':
        if (args.length !== 2) {
          throw new Error('Mint command requires <to> <amount>');
        }
        if (!contractAddress) {
          throw new Error('Contract address required. Use -c <address>');
        }
        const [to, amount] = args;
        const { providers: mintProviders } = await setupWalletAndProviders(config);
        const mintContract = await joinContract(mintProviders, contractAddress);
        await mint(mintContract, BigInt(to), BigInt(amount));
        logger.info(`Minted ${amount} tokens to ${to}`);
        break;

      case 'status':
        if (!contractAddress) {
          throw new Error('Contract address required. Use -c <address>');
        }
        const { providers: statusProviders } = await setupWalletAndProviders(config);
        const statusContract = await joinContract(statusProviders, contractAddress);
        await displayTokenState(statusProviders, statusContract);
        break;

      default:
        throw new Error(`Unknown command: ${command}`);
    }

  } catch (error) {
    logger.error(`Error: ${error}`);
    console.log('\nUse -h for usage information');
    process.exit(1);
  }
}

// Helper function to set up wallet and providers
async function setupWalletAndProviders(config: any) {
  let wallet;
  if (config.seed) {
    if (!/^[0-9a-fA-F]{64}$/.test(config.seed)) {
      throw new Error('Provided seed must be a 64-character hex string.');
    }
    wallet = await buildFreshWallet(config, config.seed);
  } else {
    wallet = await buildFreshWallet(config);
  }
  // Await wallet state using Rx.firstValueFrom for compatibility
  const Rx = require('rxjs');
  const state = await Rx.firstValueFrom(wallet.state());
  if (state.address && state.address.includes('undeployed')) {
    console.error('ERROR: Wallet address is undeployed. Please fund this wallet using the testnet faucet, or use a valid deployed wallet seed with --seed.');
    process.exit(1);
  }
  const providers = await configureProviders(wallet, config);
  return { wallet, providers };
}

main();
