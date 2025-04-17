import Storage, { MapStorage, type StorageOptions } from './index';

export default class TempStorage extends Storage<MapStorage> {
  constructor(options: StorageOptions<MapStorage>) {
    options = Object.assign({ storage: new MapStorage() }, options);
    super(options);
  }
}
