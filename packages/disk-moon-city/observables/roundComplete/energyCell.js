import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../utils/keys.js';
import { processComplete, processCosts } from './utils.js';

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const energyCellProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      return from(
        city.getBuildingsByProduction(RESOURCE_TYPE.ENERGY_CELL)
      ).pipe(
        processCosts(city),
        processComplete(),
        concatMap(({ groups }) => from(groups))
      );
    })
  );
};
