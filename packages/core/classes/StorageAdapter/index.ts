export class StorageAdapter {
  isLogged() {
    return false;
  }

  getItem() {
    throw new Error('not implemented');
  }
  setItem() {
    throw new Error('not implemented');
  }
  removeItem() {
    throw new Error('not implemented');
  }
  clear() {
    throw new Error('not implemented');
  }
}
