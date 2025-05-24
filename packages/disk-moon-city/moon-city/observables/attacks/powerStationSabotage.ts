import type City from '../../classes/City';
import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Mercenary';
import type Player from '../../classes/Player';
import { BUILDING_TYPE } from '../../types';
import { buildingSabotate } from './utils';

/**
 * @description Sabotiert mit Söldnern Kraftwerke.
 */
export default function powerStationSabotage(city: City, player: Player) {
  return buildingSabotate(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE, [
    BUILDING_TYPE.POWER_STATION
  ]);
}
