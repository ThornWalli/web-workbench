import type { StorageOptions } from '.';
import FirebaseWrapper from '../StorageAdapter/FirebaseWrapper';
import CloudStorage from './CloudStorage';

export default class FirebaseStorage<TData = object> extends CloudStorage<
  FirebaseWrapper,
  TData
> {
  constructor(options: Partial<StorageOptions<FirebaseWrapper>>) {
    super({
      ...options,
      storage: new FirebaseWrapper()
    } as StorageOptions<FirebaseWrapper>);
  }

  override async mount(options: {
    id: string;
    onDisconnect?: () => void;
    apiKey: string;
    url: string;
  }) {
    options.onDisconnect = () => {
      this.unmount();
    };
    if (this.storage) {
      await this.storage.connect(options.id, {
        apiKey: options.apiKey,
        url: options.url
      });
      return this;
    } else {
      throw new Error('no storage');
    }
  }

  override async unmount() {
    if (this.storage) {
      await this.storage.disconnect();
      return this;
    } else {
      throw new Error('no storage');
    }
  }

  override async load() {
    if (this.storage) {
      let data: TData = (await this.storage.get(this.name)) as TData;
      if (!data) {
        data = {} as TData;
        if (!this.storage.locked) {
          await this.storage.set(this.name, data);
        }
      }
      this.data = data;
      return data;
    } else {
      throw new Error('no storage');
    }
  }

  override async save(data: TData) {
    if (this.storage) {
      data = cleanObject(data as object) as TData;
      this.data = data || this.data;
      await this.storage.set(this.name, data);
      return this.data;
    } else {
      throw new Error('no storage');
    }
  }

  override get locked() {
    return this.storage?.locked || false;
  }
}

function cleanObject(object: object) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        if (value && typeof value === 'object') {
          value = cleanObject(value as { [key: string]: object | unknown });
        }
        return [key, value];
      })

    // .reduce(
    //   (result, key) => {
    //     const value = result[String(key)];
    //     if (value && typeof value === 'object') {
    //       cleanObject(value as { [key: string]: object | unknown });
    //     }
    //     if (value === undefined || value === null || value === '') {
    //       delete result[String(key)];
    //     }
    //     return result;
    //   },
    //   { ...object }
    // )
  );

  // function cleanObject(object: { [key: string]: object | unknown }) {
  //   return Object.keys(object).reduce(
  //     (result, key) => {
  //       const value = result[String(key)];
  //       if (value && typeof value === 'object') {
  //         cleanObject(value as { [key: string]: object | unknown });
  //       }
  //       if (value === undefined || value === null || value === '') {
  //         delete result[String(key)];
  //       }
  //       return result;
  //     },
  //     { ...object }
  //   );
}
