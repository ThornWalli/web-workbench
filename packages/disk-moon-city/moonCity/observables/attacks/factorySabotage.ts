import { BUILDING_TYPE } from '../../types';
import { buildingSabotate } from './utils';
import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Mercenary';
import type City from '../../classes/City';
import type Player from '../../classes/Player';

/**
 * @description Sabotiert mit Söldnern Produktionen.
 */
export default function powerStationSabotage(city: City, player: Player) {
  return buildingSabotate(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE, [
    BUILDING_TYPE.FACTORY
  ]);
}
