import type City from '../../classes/City';
import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Soldier';
import type Player from '../../classes/Player';
import { buildingDestroy } from './utils';

/**
 * Greift mit Soldaten Gebäude an.
 */
export default function cityAttack(city: City, player: Player) {
  return buildingDestroy(city, player, MIN_USAGE_VALUE, MAX_USAGE_VALUE);
}
