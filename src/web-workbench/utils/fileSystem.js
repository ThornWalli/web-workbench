import errorMessage from '../services/errorMessage';

export const PATH_SEPARATOR = '/';
export const ROOT_ID = 'ROOT';
export const CLOUD_ID = 'CLOUD';

export function getItemId (path) {
  if (typeof path === 'object' && 'id' in path) {
    return path.id;
  } else {
    return path.replace(/.*[\\/:]{1,1}([^:\\/]+)$/, '$1');
  }
}

export function isAbsolutePath (path) {
  return /^[a-zA-Z0-9_-]+:/.test(path);
}

export function pathJoin (...args) {
  return args.reduce((result, arg) => {
    result.push(...arg.replace(/[\\/]+/, '/').replace(/^\//, '').replace(/\/$/, '').split('/'));
    return result;
  }, []).join('/').replace(/\/$/, '');
}

export function dirname (path) {
  return path.replace(/(.*)[:/]([^\\/:]+)/, '$1');
}

export function filename (path) {
  return path.replace(/(.*)\/([^\\/]+)/, '$2');
}

export function isRelativePath (path) {
  return !isAbsolutePath(path);
}

export function getItemPath (path) {
  return path.replace(/(.*[\\/:]{1,1})[^:\\/]+$/, '$1');
}

export function isValidPath (path) {
  return path.length && /^[\w .\\/:-]+$/.test(path);
}

export function isPath (path) {
  return isValidPath(path) && !!(path.includes('/') || path.match(/^([^:]+):.*/));
}

export function separator () {
  return '/';
}

export const ITEM_TYPE = {
  LINK: 'link',
  HARD_DISK: 'hardDisk',
  FLOPPY_DISK: 'floppyDisk',
  CLOUD_DISK: 'cloudDisk',
  FILE: 'file',
  DIRECTORY: 'directory',
  TMP_DISK: 'tmpDisk',
  RAM_DISK: 'ramDisk',
  ROOT: 'root',
  STORAGE: 'storage',
  TRASHCAN: 'trashcan',
  ITEM_CONTAINER: 'itemContainer'
};

export function kilobyteToByte (kilobyte) {
  return kilobyte * 1000;
}

// ######################

export function removeExt (id) {
  return id.replace(/^(.*)\.[^.]+$/, '$1');
}

export function getExt (path) {
  const extension = path.match(/^.*\.([^.]*)$/);
  if (extension) {
    return extension[1];
  }
  return '';
}

export function formatSafeName (name) {
  return name.replace(/[^.a-zA-Z0-9_-]/g, '_');
}

export function formatId (id) {
  return id.replace(/[^.a-zA-Z0-9_-]/g, '_');
}

export function convertNameToId (name, extension) {
  if (extension && getExt(name) === extension) {
    return name;
  }
  if (extension) {
    return `${name}.${extension}`;
  } else {
    return name;
  }
}

export function addExt (name, extension) {
  if (extension) {
    return `${removeExt(name)}.${extension}`;
  }
  return name;
}

export function getNextItemId (id, parent, extension) {
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

export function getMaxSizeFromParent (item) {
  if (item.parent && item.maxSize) {
    return getMaxSizeFromParent(item.parent);
  } else {
    return item.maxSize;
  }
}

// ####################################
// ####################################

export function hasItemPermission (item) {
  if (item.getStorageItem()) {
    if (!item.getStorageItem().locked) {
      return item;
    } else {
      throw errorMessage.get('FileSystem_permissionsNeeded');
    }
  }
  return item;
}

export async function saveStorageItem (item, storage) {
  if (storage || item.getStorageItem()) {
    await item.save();
    await (storage || item.getStorageItem()).save();
  }
  return item;
}

export async function removeItem (recursive, item) {
  const items = await item.remove(recursive);
  if (Array.isArray(items)) {
    return items;
  } else {
    return [
      items
    ];
  }
}
