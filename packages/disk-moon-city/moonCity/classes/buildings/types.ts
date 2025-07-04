import type Barrack from './Barrack';
import type EnergyTransmitter from './EnergyTransmitter';
import type FoodStorage from './FoodStorage';
import type GreenHouse from './GreenHouse';
import type House from './House';
import type OreStorage from './OreStorage';
import type PowerStation from './PowerStation';
import type Refinery from './Refinery';
import type ShieldGenerator from './ShieldGenerator';
import type Vault from './Vault';
import type VehicleFactory from './VehicleFactory';
import type WeaponFactory from './WeaponFactory';

export type AVAILABLE_BUILDING_TYPES =
  | typeof Barrack
  | typeof EnergyTransmitter
  | typeof FoodStorage
  | typeof GreenHouse
  | typeof House
  | typeof OreStorage
  | typeof PowerStation
  | typeof Refinery
  | typeof ShieldGenerator
  | typeof Vault
  | typeof VehicleFactory
  | typeof WeaponFactory;
