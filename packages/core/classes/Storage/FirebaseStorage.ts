import type { StorageOptions } from '.';
import FirebaseWrapper from '../StorageAdapter/FirebaseWrapper';
import CloudStorage from './CloudStorage';

export default class FirebaseStorage extends CloudStorage<FirebaseWrapper> {
  constructor(options: StorageOptions<FirebaseWrapper>) {
    options = Object.assign({ storage: new FirebaseWrapper() }, options);
    super(options);
  }

  override mount(options: {
    id: string;
    onDisconnect?: () => void;
    apiKey?: string;
    url?: string;
  }) {
    options.onDisconnect = () => {
      this.unmount();
    };
    return this.storage
      .connect(options.id, {
        apiKey: options.apiKey,
        url: options.url
      })
      .then(() => {
        return this;
      });
  }

  override unmount() {
    return this.storage.disconnect().then(() => {
      return this;
    });
  }

  override async load() {
    let data = await this.storage.get(this.name);
    if (!data) {
      data = {};
      if (!this.storage.locked) {
        return this.storage.set(this.name, data).then(data => {
          return data;
        });
      }
    }
    this.data = data;
    return data;
  }

  override save(data: object) {
    data = cleanObject(data);
    this.data = data || this.data;
    return this.storage.set(this.name, data).then(() => {
      return this.data;
    });
  }

  override get locked() {
    return this.storage.locked;
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
