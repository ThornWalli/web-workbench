import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../types';
import { processComplete, processCosts } from './utils';
import type Player from '../../classes/Player';

export const energyCellProduction = function (player: Player) {
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
