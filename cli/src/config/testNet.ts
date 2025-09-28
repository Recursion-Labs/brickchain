import path from "path";
import { Config, currentDir } from "./global";
import { NetworkId, setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";

export class TestnetRemoteConfig implements Config {
  privateStateStoreName = 'real-estate-token-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'testnet-remote', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', '..', 'contracts', 'managed', 'main');
  indexer = 'https://indexer.testnet.midnight.network/api/v1/graphql';
  indexerWS = 'wss://indexer.testnet.midnight.network/api/v1/graphql/ws';
  node = 'https://rpc.testnet.midnight.network';
  proofServer = 'https://proof-server.testnet.midnight.network';

  setNetworkId() {
    setNetworkId(NetworkId.TestNet);
  }
}