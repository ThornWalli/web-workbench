import type { STORAGE_TYPE } from '../types';

export interface StorageHistoryEntryOptions {
  round?: number;
  timestamp?: number;
  type: STORAGE_TYPE;
  value: number;
}

export default class StorageHistoryEntry {
  round: number;
  timestamp: number;
  type: STORAGE_TYPE;

  /**
   * @description The value that was added or subtracted.
   */
  value: number;

  constructor({ round, timestamp, type, value }: StorageHistoryEntryOptions) {
    this.round = round || 0;
    this.timestamp = timestamp || Date.now();
    this.type = type;
    this.value = value;
  }

  toJSON() {
    return {
      round: this.round,
      timestamp: this.timestamp,
      type: this.type,
      value: this.value
    };
  }
}
