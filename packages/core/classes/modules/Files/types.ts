import type Files from '.';
import type Core from '../../Core';
import type { ItemRawDefinition } from '../../FileSystem/types';

declare module '../../../classes/Core' {
  interface CoreModules {
    files: Files;
  }
}

export type DiskMap = {
  [key: string]: () => Promise<
    ({ core }: { core: Core }) => ItemRawDefinition | Promise<ItemRawDefinition>
  >;
};
