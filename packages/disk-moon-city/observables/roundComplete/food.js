import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../utils/keys.js';
import { PROCESS_COST_TYPE, processCosts } from './utils.js';

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const foodProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      const buildings = city.getBuildingsByProduction(RESOURCE_TYPE.FOOD);
      return from(
        buildings
          .map(building =>
            processCosts(city, building, PROCESS_COST_TYPE.BUILDING)
          )
          .flat()
      );
    })
  );
};
