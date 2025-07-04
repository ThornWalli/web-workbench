import { concatMap, from, of } from 'rxjs';
import {
  BUILDING_KEY,
  LINE_GROUP,
  RESOURCE_TYPE,
  STORAGE_TYPE
} from '../../types';
import { processComplete, processCosts } from './utils';
import { fillTextEnd } from '../../utils/string';
import type Player from '../../classes/Player';

export const shieldProduction = function (player: Player) {
  return of(player.city).pipe(
    concatMap(city => {
      // reset energy storage
      city.setStorageValue(STORAGE_TYPE.SHIELD_ENERGY, 0);

      return from(city.getBuildingsByKey(BUILDING_KEY.SHIELD_GENERATOR)).pipe(
        processCosts(city),
        processComplete(),
        concatMap(({ totalCosts, costsResultRatio, groups, costsResult }) => {
          if (costsResultRatio[STORAGE_TYPE.CREDITS] > 0) {
            groups.push({
              group: LINE_GROUP.INCOME,
              lines: [
                [
                  {
                    color: 'green',
                    content:
                      fillTextEnd('Kosten    - Schilder: ', 30, '.') +
                      ` ${totalCosts[STORAGE_TYPE.CREDITS]}`
                  }
                ]
              ]
            });
          }

          if (
            costsResultRatio[RESOURCE_TYPE.ENERGY] < 1 &&
            costsResult[STORAGE_TYPE.ENERGY]
          ) {
            groups.push({
              group: LINE_GROUP.GENERAL,
              lines: [
                [
                  {
                    color: 'red',
                    content: 'Nicht genug Strom fÜr Ihre Schilde !'
                  }
                ]
              ]
            });
          }

          if (
            costsResultRatio[STORAGE_TYPE.CREDITS] < 1 &&
            costsResult[STORAGE_TYPE.CREDITS]
          ) {
            groups.push({
              group: LINE_GROUP.GENERAL,
              lines: [
                [
                  {
                    color: 'red',
                    content: 'Nicht genug Credits fÜr Ihre Schilde !'
                  }
                ]
              ]
            });
          }
          return from(groups);
        })
      );
    })
  );
};
