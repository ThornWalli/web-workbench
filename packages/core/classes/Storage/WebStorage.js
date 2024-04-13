import Storage from './index';

export default class WebStorage extends Storage {
  mount() {
    return new Promise(resolve => {
      try {
        let data;
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
        resolve(this);
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  load() {
    return new Promise(resolve => {
      if (this.storage) {
        try {
          this.data = JSON.parse(this.storage.getItem(this.name));
          resolve(this.data);
        } catch (err) {
          throw new Error(err);
        }
      }
    });
  }

  save(data) {
    return new Promise(resolve => {
      if (this.storage) {
        try {
          this.data = data || this.data;
          this.storage.setItem(this.name, JSON.stringify(this.data));
          resolve(this.data);
        } catch (err) {
          throw new Error(err);
        }
      }
    });
  }
}
