import path from "path";

export interface Config {
  readonly privateStateStoreName: string;
  readonly logDir: string;
  readonly zkConfigPath: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;

  setNetworkId: () => void;
}

export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');

// Factory functions for configs
export function getTestNetConfig(): Config {
  // Import here to avoid circular dependencies
  const { TestnetRemoteConfig } = require('./testNet');
  return new TestnetRemoteConfig();
}

export function getProofServerConfig(): Config {
  const { TestnetLocalConfig } = require('./proofServer');
  return new TestnetLocalConfig();
}

export function getStandaloneConfig(): Config {
  const { StandaloneConfig } = require('./standalone');
  return new StandaloneConfig();
}
