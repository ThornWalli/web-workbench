export default class Storage {
  /**
   * @type {Array<StorageSlot>}
   */
  slots = [];

  constructor(options = {}) {
    const { slots } = options;
    this.slots = (slots || this.slots).map(slot => new StorageSlot(slot));
  }

  slot(type) {
    return this.slots.find(slot => slot.type === type);
  }

  get(type) {
    if (!this.has(type)) {
      throw new Error(`Storage type ${type} not found`);
    }
    return this.slot(type).value;
  }

  set(type, value) {
    if (!this.has(type)) {
      throw new Error(`Storage type ${type} not found`);
    }
    this.slot(type).value = value;
  }

  has(type) {
    return !!this.slot(type);
  }

  toJSON() {
    return {
      slots: this.slots.map(slot => slot.toJSON())
    };
  }
}

export class StorageSlot {
  /**
   * @type {import('../utils/keys.js').STORAGE_TYPE}
   */
  type;

  /**
   * @type {number}
   */
  value = 0;

  constructor({ type, value } = {}) {
    this.type = type || this.type;
    this.value = value || this.value;
  }

  toJSON() {
    return {
      type: this.type,
      value: this.value
    };
  }
}
