import TempStorage from '../classes/Storage/TempStorage';
import LocalStorage from '../classes/Storage/LocalStorage';
import SessionStorage from '../classes/Storage/SessionStorage';
import CloudStorage from '../classes/Storage/CloudStorage';

export enum TYPE {
  NONE = 0,
  AUTO = 1,
  TEMP = 3,
  LOCAL = 4,
  SESSION = 5,
  CLOUD = 6
}

export function getStorageByType(type: TYPE) {
  switch (type) {
    case TYPE.TEMP:
      return TempStorage;
    case TYPE.LOCAL:
      return LocalStorage;
    case TYPE.SESSION:
      return SessionStorage;
    case TYPE.CLOUD:
      return CloudStorage;
    default:
      return Storage;
  }
}
