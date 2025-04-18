import { Subject } from 'rxjs';
import errorMessage from '../../services/errorMessage';
import { getStorageByType, TYPE as STORAGE_TYPE } from '../../utils/storage';
import * as utils from '../../utils/fileSystem';
import Event from '../Event';
import { SYMBOL } from '../../utils/symbols';
import ItemRoot from './items/Root';

import ItemTmpDisk from './items/TmpDisk';
import ItemRamDisk from './items/RamDisk';
import ItemFloppyDisk from './items/FloppyDisk';
import ItemHardDisk from './items/HardDisk';
import ItemCloudDisk from './items/CloudDisk';
import ItemDirectory from './items/Directory';
import ItemTrashcan from './items/Trashcan';
import ItemStorage from './items/Storage';
import ItemFile from './items/File';
import Item, { ITEM_META } from './Item';
import ItemContainer from './ItemContainer';
import ItemLink from './items/Link';

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

  #name;

  #root;
  #currentItem;
  #storages = new Map();

  #events = new Subject();

  constructor(name) {
    this.#name = name;
    this.setup();
  }

  get root() {
    return this.#root;
  }

  setup() {
    // Create Root and set as current item
    this.#root = new ItemRoot();
    this.#currentItem = this.#root;

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

  createTmpFile(path, name, data, options) {
    return this.createRootFile(`TMP:${path}`, name, data, options);
  }

  createRootDir(path, name, options) {
    const fullpath = `${path}`;
    return this.makedir(
      fullpath,
      name,
      Object.assign({}, options, { override: true })
    );
  }

  createRootFile(path, name, data, options) {
    if (typeof name === 'object') {
      data = name;
      name = null;
    }

    const fullpath = `${path}`;
    return this.makefile(
      fullpath,
      name,
      data,
      Object.assign({}, options, { override: true })
    );
  }

  /**
   * Get item from path.
   */
  async get(path, forceStaticItem) {
    if (path instanceof Item) {
      return path;
    } else if (utils.isValidPath(path)) {
      try {
        const item = await this.parsePath(path);
        return item;
      } catch (error) {
        if (forceStaticItem) {
          return new Item({
            name: utils.getItemId(path)
          });
        } else {
          throw error;
          // throw errorMessage
          //   .get('FileSystem_itemInvalid',
          //     utils.getItemId(path),
          //     utils.getItemId(path) === utils.getItemPath(path) ? 'ROOT' : utils.getItemPath(path));
        }
      }
    } else {
      throw errorMessage.get(
        'FileSystem_pathInvalid',
        utils.getItemId(path),
        utils.getItemPath(path)
      );
    }
  }

  /**
   * Parse Path.
   */
  async parsePath(path) {
    let preparedPath = path;
    let item = this.#currentItem;
    const matches = path.match(/^([^:\\/]+):(.*)$/);
    if (matches) {
      item = this.#root.getItem(matches[1]);
      preparedPath = matches[2];
    } else if (preparedPath[0] === '/') {
      preparedPath = preparedPath.slice(1);
      item = this.#currentItem.getStorageItem();
    } else if (preparedPath === 'ROOT') {
      item = this.#root;
      preparedPath = '';
    }
    if (preparedPath && preparedPath.length > 0) {
      item = changeItemRecursive(preparedPath.split('/'), item);
    }
    if (item) {
      return item;
    } else {
      throw errorMessage.get(
        'FileSystem_pathInvalid',
        path,
        await this.#currentItem.getBase()
      );
    }
  }

  async addFloppyDisk(disk) {
    if (typeof disk === 'function') {
      disk = disk();
    }
    const data = await disk;
    return this.addStorage(data);
  }

  async removeFloppyDisk(item) {
    await item.remove(true);
  }

  /**
   * Fügt einen Storage hinzu.
   */
  // eslint-disable-next-line complexity
  async addStorage(storageName, type = STORAGE_TYPE.NONE, options) {
    options = Object.assign({ id: null }, options);

    let storage;
    if (typeof type === 'function') {
      storage = type;
      type = STORAGE_TYPE.CLOUD;
    }

    const data = {
      id: this.getFreeSlot(FileSystem.PREFIX.FLOPPY_DISK),
      itemClass: ItemFloppyDisk
    };
    let normalizedData = {};
    if (typeof storageName === 'object') {
      const floppyData = storageName;
      data.name = floppyData.name;
      data.items = floppyData.items;
      data.meta = Array.from(
        new Map(
          [[ITEM_META.SYMBOL, SYMBOL.DISK_1]].concat(floppyData.meta || [])
        )
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

      storage = await this.registerStorage(data.id, storage || type).mount(
        options
      );
      const storageData = await storage.load();

      normalizedData = ItemContainer.normalizeItemData(storageData);
      data.storage = storage;
      if (STORAGE_TYPE.NONE !== type) {
        data.name = normalizedData.name || storageName;
      }
    }

    (data.meta = data.meta || []).push(...(normalizedData.meta || []));
    return this.addDisk(Object.assign(normalizedData, data), options);
  }

  /**
   * Entfernt den angegebenen Storage
   */
  removeStorage(itemStorage) {
    return itemStorage.unmount().then(() => {
      this.#events.next(new Event('removeStorage', { itemStorage }));
      return itemStorage;
    });
  }

  /**
   * Registriert den Storage im FileSystem.
   * Muss zum benutzen noch mit "addDisk" hinzugefügt werden.
   *
   * @param  {string} name
   * @param  {string} type
   * @return Storage
   */
  registerStorage(id, type) {
    let Storage;
    if (typeof type === 'function') {
      Storage = type;
    } else {
      Storage = getStorageByType(type);
    }
    const name = `${this.#name}_${id}`;
    const storage = new Storage({ id, name });
    this.#storages.set(name, storage);
    return storage;
  }

  /**
   * Connect with Storage.
   * @param  {Storage} storage
   * @return {Promise}
   */
  connect(storage, options) {
    return this.addStorage(utils.CLOUD_ID, storage, options)
      .then(storage => {
        return storage;
      })
      .catch(e => {
        throw e;
      });
  }

  async disconnect(item) {
    item = await this.removeStorage(item);
    item.remove({ silent: true, recursive: true });
    return item;
  }

  /**
   * Erzeugt im Dateisystem den angegebenen Storage.
   */
  addDisk({ id, name, meta, items, itemClass, storage }, options) {
    options = { trashcan: false, ...options };

    if (
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

    const item = new ItemClass({
      id,
      name,
      meta,
      items,
      storage
    });

    this.#root.addItem(item);
    this.#events.next(
      new Event('addDisk', {
        id,
        item
      })
    );
    return item;
  }

  get currentItem() {
    return this.#currentItem;
  }

  get events() {
    return this.#events;
  }

  get storages() {
    return this.#storages;
  }

  getFreeSlot(prefix) {
    let i = 0;

    while (true) {
      if (!this.#root.hasItem(`${prefix}${i}`)) {
        break;
      }
      i++;
    }
    return `${prefix}${i}`;
  }

  // ####################################
  // ####################################

  async exist(path) {
    try {
      const item = await this.get(path);
      return !!item;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async changeDirectory(path) {
    const item = await this.get(path);
    this.#currentItem = item;
    this.events.next(new Event('changeDirectory', item));
    return item;
  }

  async makedir(path, name, options) {
    const { ignore, meta } = Object.assign(
      { ignore: false, override: false, meta: [] },
      options
    );

    let destItem;

    if (path && utils.isPath(path) && path !== name) {
      destItem = await this.get(utils.getItemPath(path));
    } else {
      destItem = this.#currentItem;
    }
    const item = new ItemDirectory({
      id: utils.getItemId(path),
      name: name || '',
      createdDate: Date.now(),
      meta
    });

    await utils.hasItemPermission(destItem);

    if (ignore || !destItem.getItem(item.id)) {
      destItem.addItem(item, ignore);
      this.events.next(new Event('writeItem', item));
    } else {
      throw errorMessage.get('FileSystem_fileExist', item.id);
    }

    await utils.saveStorageItem(destItem);

    return item;
  }

  async makefile(path, name, data, options) {
    const { override, meta } = Object.assign(
      { override: false, meta: [] },
      options
    );

    const item = new ItemFile({
      id: utils.getItemId(path),
      name,
      data,
      meta,
      createdDate: Date.now()
    });

    if (!utils.isValidPath(path)) {
      throw errorMessage.get('FileSystem_invalidPath', path);
    }

    let dirname = utils.dirname(path);
    const filename = utils.filename(path);
    if (dirname === filename) {
      dirname = '.';
    }

    let directory;
    if (utils.isAbsolutePath(dirname)) {
      directory = await this.get(dirname);
    } else if (this.#currentItem.id !== 'ROOT') {
      directory = await this.get(
        utils.pathJoin(await this.#currentItem.getPath(), dirname)
      );
    } else {
      directory = await this.get(dirname);
    }

    if (directory.hasItem(filename)) {
      if (override) {
        await directory.getItem(filename).remove();
        directory.addItem(item);
      } else {
        throw errorMessage.get('FileSystem_fileExist', item.id);
      }
    } else {
      directory.addItem(item);
      this.events.next(new Event('writeItem', item));
    }
    await utils.saveStorageItem(directory);
    return item;
  }

  async editfile(path, data) {
    const item = await this.get(path).then(utils.hasItemPermission);
    await utils.hasItemPermission(item);
    item.data = data;
    return utils.saveStorageItem(item);
  }

  async editfileMeta(path, name, value) {
    const item = await this.get(path);
    if (Array.isArray(name)) {
      name.map(value => ({
        name: value[0],
        value: value[1]
      }));
    } else {
      item.meta.set(name, value);
    }
    return utils.saveStorageItem(item);
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
  //   await utils.hasItemPermission(item);
  //   Object.assign()
  //   for (const name in options) {
  //       if (options[name] !== undefined) {
  //         item.info.set(name, options[name]);
  //       }
  //     }
  //   }
  //   return utils.saveStorageItem(item);
  // }

  async saveItem(path) {
    const item = await this.get(path);
    return utils.saveStorageItem(item);
  }

  async makelink(refPath, name = null) {
    const refItem = await this.get(refPath);
    await utils.hasItemPermission(refItem);

    const currentItem = this.#currentItem;
    const item = new ItemLink({
      id: utils.removeExt(refItem.id) + '.ref',
      name: `${name || refItem.name}`,
      refPath: await refItem.getPath(),
      createdDate: Date.now()
    });
    await currentItem.addItem(item);

    await utils.saveStorageItem(refItem);
    return item;
  }

  async editlink(path, refPath) {
    const item = await this.get(path);
    await utils.hasItemPermission(item);

    const refItem = await this.get(refPath);
    item.refPath = await refItem.getPath();

    return utils.saveStorageItem(item);
  }

  /**
   * Renamed Item.
   * @param  {string|Item} path Filepath with id (example.ext).
   * @param  {string} value Value for id or displayed name.
   * @param  {Boolean} display When set, changes the name displayed.
   * @param  {Boolean} removeName When set, removes the name displayed.
   * @return {Promise}
   */
  async rename(path, value, { name = false, removeName = false }) {
    let item;
    if (path instanceof Item) {
      item = path;
    } else if (utils.isValidPath(path) || typeof path === 'string') {
      item = await this.get(path);
    } else {
      throw errorMessage.get(
        'FileSystem_pathInvalid',
        utils.getItemPath(path),
        path
      );
    }

    await utils.hasItemPermission(item);

    if (removeName) {
      name = true;
      value = null;
    }
    await item.rename(value, {
      ignore: true,
      name
    });
    return utils.saveStorageItem(item);
  }

  /**
   * Copy item.
   * @param  {string} srcPath
   * @param  {string} destPath
   * @return {Promise}
   */

  async copy(from, to, options) {
    const { ignore } = Object.assign({ ignore: false }, options);
    let id, fromItem, toItem;
    if (from instanceof Item) {
      fromItem = from;
      id = from.id;
    } else {
      fromItem = await this.get(from);
      id = utils.getItemId(from);
    }
    if (to instanceof Item) {
      if (!(to instanceof ItemContainer)) {
        to = to.parent;
      }
      toItem = to;
    } else {
      id = utils.getItemId(to);
      const item = await this.get(to, true);

      if (item instanceof ItemContainer) {
        id = utils.getItemId(from);
      } else if (item.parent) {
        toItem = item.parent;
      } else {
        toItem = await this.get(utils.getItemPath(to));
      }
      if (!(toItem instanceof ItemContainer)) {
        throw new TypeError('no ItemContainer');
      }
    }
    await utils.hasItemPermission(fromItem);
    const itemCopy = await fromItem.copy();
    if (ignore || !toItem.getItem(id)) {
      itemCopy.rename(id);
      toItem.addItem(itemCopy, ignore);
      this.events.next(new Event('copyItem', itemCopy));
    } else {
      throw errorMessage.get('FileSystem_fileExist', id);
    }
    return utils.saveStorageItem(itemCopy);
  }

  /**
   * Move item to another directory.
   * @return {Promise}
   */
  async move(src, dest, { override = false }) {
    let id, resolveSrc, resolveDest;
    if (src instanceof Item) {
      resolveSrc = src;
      id = src.id;
    } else {
      resolveSrc = await this.get(src);
      if (resolveSrc instanceof ItemStorage) {
        throw errorMessage.get(
          'FileSystem_cantMoveStorage',
          resolveSrc.displayName
        );
      }
      id = utils.getItemId(src);
    }
    if (dest instanceof Item) {
      if (dest instanceof ItemContainer) {
        resolveDest = dest;
      } else {
        dest = dest.parent;
        resolveDest = dest;
      }
    } else {
      id = utils.getItemId(dest);
      resolveDest = await this.get(dest);
      if (resolveDest instanceof ItemContainer) {
        id = utils.getItemId(src);
      } else {
        return this.get(utils.getItemPath(dest));
      }
      if (!(resolveDest instanceof ItemContainer)) {
        throw new TypeError('no ItemContainer');
      }
    }
    let lastStorage;
    await utils.hasItemPermission(resolveSrc);

    if (override || !(await resolveDest.getItem(id))) {
      lastStorage = resolveSrc.getStorageItem();
      await resolveSrc.rename(id);
      await resolveDest.addItem(resolveSrc, override);
      this.events.next(new Event('moveItem', resolveSrc));
    } else {
      throw errorMessage.get('FileSystem_fileExist', resolveSrc.id, id);
    }
    await utils.saveStorageItem(resolveSrc);
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
  async remove(path, recursive, options) {
    const { ignore } = Object.assign({ ignore: false }, options);
    const item = await this.get(path);
    await utils.hasItemPermission(item);
    try {
      const removedItems = await utils.removeItem(recursive, item);
      if (removedItems[removedItems.length - 1].storage) {
        await removedItems[removedItems.length - 1].storage.save();
      }
      return removedItems;
    } catch (error) {
      if (!ignore) {
        throw new Error(error);
      }
    }
  }
}

function changeItemRecursive(path, item) {
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

const classMap = [
  ItemDirectory,
  ItemTrashcan,
  ItemStorage,
  ItemTmpDisk,
  ItemRamDisk,
  ItemHardDisk,
  ItemFloppyDisk,
  ItemCloudDisk,
  ItemLink,
  ItemFile
].reduce((result, Class) => {
  result[Class.TYPE] = Class;
  return result;
}, {});

export function getClass(type) {
  return classMap[String(type)] || ItemFile;
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
  ['FileSystem_cantMoveStorage', ["Can't Move", 'Can\'t move Storage "%1"']],
  ['FileSystem_permissionsNeeded', ['Permissions needed', 'Permissions needed']]
]);
