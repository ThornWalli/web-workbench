import { concatMap, from, of } from 'rxjs';
import { RESOURCE_TYPE } from '../../utils/keys.js';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();

const autoEllipsis = (text, length) => {
  return text.length > length ? text.slice(0, length - 1) + '…' : text;
};
/**
 * @param {import('../../classes/Player.js').default} player
 */
export const energyProduction = function (player) {
  return of(player.city).pipe(
    concatMap(city => {
      // reset energy storage
      city.setStorageValue(RESOURCE_TYPE.ENERGY, 0);

      const buildings = city.getBuildingsByProduction(RESOURCE_TYPE.ENERGY);

      return from(
        buildings.map(building => processCosts(city, building)).flat()
      );
    })
  );
};

const processCosts = (city, building) => {
  const lines = [];
  const missingCost = Object.entries(building.roundCost).find(
    ([type, value]) => {
      return city.getStorageValue(type) - value < 0;
    }
  );
  if (missingCost) {
    lines.push({
      group: LINE_GROUP.GENERAL,
      lines: [
        [
          {
            color: 'red',
            content: 'Kosten für '
          },
          {
            color: 'white',
            content: autoEllipsis(t(`building.${building.key}`).name, 12)
          },
          {
            color: 'red',
            content: ` nicht gedeckt !`
          }
        ]
      ]
    });
  } else {
    // subtract costs
    Object.entries(building.roundCost).forEach(([type, value]) => {
      city.setStorageValue(type, city.getStorageValue(type) - value);
    });

    // resolve production
    Object.entries(building.roundProduction).forEach(([type, value]) => {
      if (city.isMaxStorageValue(type, value)) {
        lines.push({
          group: LINE_GROUP.GENERAL,
          lines: [
            [
              {
                color: 'red',
                content: 'Lager für '
              },
              {
                color: 'white',
                content: autoEllipsis(t(`resource.${type}`).name, 18)
              },
              {
                color: 'red',
                content: ` ist voll !`
              }
            ]
          ]
        });
      }
      city.setStorageValue(type, city.getStorageValue(type) + value, true);
    });
  }

  return lines;
};
