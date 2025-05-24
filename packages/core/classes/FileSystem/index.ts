/* eslint-disable complexity */

// Externe Abhängigkeiten
import { Subject } from 'rxjs';
import { markRaw } from 'vue';

// Services und Utilities
import errorMessage from '../../services/errorMessage';
import { getStorageByType, TYPE as STORAGE_TYPE } from '../../utils/storage';

import { SYMBOL } from '../../utils/symbols';

// Events
import Event from '../Event';

// Basis- und Typdefinitionen
import type BaseStorage from '../Storage';
import TempStorage from '../Storage/TempStorage';
import type { StorageAdapter } from '../StorageAdapter';

import Item from './Item';
import ItemContainer from './ItemContainer';

import {
  type MakeDirOptions,
  type MakeFileOptions,
  type PreparedItemStorageOptions,
  type Storages,
  ITEM_META,
  type ItemMetaValue,
  type NormalizedRawExportResult,
  type RawItemResult,
  type RawObjectData,
  type StorageOptions,
  type ItemRawDefinition,
  type ItemDataValue
} from './types';
import {
  ItemStorage,
  ItemCloudDisk,
  ItemDirectory,
  ItemFile,
  ItemFloppyDisk,
  ItemHardDisk,
  ItemLink,
  ItemRamDisk,
  ItemRoot,
  ItemTmpDisk,
  ItemTrashcan
} from './items';
import {
  checkItemLocked,
  checkItemStoragePermission,
  CLOUD_ID,
  getDirname,
  getFilename,
  getItemId,
  getItemPath,
  getStorageItem,
  isAbsolutePath,
  isPath,
  isValidPath,
  pathJoin,
  removeExt,
  removeItem,
  saveStorageItem
} from '@web-workbench/core/utils/fileSystem';

export default class FileSystem {
  static PREFIX = {
    FLOPPY_DISK: 'DF',
    TMP: 'TMP',
    RAM: 'RAM',
    HARD_DISK: 'HD',
    CLOUD_DISK: 'CD'
  };

  static TMP_DISK_NAME = 'TMP';
  static TMP_DISK_TITLE = 'TMP DISK';
  static RAM_DISK_NAME = 'RAM';
  static RAM_DISK_TITLE = 'RAM DISK';
  static HARD_DISK_NAME = 'HARD DISK';

  name;

  root: ItemContainer;
  currentItem?: Item | ItemContainer;
  storages = new Map();

  events = markRaw(new Subject());

  constructor(name: string) {
    this.name = name;
    this.root = new ItemRoot();
    this.setup();
  }

  setup() {
    // Create Root and set as current item
    this.currentItem = this.root;

    // Create Ram Disk

    const loading = [
      this.addStorage(FileSystem.RAM_DISK_TITLE, STORAGE_TYPE.SESSION, {
        id: FileSystem.RAM_DISK_NAME
      }),
      this.addStorage(FileSystem.HARD_DISK_NAME, STORAGE_TYPE.LOCAL, {
        trashcan: true
      }),
      this.addStorage(FileSystem.TMP_DISK_TITLE, STORAGE_TYPE.TEMP, {
        id: FileSystem.TMP_DISK_NAME,
        trashcan: false
      })
    ];

    return (
      Promise.all(loading)
        // .then(() => {
        //   // debugger;
        // })
        .catch(e => {
          throw e;
        })
    );
  }

  createTmpFile(
    path: string,
    name: string,
    data: object,
    options?: MakeFileOptions
  ) {
    return this.createRootFile(`TMP:${path}`, name, data, options);
  }

  createRootDir(path: string, name: string, options: MakeDirOptions) {
    const fullpath = `${path}`;
    return this.makedir(fullpath, name, { override: true, ...options });
  }

