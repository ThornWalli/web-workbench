import type { IStorage } from './index';
import Storage from './index';

export default class WebStorage<
  TStorage extends IStorage
> extends Storage<TStorage> {
  override async mount() {
    let data;
    if (this.storage) {
      try {
        data = this.storage.getItem(this.name);
        if (data) {
          data = JSON.parse(data);
          if (!data || !(data instanceof Object)) {
            throw new Error('json invalid');
          }
        } else {
          throw new Error('json invalid');
        }
      } catch (error) {
        console.error(error);
        data = {};
      }

      this.storage.setItem(this.name, JSON.stringify(data));
    }
    return this;
  }

  override async unmount() {
    if (this.storage) {
      this.data = JSON.parse(this.storage.getItem(this.name));
      return this.data;
    }
  }

  override async load() {
    if (this.storage) {
      this.data = JSON.parse(this.storage.getItem(this.name));
    }
    return this.data;
  }

  override async save(data?: object) {
    if (this.storage) {
      this.data = data || this.data;
      this.storage.setItem(this.name, JSON.stringify(this.data));
    }
    return this.data;
  }
}
