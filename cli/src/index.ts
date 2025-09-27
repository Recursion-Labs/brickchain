#!/usr/bin/env node

import { logger } from './utils/logger';
import { getTestNetConfig } from './config/global';
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
  -h                       Show this help

Examples:
  node dist/index.js deploy
  node dist/index.js join 0x123...
  node dist/index.js mint 123 1000 -c 0x123...
  node dist/index.js status -c 0x123...
`);
}

// Parse arguments
function parseArgs(args: string[]) {
  const options: any = {};
  const commandArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '-c') {
      options.contract = args[++i];
    } else if (!arg.startsWith('-')) {
      commandArgs.push(arg);
    }
  }

  const [command, ...cmdArgs] = commandArgs;
  return { command, commandArgs: cmdArgs, options };
}

// Main execution
async function main() {
  try {
    const { command, commandArgs, options } = parseArgs(process.argv.slice(2));

    if (!command) {
      printUsage();
      process.exit(1);
    }

    const config = getTestNetConfig();

    switch (command) {
      case 'deploy':
        logger.info('Deploying contract on testnet...');
        const { wallet, providers } = await setupWalletAndProviders(config);
        const deployedContract = await deploy(providers, { privateKey: undefined });
        logger.info(`Contract deployed at: ${deployedContract.deployTxData.public.contractAddress}`);
        break;

      case 'join':
        if (commandArgs.length !== 1) {
          throw new Error('Join command requires contract address');
        }
        const contractAddress = commandArgs[0];
        logger.info(`Joining contract ${contractAddress}...`);
        const { providers: joinProviders } = await setupWalletAndProviders(config);
        const contract = await joinContract(joinProviders, contractAddress);
        logger.info(`Joined contract at: ${contract.deployTxData.public.contractAddress}`);
        break;

      case 'mint':
        if (commandArgs.length !== 2) {
          throw new Error('Mint command requires <to> <amount>');
        }
        if (!options.contract) {
          throw new Error('Contract address required. Use -c <address>');
        }
        const [to, amount] = commandArgs;
        const { providers: mintProviders } = await setupWalletAndProviders(config);
        const mintContract = await joinContract(mintProviders, options.contract);
        await mint(mintContract, BigInt(to), BigInt(amount));
        logger.info(`Minted ${amount} tokens to ${to}`);
        break;

      case 'status':
        if (!options.contract) {
          throw new Error('Contract address required. Use -c <address>');
        }
        const { providers: statusProviders } = await setupWalletAndProviders(config);
        const statusContract = await joinContract(statusProviders, options.contract);
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
  const wallet = await buildFreshWallet(config);
  const providers = await configureProviders(wallet, config);
  return { wallet, providers };
}

main();
