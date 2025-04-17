import Storage from '.';

export default class CloudStorage<TStorage> extends Storage<TStorage> {
  isLogged(): boolean {
    throw new Error('Not implemented');
  }
}
