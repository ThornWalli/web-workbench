import type { BUILDING_KEY, BUILDING_TYPE, RESOURCE_TYPE } from '../types';
import Model, { type ModelJSON, type ModelOptions } from './Model';
import Storage, { type StorageJSON } from './Storage';

export interface BuildingOptions extends ModelOptions {
  key: BUILDING_KEY;
  description?: string;
  type: string[];
  price: number;
  properties?: unknown[];
  roundCost?: Record<string, number>;
  roundProduction?: Record<string, number>;
  storage?: Storage;
  roundProductionRatio?: number;
  sabotaged?: boolean;
}

export interface BuildingJSON extends ModelJSON {
  key: string;
  description?: string;
  type: string[];
  price: number;
  properties?: unknown[];
  roundCost?: Record<string, number>;
  roundProduction?: Record<string, number>;
  storage?: StorageJSON;
  roundProductionRatio?: number;
  sabotaged?: boolean;
}

export default class Building extends Model {
  static TYPE = 'building';

  key: BUILDING_KEY;
  type: string[] = [];
  price = 0;
  description?: string;

  properties: unknown[];

  storage?: Storage;

  roundAction?: CallableFunction;

  roundCost: Partial<{
    [key in RESOURCE_TYPE]: number;
  }> = {};

  roundProduction: Partial<{
    [key in RESOURCE_TYPE]: number;
  }> = {};

  roundProductionRatio: number = 1;

  /**
   * Wenn gesetzt, ist das Gebäude sabotiert.
   * Wird beim nächsten Rundenwechsel zurückgesetzt.
   */
  sabotaged: boolean = false;

  constructor({
    id,
    key,
    description,
    type,
    price,
    properties,
    roundCost,
    roundProduction,
    storage,
    roundProductionRatio,
    sabotaged
  }: BuildingOptions) {
    super({ id });
    this.key = key;
    this.description = description;
    this.type = type || this.type;
    this.price = price || this.price;
    this.properties = properties || [];
    this.roundCost = roundCost || this.roundCost;
    this.roundProduction = roundProduction || this.roundProduction;
    this.storage = storage ? new Storage(storage) : undefined;
    this.roundProductionRatio =
      roundProductionRatio !== undefined
        ? roundProductionRatio
        : this.roundProductionRatio;
    this.sabotaged = sabotaged !== undefined ? sabotaged : this.sabotaged;
  }

  getProductionValue(type: RESOURCE_TYPE) {
    return this.roundProduction[type] || 0;
  }

  getCostValue(type: RESOURCE_TYPE) {
    return this.roundCost[type] || 0;
  }

  isType(type: BUILDING_TYPE | BUILDING_TYPE[]) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    return Array.from<BUILDING_TYPE>(type).some(t => this.type.includes(t));
  }

  override toJSON(): BuildingJSON {
    return {
      ...super.toJSON(),
      key: this.key,
      description: this.description,
      type: this.type,
      price: this.price,
      properties: this.properties,
      roundCost: this.roundCost,
      roundProduction: this.roundProduction,
      storage: this.storage && this.storage.toJSON(),
      roundProductionRatio: this.roundProductionRatio,
      sabotaged: this.sabotaged
    };
  }
}
