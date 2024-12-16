import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE, STORAGE_TYPE } from '../../utils/keys.js';
import { processComplete, processCosts } from './utils.js';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const foodProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      return from(city.getBuildingsByProduction(RESOURCE_TYPE.FOOD)).pipe(
        processCosts(city, { ignoreStorageMessage: true }),
        processComplete(),
        concatMap(({ status, groups }) => {
          const lines = [];
          if (status.costs) {
            if (status.full) {
              lines.push([
                {
                  color: 'red',
                  content: t('round_complete.food.not_enough_storages')
                }
              ]);
            } else if (
              city.getFreeStorageValue(STORAGE_TYPE.FOOD) <
              city.getMaxStorageValue(STORAGE_TYPE.FOOD) / 2
            ) {
              lines.push([
                [
                  {
                    color: 'yellow',
                    content: 'Sie brauchen mehr Nahrungslager !'
                  }
                ]
              ]);
            } else {
              lines.push([
                {
                  color: 'blue',
                  content: t('round_complete.food.production_stored')
                }
              ]);
            }
            groups.push({
              group: LINE_GROUP.GENERAL,
              lines
            });
          }

          return from(groups);
        })
      );
    })
  );
};
