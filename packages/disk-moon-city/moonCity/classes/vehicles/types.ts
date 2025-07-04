import type BigPlunder from './BigPlunder';
import type Birdy from './Birdy';
import type Grabber from './Grabber';
import type Hawk from './Hawk';
import type Phantom from './Phantom';
import type Shrimp from './Shrimp';
import type Spider from './Spider';
import type Thunder from './Thunder';

export type AVAILABLE_VEHICLE_TYPES =
  | typeof BigPlunder
  | typeof Birdy
  | typeof Grabber
  | typeof Hawk
  | typeof Phantom
  | typeof Shrimp
  | typeof Spider
  | typeof Thunder;
