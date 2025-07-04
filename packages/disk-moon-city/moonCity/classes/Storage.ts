import type { STORAGE_TYPE } from '../types';

export interface StorageOptions {
  slots?: StorageSlot[];
}

export interface StorageJSON {
  slots: StorageSlotJSON[];
}

export default class Storage {
  slots: StorageSlot[] = [];

  constructor(options: StorageOptions = {}) {
    const { slots } = options;
    this.slots = (slots || this.slots).map(slot => new StorageSlot(slot));
  }

  slot(type: STORAGE_TYPE) {
    return this.slots.find(slot => slot.type === type);
  }

  get(type: STORAGE_TYPE) {
    const slot = this.slot(type);
    if (!slot) {
      return 0;
    }
    return slot.value;
  }

  set(type: STORAGE_TYPE, value: number) {
    const slot = this.slot(type);
    if (!slot) {
      return 0;
    }
    slot.value = value;
  }

  has(type: STORAGE_TYPE) {
    return !!this.slot(type);
  }

  isInfinite(type: STORAGE_TYPE) {
    return this.slot(type)?.infinite;
  }

  toJSON(): StorageJSON {
    return {
      slots: this.slots.map(slot => slot.toJSON())
    };
  }
}

export interface StorageSlotOptions {
  type: STORAGE_TYPE;
  value?: number;
  infinite?: boolean;
}

export interface StorageSlotJSON {
  type: STORAGE_TYPE;
  value: number;
  infinite: boolean;
}

export class StorageSlot {
  type: STORAGE_TYPE;
  value: number = 0;
  infinite: boolean = false;

  constructor({ type, value, infinite }: StorageSlotOptions) {
    this.type = type;
    this.value = value || this.value;
    this.infinite = infinite || this.infinite;
  }

  toJSON(): StorageSlotJSON {
    return {
      type: this.type,
      value: this.value,
      infinite: this.infinite
    };
  }
}
