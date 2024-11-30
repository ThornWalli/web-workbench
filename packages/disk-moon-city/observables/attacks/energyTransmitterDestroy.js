import { BUILDING_TYPE } from '../../utils/keys.js';
import { buildingDestroy } from './utils.js';
import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Mercenary.js';

/**
 * Sabotiert mit Söldnern Produktionen.
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 * @param
 */
export default function energyTransmitterDestroy(city, player) {
  return buildingDestroy(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE, [
    BUILDING_TYPE.ENERGY_TRANSMITTER
  ]);
}
