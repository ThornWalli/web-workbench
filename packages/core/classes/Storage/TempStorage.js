import Storage, { DummyStorage } from './index';

export default class TempStorage extends Storage {
  constructor(options) {
    options = Object.assign({ storage: new DummyStorage() }, options);
    super(options);
  }
}
