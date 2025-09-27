import path from "path";
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { Config, currentDir } from "./global";


export class TestnetLocalConfig implements Config {
  privateStateStoreName = 'real-estate-token-private-state';
  logDir = path.resolve(currentDir, '..', 'logs', 'testnet-local', `${new Date().toISOString()}.log`);
  zkConfigPath = path.resolve(currentDir, '..', '..', 'contracts', 'managed', 'main');
  indexer = 'http://127.0.0.1:8088/api/v1/graphql';
  indexerWS = 'ws://127.0.0.1:8088/api/v1/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';

  setNetworkId() {
    setNetworkId(NetworkId.TestNet);
  }
}
