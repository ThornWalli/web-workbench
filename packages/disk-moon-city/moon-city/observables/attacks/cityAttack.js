import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Soldier.js';
import { buildingDestroy } from './utils.js';

/**
 * Greift mit Soldaten Gebäude an.
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 */
export default function cityAttack(city, player) {
  return buildingDestroy(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE);
}