  createRootFile(
    id?: string,
    name?: string,
    data?: ItemDataValue,
    options?: MakeFileOptions
  ) {
    let _name: string | undefined = name;
    let _data: object | null | string | undefined = data;
    if (typeof name === 'object') {
      _data = name;
      _name = undefined;
    }

    const fullpath = `${id || 'Unknown'}`;
    return this.makefile(fullpath, _name, _data, {
      ...(options || ({} as MakeFileOptions)),
      override: true
    });
  }

  /**
   * Get item from path.
   */
  async get<T = Item>(
    path: string | Item,
    forceStaticItem: boolean = false
  ): Promise<T> {
    if (path instanceof Item) {
      return path as T;
    } else if (isValidPath(path)) {
      try {
        return (await this.parsePath(path)) as T;
      } catch (error) {
        if (forceStaticItem) {
          return new Item({
            id: getItemId(path),
            name: getItemId(path)
          }) as T;
        } else {
          throw error;
          // throw errorMessage
          //   .get('FileSystem_itemInvalid',
          //     getItemId(path),
          //     getItemId(path) === getItemPath(path) ? 'ROOT' : getItemPath(path));
        }
      }
    } else {
      throw errorMessage.get(
        'FileSystem_pathInvalid',
        getItemId(path),
        getItemPath(path)
      );
    }
  }

  /**
   * Parse Path.
   */
  async parsePath(path: string) {
    let preparedPath = path;
    let item = this.currentItem;

    const matches = path.match(/^([^:\\/]+):(.*)$/);
    if (matches) {
      item = this.root?.getItem(matches[1]);
      preparedPath = matches[2];
    } else if (preparedPath[0] === '/' && this.currentItem) {
      preparedPath = preparedPath.slice(1);
      item = getStorageItem(this.currentItem);
    } else if (preparedPath === 'ROOT') {
      item = this.root;
      preparedPath = '';
    } else if (
      preparedPath &&
      !preparedPath.includes('/') &&
      !/^\.+$/.test(preparedPath.trim())
    ) {
      item = this.root.getItem(preparedPath);
      preparedPath = '';
    }

    if (preparedPath && preparedPath.length > 0) {
      item = changeItemRecursive(
        preparedPath.split('/'),
        item as ItemContainer
      );
    }

    // if (item instanceof ItemContainer) {
    //   debugger;
    //   item = item.getItem(preparedPath);
    // }

    if (item) {
      return item;
    } else {
      throw errorMessage.get(
        'FileSystem_pathInvalid',
        path,
        (await this.currentItem?.getBase()) || ''
      );
    }
  }

  async addFloppyDisk(
    disk:
      | ItemRawDefinition
      | ItemContainer
      | (() => ItemRawDefinition | Promise<ItemRawDefinition>)
  ) {
    let data;
    if (typeof disk === 'function') {
      data = await disk();
      if (data instanceof Promise) {
        data = await data;
      }
    } else {
      data = disk;
    }

    if (Array.isArray(data)) {
      throw new Error(
        'data is an Array, use "defineFloppyDisk" for define a Disk'
      );
    }

    return this.addStorage(data);
  }

  async removeFloppyDisk(item: Item) {
    // TODO: Ist silent richtig oder eher recursive?
    await item.remove({ silent: true });
  }

