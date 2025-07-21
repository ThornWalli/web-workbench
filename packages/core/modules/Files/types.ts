import type Core from '../../classes/Core';
import type {
  ITEM_META,
  ItemMetaValue,
  ItemRawDefinition
} from '../../classes/FileSystem/types';
import type Item from '../../classes/FileSystem/Item';
import type Files from '.';
import type ItemContainer from '@web-workbench/core/classes/FileSystem/ItemContainer';

declare module '../../classes/Core' {
  interface CoreModules {
    files: Files;
  }
}

export type Disk = {
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

export interface EditModel extends SaveFileMetaOptions {
  actions: {
    openItemMeta: () => void;
    save: (
      fsItem: Item,
      options: {
        id: string;
        name?: string;
      } & SaveFileMetaOptions
    ) => Promise<Item | ItemContainer>;
    saveItemMeta: (
      fsItem: Item | ItemContainer,
      options: SaveFileMetaOptions,
      force?: boolean
    ) => Promise<void>;
  };
  id: string;
  name?: string;
  fsItem: Item | ItemContainer;
}

export interface SaveFileMetaOptions {
  [ITEM_META.SYMBOL]?: ItemMetaValue;
  [ITEM_META.VISIBLE]?: ItemMetaValue;
  [ITEM_META.IGNORE_SYMBOL_REARRANGE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCALE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCROLL_X]?: ItemMetaValue;
  [ITEM_META.WINDOW_SCROLL_Y]?: ItemMetaValue;
  [ITEM_META.WINDOW_FULL_SIZE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SYMBOL_REARRANGE]?: ItemMetaValue;
  [ITEM_META.WINDOW_SIDEBAR]?: ItemMetaValue;
}

export enum OUTPUT_TYPE {
  JSON = 'json',
  BASIC = 'basic',
  MARKDOWN = 'markdown',
  HTML = 'html',
  IMAGE = 'image'
}
