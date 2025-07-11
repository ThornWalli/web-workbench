import type Item from '../classes/FileSystem/Item';
import type ItemContainer from '../classes/FileSystem/ItemContainer';
import type ItemStorage from '../classes/FileSystem/items/Storage';
import type BaseStorage from '../classes/Storage';

import errorMessage from '../services/errorMessage';

export const PATH_SEPARATOR = '/';
export const ROOT_ID = 'ROOT';
export const CLOUD_ID = 'CLOUD';

export function getItemId(path: Item | string): string {
  if (typeof path === 'object' && 'id' in path) {
    return path.id;
  } else {
    return path.replace(/.*[\\/:]{1,1}([^:\\/]+)$/, '$1');
  }
}

export function isAbsolutePath(path: string) {
  return /^[a-zA-Z0-9_-]+:/.test(path);
}

export function pathJoin(...args: string[]) {
  return args
    .reduce((result, arg) => {
      result.push(
        ...arg
          .replace(/[\\/]+/, '/')
          .replace(/^\//, '')
          .replace(/\/$/, '')
          .split('/')
      );
      return result;
    }, [] as string[])
    .join('/')
    .replace(/:\//, ':')
    .replace(/\/$/, '');
}

export function getRootId(path: string) {
  return path.replace(/([\w]*[\\:]).*/, '$1');
}

export function getPath(path: string) {
  return path.replace(/.*:([\w/.]+)$/, '$1');
}

export function getDirname(path: string) {
  const rootId = getRootId(path);
  const _filename = getFilename(path);
  let _path = getPath(path);
  _path = _path.slice(0, _path.length - _filename.length);
  return rootId + _path;
}

export function getFilename(path: string) {
  if (/^.*[\\/:]([\w]+\.[\w]+)$/.test(path)) {
    return path.replace(/^.*[\\/:]([\w]+\.[\w]+)$/, '$1');
  } else if (/^([\w]+\.[\w]+)$/.test(path)) {
    return path.replace(/^([\w]+\.[\w]+)$/, '$1');
  } else {
    return '';
  }
}

export function isRelativePath(path: string) {
  return !isAbsolutePath(path);
}

export function getItemPath(path: string) {
  return path.replace(/(.*[\\/:]{1,1})[^:\\/]+$/, '$1');
}

export function isValidPath(path: string) {
  return path.length && /^[\w .\\/:-]+$/.test(path);
}

export function isPath(path: string) {
  return (
    isValidPath(path) && !!(path.includes('/') || path.match(/^([^:]+):.*/))
  );
}

export function separator() {
  return '/';
}

export function kilobyteToByte(kilobyte: number) {
  return kilobyte * 1000;
}

// ######################

export function removeExt(id: string) {
  return id.replace(/^(.*)\.[^.]+$/, '$1');
}

export function getExt(path: string) {
  const extension = path.match(/^.*\.([^.]*)$/);
  if (extension) {
    return extension[1];
  }
  return '';
}

export function formatSafeName(name: string) {
  return name.replace(/[^.a-zA-Z0-9_-]/g, '_');
}

export function formatId(id: string) {
  return id.replace(/[^.a-zA-Z0-9_-]/g, '_');
}

export function convertNameToId(name: string, extension: string) {
  if (extension && getExt(name) === extension) {
    return name;
  }
  if (extension) {
    return `${name}.${extension}`;
  } else {
    return name;
  }
}

export function addExt(name: string, extension: string) {
  if (extension) {
    return `${removeExt(name)}.${extension}`;
  }
  return name;
}

export function getNextItemId(
  id: string,
  parent: ItemContainer,
  extension: string
) {
  let newId = id;
  if (parent.hasItem(addExt(newId, extension))) {
    newId = `copy_${id}`;
    if (parent.hasItem(addExt(newId, extension))) {
      return getNextItemId(newId, parent, extension);
    } else {
      return newId;
    }
  } else {
    return newId;
  }
}

export function getMaxSizeFromParent(item: Item | ItemContainer) {
  if (item.parent && item.maxSize) {
    return getMaxSizeFromParent(item.parent);
  } else {
    return item.maxSize;
  }
}

// ####################################
// ####################################

export async function checkItemLocked(item: Item | ItemContainer) {
  if (item.locked) {
    throw new Error(
      errorMessage
        .get('FileSystemItem_itemLocked', await item.getPath())
        ?.join(' ')
    );
  }
  return item;
}

/**
 * Überprüft ob der Storage vom Item gesperrt ist.
 */
export function checkItemStoragePermission(item: Item | ItemContainer) {
  const storageItem = getStorageItem(item);
  if (storageItem) {
    if (!storageItem?.locked) {
      return item;
    } else {
      throw new Error(
        errorMessage.get('FileSystem_permissionsNeeded')?.join(' ')
      );
    }
  }
  return item;
}

export async function saveStorageItem<TStorage extends BaseStorage>(
  item: Item | ItemContainer,
  storage?: ItemStorage<TStorage>
) {
  storage = storage || getStorageItem(item);
  if (storage) {
    await item.save();
    await storage.save();
  }
  return item;
}

export async function removeItem(recursive: boolean, item: Item) {
  // TODO: Nix für rekursivität vorhanden ;)
  const items = await item.remove({ recursive });
  if (Array.isArray(items)) {
    return items;
  } else {
    return [items];
  }
}

export function getStorageItem<TStorage extends BaseStorage>(
  item: Item | ItemContainer | ItemStorage<TStorage>
): ItemStorage<TStorage> | undefined {
  if ((item as ItemStorage<TStorage>).storage) {
    return item as ItemStorage<TStorage>;
  } else if (item.parent) {
    return getStorageItem(item.parent);
  }
  // getStorageItem():  | undefined {
  //   if ('storage' in this) {
  //     return this;
  //   } else if (this.parent) {
  //     return this.parent.getStorageItem();
  //   }
}

export interface FsItem {
  locked?: boolean;
  name: object;
}
