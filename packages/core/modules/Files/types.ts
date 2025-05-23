import type Core from '../../classes/Core';
import type { ItemRawDefinition } from '../../classes/FileSystem/types';
import type Files from '.';

declare module '../../classes/Core' {
  interface CoreModules {
    files: Files;
  }
}

type Disk = {
  hidden?: boolean;
  name: string;
  order: number;
  data: () => Promise<
    ({ core }: { core: Core }) => ItemRawDefinition | Promise<ItemRawDefinition>
  >;
};
export type DiskList = Disk[];

export type DiskMap = {
  [key: string]: Disk;
};
