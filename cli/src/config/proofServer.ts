import path from "node:path";
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');
export interface Config {
  readonly logDir: string;
  readonly node: string;
  readonly proofServer: string;
}

export class TestnetLocalConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'testnet-local', `${new Date().toISOString()}.log`);
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    setNetworkId(NetworkId.TestNet);
  }
}