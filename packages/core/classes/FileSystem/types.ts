import type { SYMBOL } from '@web-workbench/core/utils/symbols';
import type { CONFIG_NAMES as WINDOWS_CONFIG_NAMES } from '../../modules/Windows/utils';
import type BaseStorage from '../Storage';
import type CloudStorage from '../Storage/CloudStorage';
import type LocalStorage from '../Storage/LocalStorage';
import type SessionStorage from '../Storage/SessionStorage';
import type TempStorage from '../Storage/TempStorage';
import type Item from './Item';
import type ItemContainer from './ItemContainer';
import type CloudDisk from './items/CloudDisk';
import type FloppyDisk from './items/FloppyDisk';
import type HardDisk from './items/HardDisk';
import type RamDisk from './items/RamDisk';
import type ItemStorage from './items/Storage';
import type TmpDisk from './items/TmpDisk';
import type { IPoint } from '@js-basics/vector';
import type Core from '../Core';

export type StorageTypes =
  | typeof ItemStorage
  | typeof FloppyDisk
  | typeof RamDisk
  | typeof TmpDisk
  | typeof HardDisk
  | typeof CloudDisk;

export type Storages<TStorageAdapter, TData = RawListData[] | RawObjectData> =
  | TempStorage<TData>
  | SessionStorage<TData>
  | LocalStorage<TData>
  | CloudStorage<TStorageAdapter, TData>;
// type TStorageClass<TStorage> = {} & Storages<TStorage>;

export interface PreparedItemStorageOptions<TStorage extends BaseStorage> {
  id: string;
  itemClass: StorageTypes;
  name?: string;
  items?:
    | Map<string, Item | ItemContainer>
    | ItemRawDefinition[]
    | RawItemResult[];
  meta?: ItemMeta;
  storage?: TStorage;
}

export interface MakeFileOptions {
  override?: boolean;
  meta: ItemMeta;
}

export type MakeDirOptions = MakeFileOptions;

export type ItemDataContent = unknown[] | unknown;
export interface ItemData<TContent = ItemDataContent> {
  type?: string;
  content: TContent;
  [WINDOWS_CONFIG_NAMES.OPEN_MAXIMIZED]?: boolean;
  [WINDOWS_CONFIG_NAMES.HAS_WINDOW_OUTPUT]?: boolean;
}
export type ItemDataValue = ItemData | object | string | null | undefined;

export interface ItemRemoveInfo<TStorage extends BaseStorage> {
  type: string;
  id: string;
  name?: string;
  path: string;
  size: number;
  storage?: ItemStorage<TStorage>;
}

export enum ITEM_META {
  SYMBOL = 'symbol',
  VISIBLE = 'visible',
  POSITION = 'position',
  WINDOW_SYMBOL_REARRANGE = 'window_symbol_rearrange',
  WINDOW_SIZE = 'window_size',
  WINDOW_POSITION = 'window_position',
  WINDOW_SCALE = 'window_scale',
  WINDOW_SCROLL_X = 'window_scroll_x',
  WINDOW_SCROLL_Y = 'window_scroll_y',
  WINDOW_FULL_SIZE = 'window_full_size',
  WINDOW_SIDEBAR = 'window_sidebar',
  WEB_URL = 'web_url',
  REFERENCE = 'reference',
  IGNORE_SYMBOL_REARRANGE = 'ignore_symbol_rearrange'
}

export type ItemMetaValue =
  | boolean
  | string
  | IPoint
  | { x: number; y: number }
  | number
  | object
  | null;
export interface ItemOptions {
  locked?: boolean;
  id: string;
  name: string;
  meta?: ItemMeta;
  data?: ItemDataValue;
  action?: ItemActionCallback;
  createdDate?: number;
  editedDate?: number;
}
export interface ItemStaticOptions {
  type: string;
  symbol?: SYMBOL;
}

export interface ItemRawDefinition {
  type?: string;
  id?: string;
  name?: string;
  createdDate?: number;
  editedDate?: number;
  data?: ItemDataValue;
  meta?: ItemMeta;
  action?: ItemActionCallback;
  items?: ItemRawDefinition[];
  locked?: boolean;
}

export interface RawItemResult {
  type?: string;
  id: string;
  name?: string;
  createdDate?: number;
  editedDate?: number;
  data?: object | string | null | undefined;
  meta?: ItemMeta;
}
export interface RawObjectData {
  type?: string;
  id?: string;
  name?: string;
  createdDate?: number;
  editedDate?: number;
  data?: object | string | null | undefined;
  meta?: ItemMeta;
}
export type RawListData = [string, unknown];

export interface NormalizedRawExportResult<TStorage extends BaseStorage>
  extends RawObjectData {
  items?: Map<string, Item>;
  storage?: TStorage;
}

export interface EventValue {
  item?: Item;
  lastItem?: Item;
}

export interface StorageOptions<TStorage> extends ItemContainerOptions {
  storage: TStorage;
}

export interface ItemContainerOptions extends ItemOptions {
  items?: Map<string, Item | ItemContainer | RawItemResult> | RawItemResult[];
  maxSize?: number;
}

export type ItemActionCallback = (
  { modules }: Core,
  path?: string
) => Promise<void> | void;

export type ItemMeta = [ITEM_META, ItemMetaValue][];