  /**
   * Fügt einen BaseStorage hinzu.
   */
  async addStorage<
    TStorage extends BaseStorage,
    TStorageAdapter extends StorageAdapter = StorageAdapter,
    TData extends RawObjectData = RawObjectData
  >(
    storageName: string | ItemRawDefinition | ItemContainer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type?: STORAGE_TYPE | TStorage | (new (...args: any[]) => TStorage),
    options: {
      id?: string | null;
      trashcan?: boolean;
      // override?: boolean;
      // silent?: boolean;
      // recursive?: boolean;
    } = {}
  ) {
    options = Object.assign({ id: null }, options);

    // typeof BaseStorage<TStorage> |
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let storage: TStorage | (new (...args: any[]) => TStorage) | undefined;
    if (typeof type === 'function') {
      storage = type;
      type = STORAGE_TYPE.CLOUD;
    }
    const id = this.getFreeSlot(FileSystem.PREFIX.FLOPPY_DISK);
    const data: PreparedItemStorageOptions<TStorage> = {
      id,
      itemClass: ItemFloppyDisk,
      items: new Map()
    };
    let normalizedData: NormalizedRawExportResult<TStorage> = {};
    if (typeof storageName === 'object') {
      const floppyData = storageName;
      data.name = floppyData.name || floppyData.id;
      if (floppyData.items) {
        data.items = floppyData.items;
      }
      data.meta = Array.from(
        new Map([[ITEM_META.SYMBOL, SYMBOL.DISK_1], ...(floppyData.meta || [])])
      );
    } else {
      switch (type) {
        case STORAGE_TYPE.SESSION:
          data.id = FileSystem.PREFIX.RAM;
          data.itemClass = ItemRamDisk;
          break;
        case STORAGE_TYPE.TEMP:
          data.id = FileSystem.PREFIX.TMP;
          data.itemClass = ItemTmpDisk;
          break;
        case STORAGE_TYPE.LOCAL:
          data.id = this.getFreeSlot(FileSystem.PREFIX.HARD_DISK);
          data.itemClass = ItemHardDisk;
          break;
        case STORAGE_TYPE.CLOUD:
          data.id = this.getFreeSlot(FileSystem.PREFIX.CLOUD_DISK);
          data.itemClass = ItemCloudDisk;
          break;
      }
      data.id = options.id || data.id;

      let registeredStorage;
      if (storage && typeof storage === 'function') {
        registeredStorage = await this.registerStorageByStorage<TStorage>(
          data.id,
          storage
        ).mount(options);
      } else {
        registeredStorage = await this.registerStorageByType<
          TStorageAdapter,
          TData
        >(data.id, type as STORAGE_TYPE).mount(options);
      }

      const storageData = await registeredStorage.load();

      normalizedData = ItemContainer.normalizeItemData<TStorage, TData>(
        storageData as TData
      );

      data.storage = registeredStorage as TStorage;
      if (STORAGE_TYPE.NONE !== type) {
        data.name = normalizedData.name || normalizedData.id || storageName;
      }
    }
    console.log('normalizedData', normalizedData);
    (data.meta = data.meta || []).push(...(normalizedData.meta || []));
    return this.addDisk<TStorage, TStorageAdapter>(
      {
        ...data,
        ...normalizedData,
        storage:
          data.storage ||
          new TempStorage<TData>({
            id,
            name: FileSystem.TMP_DISK_TITLE
          })
      },
      options
    );
  }

  /**
   * Entfernt den angegebenen BaseStorage
   */
  removeStorage<TStorage extends BaseStorage>(
    itemStorage: ItemStorage<TStorage>
  ) {
    return itemStorage.unmount().then(() => {
      this.events.next(
        new Event({
          name: 'removeStorage',
          value: { itemStorage }
        })
      );
      return itemStorage;
    });
  }

  /**
   * Registriert den BaseStorage im FileSystem.
   * Muss zum benutzen noch mit "addDisk" hinzugefügt werden.
   *
   * @param  {string} name
   * @param  {string} type
   * @return BaseStorage
   */
  registerStorageByType<TStorageAdapter, TData>(
    id: string,
    type: STORAGE_TYPE
  ) {
    const StorageClass: ReturnType<
      typeof getStorageByType<TStorageAdapter, TData>
    > = getStorageByType<TStorageAdapter, TData>(type as STORAGE_TYPE);
    const name = `${this.name}_${id}`;
    const storage = new StorageClass({ id, name });
    this.storages.set(name, storage);
    return storage;
  }

