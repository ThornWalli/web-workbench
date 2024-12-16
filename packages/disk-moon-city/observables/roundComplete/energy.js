import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../utils/keys.js';
import { processComplete, processCosts } from './utils.js';

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const energyProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      // reset energy storage
      city.setStorageValue(RESOURCE_TYPE.ENERGY, 0);

      return from(city.getBuildingsByProduction(RESOURCE_TYPE.ENERGY)).pipe(
        processCosts(city),
        processComplete(),
        concatMap(({ groups }) => from(groups))
      );
    })
  );
};
