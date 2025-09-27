import path from "path";
import { Config, currentDir } from "./global";
import { NetworkId, setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";

export class TestnetRemoteConfig implements Config {
  privateStateStoreName = 'real-estate-token-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'testnet-remote', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', 'contracts', 'managed', 'main');
  indexer = 'https://indexer.testnet-02.midnight.network/api/v1/graphql';
  indexerWS = 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws';
  node = 'https://rpc.testnet-02.midnight.network';
  proofServer = 'http://127.0.0.1:6300';

  setNetworkId() {
    setNetworkId(NetworkId.TestNet);
  }
}