  registerStorageByStorage<TStorage extends BaseStorage>(
    id: string,
    StorageClass: new (options?: Partial<StorageOptions<TStorage>>) => TStorage
  ) {
    const name = `${this.name}_${id}`;
    const storageClass = new StorageClass({
      id,
      name
    });
    this.storages.set(name, storageClass);
    return storageClass;
  }

  /**
   * Connect with BaseStorage.
   * @param  {BaseStorage} storage
   * @return {Promise}
   */
  connect<
    TStorage extends BaseStorage,
    TStorageAdapter extends StorageAdapter = StorageAdapter,
    TData extends RawObjectData = RawObjectData
  >(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storage: TStorage | (new (...args: any[]) => TStorage),
    options: object | undefined
  ) {
    return this.addStorage<TStorage, TStorageAdapter, TData>(
      CLOUD_ID,
      storage,
      options
    )
      .then(storage => {
        return storage;
      })
      .catch(e => {
        throw e;
      });
  }

  async disconnect<TStorage extends BaseStorage>(
    itemStorage: ItemStorage<TStorage>
  ) {
    itemStorage = await this.removeStorage<TStorage>(itemStorage);
    itemStorage.remove({ silent: true, recursive: true });
    return itemStorage;
  }

  /**
   * Erzeugt im Dateisystem den angegebenen BaseStorage.
   */
  addDisk<TStorage extends BaseStorage, TStorageAdapter extends StorageAdapter>(
    {
      id,
      name,
      meta,
      items,
      itemClass,
      storage
    }: {
      id: string;
      name?: string;
      meta?: [ITEM_META, ItemMetaValue][];
      items?:
        | Map<string, Item | NormalizedRawExportResult<TStorage>>
        | ItemRawDefinition[];
      itemClass:
        | typeof ItemStorage<TStorage>
        | typeof ItemFloppyDisk
        | typeof ItemRamDisk
        | typeof ItemTmpDisk
        | typeof ItemHardDisk
        | typeof ItemCloudDisk;
      // | typeof ItemFloppyDisk
      // | typeof ItemRamDisk
      // | typeof ItemTmpDisk
      // | typeof ItemHardDisk
      // | typeof ItemCloudDisk;
      storage: Storages<TStorageAdapter>;
    },
    options: {
      trashcan?: boolean;
    }
  ) {
    options = { trashcan: false, ...options };

    if (
      items instanceof Map &&
      options.trashcan &&
      (!items || (items && !items.has(ItemTrashcan.TYPE)))
    ) {
      items = items || new Map();
      items.set(ItemTrashcan.TYPE, {
        type: ItemTrashcan.TYPE,
        id: ItemTrashcan.TYPE,
        name: ItemTrashcan.TYPE
      });
    }

    const ItemClass = itemClass;
    if (!ItemClass) {
      throw new Error('ItemClass is empty!');
    }

    const item = new ItemClass<TStorage>({
      id,
      name: name || id,
      meta,
      items: items as Map<string, Item | ItemContainer | RawItemResult>,
      storage: storage as TStorage
    });

    this.root?.addItem(item);
    this.events.next(
      new Event({
        name: 'addDisk',
        value: {
          id,
          item
        }
      })
    );
    return item;
  }

  getFreeSlot(prefix: string) {
    let i = 0;

    while (true) {
      if (!this.root?.hasItem(`${prefix}${i}`)) {
        break;
      }
      i++;
    }
    return `${prefix}${i}`;
  }

  // ####################################
  // ####################################

