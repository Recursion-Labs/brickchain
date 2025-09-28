/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger, type Ledger as RealEstateTokenLedger } from '../../contracts/managed/main/contract/index.cjs';
import { RealEstateTokenPrivateState, witnesses } from '../../contracts/src';
import { type CoinInfo, nativeToken, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
  type BalancedTransaction,
  createBalancedTx,
  type FinalizedTxData,
  type MidnightProvider,
  type UnbalancedTransaction,
  type WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { type Resource, WalletBuilder } from '@midnight-ntwrk/wallet';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { webcrypto } from 'crypto';
import { type Logger } from 'winston';
import * as Rx from 'rxjs';
import { WebSocket } from 'ws';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { assertIsContractAddress, toHex } from '@midnight-ntwrk/midnight-js-utils';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as fsAsync from 'node:fs/promises';
import * as fs from 'node:fs';
import { Config } from './config/global';

// @ts-expect-error: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

export type RealEstateTokenContract = Contract<RealEstateTokenPrivateState>;
export type RealEstateTokenPrivateStateId = 'realEstateTokenPrivateState';
export type DeployedRealEstateTokenContract = Awaited<ReturnType<typeof findDeployedContract>>;
export type RealEstateTokenProviders = Parameters<typeof deployContract>[0];

let globalLogger: Logger;

export const setLogger = (_logger: Logger) => {
  globalLogger = _logger;
};

export const getRealEstateTokenLedgerState = async (
  providers: RealEstateTokenProviders,
  contractAddress: ContractAddress,
): Promise<RealEstateTokenLedger | null> => {
  assertIsContractAddress(contractAddress);
  globalLogger.info('Checking contract ledger state...');
  const state = await providers.publicDataProvider
    .queryContractState(contractAddress)
    .then((contractState) => (contractState != null ? ledger(contractState.data) : null));
  globalLogger.info(`Ledger state retrieved`);
  return state;
};

export const realEstateTokenContractInstance: RealEstateTokenContract = new Contract(witnesses);

export const joinContract = async (
  providers: RealEstateTokenProviders,
  contractAddress: string,
): Promise<DeployedRealEstateTokenContract> => {
  const realEstateTokenContract = await findDeployedContract(providers, {
    contractAddress,
    contract: realEstateTokenContractInstance,
    privateStateId: 'realEstateTokenPrivateState',
    initialPrivateState: { privateKey: undefined },
  });
  globalLogger.info(`Joined contract at address: ${realEstateTokenContract.deployTxData.public.contractAddress}`);
  return realEstateTokenContract;
};

export const deploy = async (
  providers: RealEstateTokenProviders,
  privateState: RealEstateTokenPrivateState,
): Promise<DeployedRealEstateTokenContract> => {
  globalLogger.info('Deploying Real Estate Token contract...');
  try {
    const realEstateTokenContract = await deployContract(providers, {
      contract: realEstateTokenContractInstance,
      privateStateId: 'realEstateTokenPrivateState',
      initialPrivateState: privateState,
      args: [],
    });
    globalLogger.info(`Deployed contract at address: ${realEstateTokenContract.deployTxData.public.contractAddress}`);
    return realEstateTokenContract;
  } catch (error: any) {
    if (error.message && error.message.includes('Not sufficient funds')) {
      globalLogger.error('Deployment failed due to insufficient funds.');
      globalLogger.error('To deploy contracts, you need test tokens for gas fees.');
      globalLogger.error('');
      globalLogger.error('Options:');
      globalLogger.error('1. Use Midnight testnet with faucet: Visit https://docs.midnight.network/ for faucet information');
      globalLogger.error('2. For local development: Configure the node with pre-funded accounts');
      globalLogger.error('3. Use --network testnet flag to deploy to testnet');
      globalLogger.error('');
      globalLogger.error('Your wallet address for funding: Check the logs above');
    }
    throw error;
  }
};

// Token operations
export const mint = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  to: bigint,
  amount: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Minting ${amount} tokens to ${to}`);
  const finalizedTxData = await realEstateTokenContract.callTx.mint(to, amount);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const transfer = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  from: bigint,
  to: bigint,
  amount: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Transferring ${amount} tokens from ${from} to ${to}`);
  const finalizedTxData = await realEstateTokenContract.callTx.transfer(from, to, amount);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const approve = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  owner: bigint,
  spender: bigint,
  amount: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Approving ${amount} tokens for spender ${spender} by owner ${owner}`);
  const finalizedTxData = await realEstateTokenContract.callTx.approve(owner, spender, amount);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const burn = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  from: bigint,
  amount: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Burning ${amount} tokens from ${from}`);
  const finalizedTxData = await realEstateTokenContract.callTx.burn(from, amount);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const pauseToken = async (
  realEstateTokenContract: DeployedRealEstateTokenContract
): Promise<FinalizedTxData> => {
  globalLogger.info('Pausing token');
  const finalizedTxData = await realEstateTokenContract.callTx.pause_token();
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const unpauseToken = async (
  realEstateTokenContract: DeployedRealEstateTokenContract
): Promise<FinalizedTxData> => {
  globalLogger.info('Unpausing token');
  const finalizedTxData = await realEstateTokenContract.callTx.unpause_token();
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

// Property operations
export const registerProperty = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  propertyId: Uint8Array,
  ownerId: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Registering property ${propertyId} for owner ${ownerId}`);
  const finalizedTxData = await realEstateTokenContract.callTx.register_property(propertyId, ownerId);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const tokenizeProperty = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  propertyId: Uint8Array,
  tokenId: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Tokenizing property ${propertyId} with token ID ${tokenId}`);
  const finalizedTxData = await realEstateTokenContract.callTx.tokenize_property(propertyId, tokenId);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const transferPropertyOwnership = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  propertyId: Uint8Array,
  newOwnerId: bigint
): Promise<FinalizedTxData> => {
  globalLogger.info(`Transferring property ${propertyId} ownership to ${newOwnerId}`);
  const finalizedTxData = await realEstateTokenContract.callTx.transfer_property_ownership(propertyId, newOwnerId);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const deactivateProperty = async (
  realEstateTokenContract: DeployedRealEstateTokenContract,
  propertyId: Uint8Array
): Promise<FinalizedTxData> => {
  globalLogger.info(`Deactivating property ${propertyId}`);
  const finalizedTxData = await realEstateTokenContract.callTx.deactivate_property(propertyId);
  globalLogger.info(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  return finalizedTxData.public;
};

export const displayTokenState = async (
  providers: RealEstateTokenProviders,
  realEstateTokenContract: DeployedRealEstateTokenContract,
): Promise<{ ledger: RealEstateTokenLedger | null; contractAddress: string }> => {
  const contractAddress = realEstateTokenContract.deployTxData.public.contractAddress;
  const ledgerState = await getRealEstateTokenLedgerState(providers, contractAddress);
  if (ledgerState === null) {
    globalLogger.info(`There is no Real Estate Token contract deployed at ${contractAddress}.`);
  } else {
    globalLogger.info(`Token State - Total Supply: ${ledgerState.total_supply}, Circulating Supply: ${ledgerState.circulating_supply}, State: ${ledgerState.token_state}`);
  }
  return { ledger: ledgerState, contractAddress };
};

export const createWalletAndMidnightProvider = async (wallet: Wallet): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    coinPublicKey: state.coinPublicKey,
    encryptionPublicKey: state.encryptionPublicKey,
    balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
          newCoins,
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
        .then(createBalancedTx);
    },
    submitTx(tx: BalancedTransaction): Promise<TransactionId> {
      return wallet.submitTransaction(tx);
    },
  };
};

