import { concatMap, EMPTY, from, of } from 'rxjs';
import { BUILDING_KEY, RESOURCE_TYPE } from '../../utils/keys.js';
import { processComplete, processCosts } from './utils.js';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { fillTextEnd } from '../../utils/string.js';

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const energyTransmitterProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      const buildings = city.getBuildingsByKey(BUILDING_KEY.ENERGY_TRANSMITTER);
      return from(buildings).pipe(
        processCosts(city),
        processComplete(),
        concatMap(({ groups, productionResult }) => {
          if (!buildings.length) {
            return EMPTY;
          }
          if (productionResult[RESOURCE_TYPE.CREDITS] > 0) {
            groups.push({
              group: LINE_GROUP.INCOME,
              lines: [
                [
                  {
                    color: 'green',
                    content:
                      fillTextEnd('Einnahmen - Stromverkauf: ', 30, '.') +
                      ` ${productionResult[RESOURCE_TYPE.CREDITS]}`
                  }
                ]
              ]
            });
          } else {
            groups.push({
              group: LINE_GROUP.GENERAL,
              lines: [
                [
                  {
                    color: 'red',
                    content: fillTextEnd(
                      'Es konnte kein Stromverkauft werden !',
                      30,
                      '.'
                    )
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