  async exist(path: string) {
    try {
      const item = await this.get(path);
      return !!item;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async changeDirectory(path: string) {
    const item = await this.get(path);
    this.currentItem = item;
    this.events.next(
      new Event({
        name: 'changeDirectory',
        value: item
      })
    );
    return item;
  }

  async makedir(
    path: string,
    name: string,
    options: {
      override?: boolean;
      meta?: [ITEM_META, ItemMetaValue][];
    }
  ) {
    const { override, meta } = {
      override: false,
      meta: [],
      ...options
    };

    let destItem: ItemContainer;
    if (path && isPath(path) && path !== name) {
      destItem = (await this.get(getItemPath(path))) as ItemContainer;
    } else {
      destItem = this.currentItem as ItemContainer;
    }
    const item = new ItemDirectory({
      id: getItemId(path),
      name: name || '',
      createdDate: Date.now(),
      meta
    });
    await checkItemStoragePermission(destItem);

    if (override || !destItem.getItem(item.id)) {
      destItem.addItem(item, override);
      this.events.next(new Event({ name: 'writeItem', value: item }));
    } else {
      throw errorMessage.get('FileSystem_fileExist', item.id);
    }

    await saveStorageItem(destItem);

    return item;
  }

  async makefile(
    path: string,
    name: string | undefined,
    data: object | string | null | undefined,
    options: MakeFileOptions
  ) {
    const { override, meta } = { ...options, meta: options.meta || [] };

    // if (!meta.find(([name]) => name === ITEM_META.SYMBOL)) {
    //   debugger;
    //   meta.push([ITEM_META.SYMBOL, SYMBOL.DISK_BASIC]);
    // }

    const id = getItemId(path);
    const item = new ItemFile({
      id,
      name: name || id,
      data,
      meta,
      createdDate: Date.now()
    });

    if (!isValidPath(path)) {
      throw errorMessage.get('FileSystem_invalidPath', path);
    }

    let dirname = getDirname(path);
    const filename = getFilename(path);
    if (dirname === filename) {
      dirname = '.';
    }

    let directory: ItemContainer;
    if (isAbsolutePath(dirname)) {
      directory = (await this.get(dirname)) as ItemContainer;
    } else if (this.currentItem?.id !== 'ROOT') {
      directory = (await this.get(
        pathJoin((await this.currentItem?.getPath()) || '', dirname)
      )) as ItemContainer;
    } else {
      directory = (await this.get(dirname)) as ItemContainer;
    }

    if (directory.hasItem(filename)) {
      if (override) {
        await directory.getItem(filename)?.remove();
        directory.addItem(item);
      } else {
        throw errorMessage.get('FileSystem_fileExist', item.id);
      }
    } else {
      directory.addItem(item);
      this.events.next(new Event({ name: 'writeItem', value: item }));
    }
    await saveStorageItem(directory);
    return item;
  }

  async editfile(path: string, data: object | string) {
    const item = await this.get(path);

    await checkItemStoragePermission(item);
    await checkItemLocked(item);

    item.data = data;
    return saveStorageItem(item);
  }

  async editfileMeta(path: string, name: ITEM_META, value: ItemMetaValue) {
    const item = await this.get(path);
    if (Array.isArray(name)) {
      name.map(value => ({
        name: value[0],
        value: value[1]
      }));
    } else {
      item.meta.set(name, value);
    }
    return saveStorageItem(item);
  }

  async getItemMetaList(path: string) {
    const item = await this.get(path);
    return Array.from(item.meta).map(meta => ({
      name: meta[0],
      value: meta[1]
    }));
  }
  // async itemMeta (path, name, list) {
  //   const item = await this.get(path);
  //   if (list) {
  //     return Array.from(item.meta).map(meta => ({
  //       name: meta[0],
  //       value: meta[1]
  //     }));
  //   } else {
  //     return item.meta.get(name);
  //   }
  // }

  // async editItemMeta ({ path, options }) {
  //   const item = this.get(path);
  //   await hasItemPermission(item);
  //   Object.assign()
  //   for (const name in options) {
  //       if (options[name] !== undefined) {
  //         item.info.set(name, options[name]);
  //       }
  //     }
  //   }
  //   return saveStorageItem(item);
  // }

  async saveItem(path: string | Item | ItemContainer) {
    const item = await this.get(path);
    return saveStorageItem(item);
  }

  async makelink(refPath: string | Item, name = null) {
    const refItem = await this.get(refPath);
    await checkItemStoragePermission(refItem);

    const currentItem = this.currentItem as ItemContainer;
    const item = new ItemLink({
      id: removeExt(refItem.id) + '.ref',
      name: `${name || refItem.name}`,
      createdDate: Date.now(),
      meta: [[ITEM_META.REFERENCE, await refItem.getPath()]]
    });
    await currentItem.addItem(item);

    await saveStorageItem(refItem);
    return item;
  }

  async editlink(path: string | Item, refPath: string | Item) {
    const item = (await this.get(path)) as ItemLink;
    await checkItemStoragePermission(item);

    const refItem = await this.get(refPath);
    item.refPath = await refItem.getPath();

    return saveStorageItem(item);
  }

  /**
   * Renamed Item.
   * @param  {string|Item} path Filepath with id (example.ext).
   * @param  {string} value Value for id or displayed name.
   * @param  {Boolean} display When set, changes the name displayed.
   * @param  {Boolean} removeName When set, removes the name displayed.
   * @return {Promise}
   */
  async rename(
    path: string | Item,
    value?: string,
    {
      name,
      removeName
    }: {
      name?: boolean;
      removeName?: boolean;
    } = {
      name: false,
      removeName: false
    }
  ) {
    let item;
    if (path instanceof Item) {
      item = path;
    } else if (isValidPath(path) || typeof path === 'string') {
      item = await this.get(path);
    } else {
      throw errorMessage.get('FileSystem_pathInvalid', getItemPath(path), path);
    }

    await checkItemStoragePermission(item);

    if (removeName) {
      name = true;
      value = undefined;
    }
    await item.rename(value, {
      ignore: true,
      name
    });
    return saveStorageItem(item);
  }

  /**
   * Copy item.
   * @param  {string} srcPath
   * @param  {string} destPath
   * @return {Promise}
   */

  async copy(
    from: string | Item,
    to?: string | Item | ItemContainer,
    options: {
      ignore?: boolean;
    } = { ignore: false }
  ) {
    const { ignore } = { ignore: false, ...options };
    let id, fromItem, toItem;
    if (from instanceof Item) {
      fromItem = from;
      id = from.id;
    } else {
      fromItem = await this.get(from);
      id = getItemId(from);
    }
    if (to instanceof Item) {
      if (!(to instanceof ItemContainer)) {
        to = to.parent;
      }
      toItem = to;
    } else if (to) {
      id = getItemId(to);
      const item = await this.get(to, true);

      if (item.parent) {
        toItem = item.parent;
      } else {
        toItem = await this.get(getItemPath(to));
      }
      if (!(toItem instanceof ItemContainer)) {
        throw new Error('no ItemContainer');
      }
    } else {
      throw new Error('"to" is empty!');
    }
    await checkItemStoragePermission(fromItem);
    const itemCopy = await fromItem.copy();
    if (toItem instanceof ItemContainer && (ignore || !toItem.getItem(id))) {
      itemCopy.rename(id);
      toItem.addItem(itemCopy, ignore);
      this.events.next(new Event({ name: 'copyItem', value: itemCopy }));
    } else {
      throw errorMessage.get('FileSystem_fileExist', id);
    }
    return saveStorageItem(itemCopy);
  }

  /**
   * Move item to another directory.
   * @return {Promise}
   */
  async move(
    src: string | Item,
    dest: string | Item,
    {
      override
    }: {
      override?: boolean;
    } = {}
  ) {
    let id, resolveSrc, resolveDest;
    if (src instanceof Item) {
      resolveSrc = src;
      id = src.id;
    } else {
      resolveSrc = await this.get(src);
      if (resolveSrc instanceof ItemStorage) {
        throw errorMessage.get('FileSystem_cantMoveStorage', resolveSrc.id);
      }
      id = getItemId(src);
    }
    if (dest instanceof Item) {
      if (dest instanceof ItemContainer) {
        resolveDest = dest;
      } else {
        resolveDest = dest.parent as ItemContainer;
      }
    } else {
      id = getItemId(dest);
      resolveDest = await this.get<ItemContainer>(dest);
      if (resolveDest instanceof ItemContainer) {
        id = getItemId(src);
      } else {
        return this.get<Item>(getItemPath(dest));
      }
      if (!(resolveDest instanceof ItemContainer)) {
        throw new Error('no ItemContainer');
      }
    }
    let lastStorage;
    await checkItemStoragePermission(resolveSrc);

    if (override || !(await resolveDest.getItem(id))) {
      lastStorage = getStorageItem(resolveSrc);
      await resolveSrc.rename(id);
      await resolveDest.addItem(resolveSrc, override);
      this.events.next(new Event({ name: 'moveItem', value: resolveSrc }));
    } else {
      throw errorMessage.get('FileSystem_fileExist', resolveSrc.id, id);
    }
    await saveStorageItem(resolveSrc);
    if (lastStorage) {
      return lastStorage.save().then(() => {
        return resolveSrc;
      });
    }
    return resolveSrc;
  }

  /**
   * Remove Item.
   * @param {string} path
   * @return {[type]} [description]
   */
  async remove(
    path: string,
    recursive: boolean,
    options: {
      ignore?: boolean;
    } = { ignore: false }
  ) {
    const { ignore } = { ignore: false, ...options };
    const item = await this.get(path);
    await checkItemStoragePermission(item);
    try {
      const removedItems = await removeItem(recursive, item);
      if (removedItems[removedItems.length - 1].storage) {
        await removedItems[removedItems.length - 1].storage?.save();
      }
      return removedItems;
    } catch (error) {
      if (!ignore) {
        throw error;
      }
    }
  }
}

function changeItemRecursive(path: string[], item: ItemContainer) {
  const command = path.shift();

  if (command === undefined) {
    return item;
  } else if (command === '..') {
    // Directory top
    if (item.parent) {
      return item.parent;
    }
  } else if (command === '.' || command === '') {
    return changeItemRecursive(path, item);
  }
  if (item) {
    const parentItem = item.getItem(command);
    if (path.length > 0 && parentItem instanceof ItemContainer) {
      return changeItemRecursive(path, parentItem);
    }
    return parentItem; // || item;
  }
}

export function getClass(type?: string) {
  switch (type) {
    case ItemDirectory.TYPE:
      return ItemDirectory;
    case ItemTrashcan.TYPE:
      return ItemTrashcan;
    case ItemStorage.TYPE:
      return ItemStorage;
    case ItemTmpDisk.TYPE:
      return ItemTmpDisk;
    case ItemRamDisk.TYPE:
      return ItemRamDisk;
    case ItemHardDisk.TYPE:
      return ItemHardDisk;
    case ItemFloppyDisk.TYPE:
      return ItemFloppyDisk;
    case ItemCloudDisk.TYPE:
      return ItemCloudDisk;
    case ItemLink.TYPE:
      return ItemLink;
    case ItemFile.TYPE:
      return ItemFile;
  }
  return ItemFile;
}

errorMessage.add([
  ['FileSystem_invalidPath', ['Invalid File', 'Invalid path "%1"']],
  ['FileSystem_invalidFile', ['Invalid File', 'Invalid file… "%1"']],
  ['FileSystem_fileExist', ['File Ready', 'File already exists… "%1"']],
  [
    'FileSystem_pathInvalid',
    ['Path Invalid', 'Path invalid… "%1"; base: "%2"']
  ],
  [
    'FileSystem_itemInvalid',
    ['Item Invalid', 'Item id invalid… "%1" from "%2"']
  ],
  [
    'FileSystem_cantMoveStorage',
    ["Can't Move", 'Can\'t move BaseStorage "%1"']
  ],
  ['FileSystem_permissionsNeeded', ['Permissions needed', 'Permissions needed']]
]);