export const waitForSync = (wallet: Wallet) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(5_000),
      Rx.tap((state) => {
        const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
        const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
        globalLogger.info(
          `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        return state.syncProgress !== undefined && state.syncProgress.synced;
      }),
    ),
  );

export const waitForFunds = (wallet: Wallet) =>
  Rx.firstValueFrom(
    Rx.race(
      wallet.state().pipe(
        Rx.throttleTime(10_000),
        Rx.tap((state) => {
          const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
          const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
          globalLogger.info(
            `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
          );
        }),
        Rx.filter((state) => {
          return state.syncProgress?.synced === true;
        }),
        Rx.map((s) => s.balances[nativeToken()] ?? 0n),
        Rx.filter((balance) => balance > 0n),
      ),
      Rx.timer(60_000).pipe(
        Rx.map(() => {
          globalLogger.error('Timeout waiting for funds.');
          globalLogger.error('If using testnet, you may need to request tokens from the Midnight faucet.');
          globalLogger.error('Visit https://docs.midnight.network/ for faucet information.');
          globalLogger.error('Your wallet address is shown in the logs above.');
          throw new Error('Timeout waiting for funds');
        })
      )
    )
  );

export const buildWalletAndWaitForFunds = async (
  config: Config,
  seed: string,
  filename: string,
): Promise<Wallet & Resource> => {
  const directoryPath = process.env.SYNC_CACHE;
  let wallet: Wallet & Resource;
  if (directoryPath !== undefined) {
    if (fs.existsSync(`${directoryPath}/${filename}`)) {
      globalLogger.info(`Attempting to restore state from ${directoryPath}/${filename}`);
      try {
        const serializedStream = fs.createReadStream(`${directoryPath}/${filename}`, 'utf-8');
        const serialized = await streamToString(serializedStream);
        serializedStream.on('finish', () => {
          serializedStream.close();
        });
        wallet = await WalletBuilder.restore(config.indexer, config.indexerWS, config.proofServer, config.node, seed, serialized, 'info');
        wallet.start();
        const stateObject = JSON.parse(serialized);
        if ((await isAnotherChain(wallet, Number(stateObject.offset))) === true) {
          globalLogger.warn('The chain was reset, building wallet from scratch');
          wallet = await WalletBuilder.buildFromSeed(
            config.indexer,
            config.indexerWS,
            config.proofServer,
            config.node,
            seed,
            getZswapNetworkId(),
            'info',
          );
          wallet.start();
        } else {
          const newState = await waitForSync(wallet);
          if (newState.syncProgress?.synced) {
            globalLogger.info('Wallet was able to sync from restored state');
          } else {
            globalLogger.info(`Offset: ${stateObject.offset}`);
            globalLogger.info(`SyncProgress.lag.applyGap: ${newState.syncProgress?.lag.applyGap}`);
            globalLogger.info(`SyncProgress.lag.sourceGap: ${newState.syncProgress?.lag.sourceGap}`);
            globalLogger.warn('Wallet was not able to sync from restored state, building wallet from scratch');
            wallet = await WalletBuilder.buildFromSeed(
              config.indexer,
              config.indexerWS,
              config.proofServer,
              config.node,
              seed,
              getZswapNetworkId(),
              'info',
            );
            wallet.start();
          }
        }
      } catch (error: unknown) {
        if (typeof error === 'string') {
          globalLogger.error(error);
        } else if (error instanceof Error) {
          globalLogger.error(error.message);
        } else {
          globalLogger.error(error);
        }
        globalLogger.warn('Wallet was not able to restore using the stored state, building wallet from scratch');
        wallet = await WalletBuilder.buildFromSeed(
          config.indexer,
          config.indexerWS,
          config.proofServer,
          config.node,
          seed,
          getZswapNetworkId(),
          'info',
        );
        wallet.start();
      }
    } else {
      globalLogger.info('Wallet save file not found, building wallet from scratch');
      wallet = await WalletBuilder.buildFromSeed(
        config.indexer,
        config.indexerWS,
        config.proofServer,
        config.node,
        seed,
        getZswapNetworkId(),
        'info',
      );
      wallet.start();
    }
  } else {
    globalLogger.info('File path for save file not found, building wallet from scratch');
    wallet = await WalletBuilder.buildFromSeed(
      config.indexer,
      config.indexerWS,
      config.proofServer,
      config.node,
      seed,
      getZswapNetworkId(),
      'info',
    );
    wallet.start();
  }

  const state = await Rx.firstValueFrom(wallet.state());
  globalLogger.info(`Your wallet seed is: ${seed}`);
  globalLogger.info(`Your wallet address is: ${state.address}`);
  let balance = state.balances[nativeToken()];
  if (balance === undefined || balance === 0n) {
    globalLogger.info(`Your wallet balance is: 0`);
    // Skip waiting for funds if using local indexer (development mode)
    if (config.indexer.includes('127.0.0.1') || config.indexer.includes('localhost')) {
      globalLogger.info(`Using local development network - proceeding with zero balance for testing`);
      balance = 0n;
    } else {
      globalLogger.info(`Waiting to receive tokens...`);
      balance = await waitForFunds(wallet);
    }
  }
  globalLogger.info(`Your wallet balance is: ${balance}`);
  return wallet;
};

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  webcrypto.getRandomValues(bytes);
  return bytes;
};

