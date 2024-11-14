import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { autoEllipsis } from '../../utils/string.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();

export const PROCESS_COST_TYPE = {
  BUILDING: 'building',
  VEHICLE: 'vehicle'
};

export const processCosts = (
  city,
  model,
  type = PROCESS_COST_TYPE.BUILDING
) => {
  const lines = [];
  const missingCost = Object.entries(model.roundCost).find(([type, value]) => {
    return city.getStorageValue(type) - value < 0;
  });
  if (missingCost) {
    lines.push({
      key: 'round_cost_' + type,
      group: LINE_GROUP.GENERAL,
      lines: [
        [
          {
            color: 'red',
            content: 'Kosten für '
          },
          {
            color: 'white',
            content: autoEllipsis(t(`${type}.${model.key}`).name, 12)
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
    Object.entries(model.roundCost).forEach(([type, value]) => {
      city.setStorageValue(type, city.getStorageValue(type) - value);
    });

    // resolve production
    Object.entries(model.roundProduction).forEach(([type, value]) => {
      if (city.isMaxStorageValue(type, value)) {
        lines.push({
          key: 'round_production_' + type,
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
