import { reactive } from 'vue';
import { getStorageByType, TYPE } from '../utils/storage';

export default class Config {
  entries = new Map();
  observable = reactive({});
  storage;
  ready;

  constructor(name, storageType) {
    this.storage = new (getStorageByType(storageType || TYPE.NONE))({
      name
    });

    this.ready = this.storage
      .load()
      .then(data => {
        this.entries = new Map(data);
        Object.assign(this.observable, Object.fromEntries(this.entries));
        return this;
      })
      .catch(err => {
        throw err;
      });
  }

  setDefaults(properties) {
    Object.keys(properties).forEach(name => {
      if (!this.has(name)) {
        this.set(name, properties[String(name)]);
      }
    });
  }

  get(name) {
    return this.entries.get(name);
  }

  has(name) {
    return this.entries.has(name);
  }

  set(name, value) {
    if (typeof name === 'object' && !(name instanceof Map)) {
      Object.keys(name).forEach(n => {
        value = name[String(n)];
        this.entries.set(n, value);
        this.observable[String(n)] = value;
      });
    } else {
      this.entries.set(name, value);
      this.observable[String(name)] = value;
    }
    return this.storage.save(Array.from(this.entries));
  }
}
