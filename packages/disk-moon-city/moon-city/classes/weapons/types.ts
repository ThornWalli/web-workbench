import type Rocket from './Rocket';
import type SatelliteLaser from './SatelliteLaser';
import type SearchRocket from './SearchRocket';

export type AVAILABLE_WEAPON_TYPES =
  | typeof Rocket
  | typeof SatelliteLaser
  | typeof SearchRocket;
