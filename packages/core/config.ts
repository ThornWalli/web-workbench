import type { defineFileItems } from './classes/FileSystem/utils';
import type { DiskMap } from './classes/modules/Files/types';

export enum NO_DISK {
  AUTO = 'auto',
  FORCE = 'force'
}

export interface Config {
  noDisk: NO_DISK;
  rootItems: ReturnType<typeof defineFileItems>;
  disks: DiskMap;
  startCommands: string[];
}

function getDefaultConfig(): Config {
  return {
    noDisk: NO_DISK.AUTO,
    rootItems: () => [],
    disks: {},
    startCommands: []
  };
}

export async function defineConfig<T extends Partial<Config>>(
  config: T | Promise<T> | (() => T | Promise<T>)
): Promise<Config> {
  if (typeof config === 'function') {
    config = config();
  }
  return { ...getDefaultConfig(), ...(await config) };
}
