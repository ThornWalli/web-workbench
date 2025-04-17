import WebStorage from './WebStorage';
import { MapStorage, type IStorage, type StorageOptions } from './index';

export default class SessionStorage extends WebStorage<IStorage> {
  constructor(options: StorageOptions<IStorage>) {
    options = Object.assign(
      { storage: window.sessionStorage || new MapStorage() },
      options
    );
    super(options);
  }
}
