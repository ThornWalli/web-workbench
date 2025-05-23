import type { defineFileItems } from './classes/FileSystem/utils';
import type { DiskList } from './modules/Files/types';
import type { SymbolDescription } from './modules/Symbols/types';

export enum NO_DISK {
  AUTO = 'auto',
  FORCE = 'force'
}

export enum CLOUD_STORAGE_TYPE {
  FIREBASE = 'firebase'
}

export interface FirebaseConfig {
  apiKey: string;
  url: string;
}

export interface CloudStorageConfig {
  name: string;
  firebase?: FirebaseConfig;
}

export interface Config {
  noDisk: NO_DISK;
  symbols: SymbolDescription[];
  rootItems: ReturnType<typeof defineFileItems>;
  disks: DiskList;
  cloudStorages: CloudStorageConfig[];
  startCommands: string[];
}

function getDefaultConfig(): Config {
  return {
    noDisk: NO_DISK.AUTO,
    symbols: [],
    rootItems: () => [],
    disks: [],
    cloudStorages: [],
    startCommands: []
  };
}

export function defineConfig<TOptions, T extends Partial<Config>>(
  config: (options: TOptions) => T | Promise<T>
) {
  return async (options: TOptions) => {
    return {
      ...getDefaultConfig(),
      ...(await config(options))
    };
  };
}
