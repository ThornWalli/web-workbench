import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Mercenary.js';
import { BUILDING_TYPE } from '../../utils/keys.js';
import { buildingSabotate } from './utils.js';

/**
 * Sabotiert mit Söldnern Kraftwerke.
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 * @param
 */
export default function powerStationSabotage(city, player) {
  return buildingSabotate(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE, [
    BUILDING_TYPE.POWER_STATION
  ]);
}