export const buildFreshWallet = async (config: Config, seedOverride?: string): Promise<Wallet & Resource> =>
  await buildWalletAndWaitForFunds(config, seedOverride ? seedOverride : toHex(randomBytes(32)), '');

export const configureProviders = async (wallet: Wallet & Resource, config: Config) => {
  const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);
  return {
    privateStateProvider: levelPrivateStateProvider<'realEstateTokenPrivateState'>({
      privateStateStoreName: config.privateStateStoreName,
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider: new NodeZkConfigProvider<'mint' | 'transfer' | 'approve' | 'burn' | 'pause_token' | 'unpause_token' | 'register_property' | 'tokenize_property' | 'transfer_property_ownership' | 'deactivate_property'>(config.zkConfigPath),
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const streamToString = async (stream: fs.ReadStream): Promise<string> => {
  const chunks: Buffer[] = [];
  return await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk));
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
};

export const isAnotherChain = async (wallet: Wallet, offset: number) => {
  await Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(5_000),
      Rx.tap((state) => {
        const applyGap = state.syncProgress?.lag.applyGap ?? 0n;
        const sourceGap = state.syncProgress?.lag.sourceGap ?? 0n;
        globalLogger.info(
          `Waiting for funds. Backend lag: ${sourceGap}, wallet lag: ${applyGap}, transactions=${state.transactionHistory.length}`,
        );
      }),
      Rx.filter((state) => {
        return state.syncProgress !== undefined;
      }),
    ),
  );
  const walletOffset = Number(JSON.parse(await wallet.serializeState()).offset);
  if (walletOffset < offset - 1) {
    globalLogger.info(`Your offset offset is: ${walletOffset} restored offset: ${offset} so it is another chain`);
    return true;
  } else {
    globalLogger.info(`Your offset offset is: ${walletOffset} restored offset: ${offset} ok`);
    return false;
  }
};

export const saveState = async (wallet: Wallet, filename: string) => {
  const directoryPath = process.env.SYNC_CACHE;
  if (directoryPath !== undefined) {
    globalLogger.info(`Saving state in ${directoryPath}/${filename}`);
    try {
      await fsAsync.mkdir(directoryPath, { recursive: true });
      const serializedState = await wallet.serializeState();
      const writer = fs.createWriteStream(`${directoryPath}/${filename}`);
      writer.write(serializedState);

      writer.on('finish', function () {
        globalLogger.info(`File '${directoryPath}/${filename}' written successfully.`);
      });

      writer.on('error', function (err) {
        globalLogger.error(err);
      });
      writer.end();
    } catch (e) {
      if (typeof e === 'string') {
        globalLogger.warn(e);
      } else if (e instanceof Error) {
        globalLogger.warn(e.message);
      }
    }
  } else {
    globalLogger.info('Not saving cache as sync cache was not defined');
  }
};