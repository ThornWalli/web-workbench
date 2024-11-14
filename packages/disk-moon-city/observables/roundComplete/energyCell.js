import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../utils/keys.js';
import { processCosts } from './utils.js';

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const energyCellProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      const buildings = city.getBuildingsByProduction(
        RESOURCE_TYPE.ENERGY_CELL
      );

      return from(
        buildings.map(building => processCosts(city, building)).flat()
      );
    })
  );
};
