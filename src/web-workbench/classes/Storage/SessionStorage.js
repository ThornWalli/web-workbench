import WebStorage from './WebStorage';
import { DummyStorage } from './index';

export default class SessionStorage extends WebStorage {
  constructor (options) {
    options = Object.assign({ storage: (global.sessionStorage || (new DummyStorage())) }, options);
    super(options);
  }
}
