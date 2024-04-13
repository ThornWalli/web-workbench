import FirebaseWrapper from '../FirebaseWrapper';
import CloudStorage from './CloudStorage';

export default class FirebaseStorage extends CloudStorage {
  constructor(options) {
    options = Object.assign({ storage: new FirebaseWrapper() }, options);
    super(options);
  }

  mount(options) {
    options.onDisconnect = () => {
      this.unmount();
    };
    return this.storage.connect(options.id, options).then(() => {
      return this;
    });
  }

  unmount() {
    return this.storage.disconnect().then(() => {
      return this;
    });
  }

  async load() {
    try {
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
    } catch (err) {
      throw new Error(err);
    }
  }

  save(data) {
    data = cleanObject(data);
    this.data = data || this.data;
    return this.storage.set(this.name, data).then(() => {
      return this.data;
    });
  }

  get locked() {
    return this.storage.locked;
  }
}

function cleanObject(object) {
  return Object.keys(object).reduce((result, key) => {
    const value = result[String(key)];
    if (value && typeof value === 'object') {
      cleanObject(value);
    }
    if (value === undefined || value === null || value === '') {
      delete result[String(key)];
    }
    return result;
  }, object);
}
