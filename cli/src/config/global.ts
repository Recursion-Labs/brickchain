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
