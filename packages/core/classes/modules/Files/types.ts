import type Files from '.';
import type Core from '../../Core';
import type { ItemRawDefinition } from '../../FileSystem/types';

declare module '../../../classes/Core' {
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
