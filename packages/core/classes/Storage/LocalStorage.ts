import type { IStorage, StorageOptions } from '.';
import WebStorage from './WebStorage';

export default class LocalStodrage extends WebStorage<IStorage> {
  constructor(options: StorageOptions<IStorage>) {
    options = Object.assign({ storage: window.localStorage }, options);
    super(options);
  }
}
