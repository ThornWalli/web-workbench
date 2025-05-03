import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE, STORAGE_TYPE } from '../../types';
import { processComplete, processCosts } from './utils';
import type Player from '../../classes/Player';

export const energyProduction = function (player: Player) {
  return of(player.city).pipe(
    concatMap(city => {
      // reset energy storage
      city.setStorageValue(STORAGE_TYPE.ENERGY, 0);

      return from(city.getBuildingsByProduction(RESOURCE_TYPE.ENERGY)).pipe(
        processCosts(city),
        processComplete(),
        concatMap(({ groups }) => from(groups))
      );
    })
  );
};
