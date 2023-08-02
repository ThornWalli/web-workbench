import WebStorage from './WebStorage';

export default class LocalStorage extends WebStorage {
  constructor (options) {
    options = Object.assign({ storage: window.localStorage }, options);
    super(options);
  }
}
