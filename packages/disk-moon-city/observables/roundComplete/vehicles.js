import { concatAll, filter, from, map, reduce } from 'rxjs';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { STORAGE_TYPE } from '../../utils/keys.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();

/**
 *
 * @param {import('../../classes/Player.js').default} player
 */
export function vehiclesRepair(player) {
  return from(player.city.vehicles).pipe(
    filter(vehicle => vehicle.repairing),
    reduce(
      (result, vehicle) => {
        var price = vehicle.repairPrice;

        if (player.credits - price > 0) {
          result.repaired = true;
          player.credits -= price;
          result.totalCost += price;
          vehicle.armor = vehicle.maxArmor;
          vehicle.repairing = false;
        } else {
          result.lines.push({
            group: LINE_GROUP.VEHICLE,
            lines: [
              [
                {
                  color: 'red',
                  content: `Sie haben nicht genug Geld um ${t(`vehicle.${vehicle.key}.name`)} zu reparieren!`
                }
              ]
            ]
          });
        }

        return result;
      },
      {
        repaired: false,
        totalCost: 0,
        lines: []
      }
    ),
    map(({ repaired, totalCost, lines }) => {
      if (repaired) {
        lines.push(
          {
            group: LINE_GROUP.GENERAL,
            lines: [
              [
                {
                  color: 'blue',
                  content: `Sucher wurde(n) repariert!`
                }
              ]
            ]
          },
          {
            group: LINE_GROUP.COST,
            lines: [
              [
                {
                  color: 'blue',
                  content: `Ausgaben - Sucher: ${''.padStart(15, '.')} ${String(totalCost).padStart(5, '0')}`
                }
              ]
            ]
          }
        );
      }
      return lines;
    }),
    concatAll()
  );
}

/**
 *
 * @param {import('../../classes/Player.js').default} player
 */
export function vehicleArrives(player) {
  const freeStorage = player.city.getFreeStorageValue(STORAGE_TYPE.MINERAL_ORE);

  const storageType = STORAGE_TYPE.MINERAL_ORE;

  return from(player.city.vehicles).pipe(
    reduce(
      (result, vehicle, index) => {
        if (vehicle.isAvailable) {
          const storage = Math.round(
            (vehicle.storage.get(storageType) * (80 + Math.random() * 20)) / 100
          );

          const diff = freeStorage - (result.incomeStorage + storage);
          result.incomeStorage = Math.min(
            result.incomeStorage + storage,
            freeStorage
          );

          result.totalStorage += storage;
          result.lines.push([
            {
              color: 'blue',
              content: `${t(`vehicle.${vehicle.key}.name`).padEnd(' ', 12)} ${index + 1} brachte ${storage.toString().padStart(' ', 4)} ${t('label.unit')} Erze !`
            }
          ]);

          if (diff < 0) {
            result.lines.push([
              {
                color: 'red',
                content: Math.abs(diff) + t('label.unit') + '  Erze zu viel !'
              }
            ]);
          }
          vehicle.arrived = true;
        } else {
          vehicle.arrived = false;
        }

        return result;
      },
      {
        incomeStorage: 0,
        totalStorage: 0,
        lines: []
      }
    ),
    map(({ totalStorage, lines }) => {
      lines = [
        {
          group: LINE_GROUP.VEHICLE,
          lines
        }
      ];
      if (totalStorage > freeStorage) {
        lines.push({
          group: LINE_GROUP.GENERAL,
          lines: [
            [
              {
                color: 'red',
                content: 'Sie haben nicht genug Erzlager !'
              }
            ],
            [
              {
                group: LINE_GROUP.GENERAL,
                color: 'yellow',
                content: 'Sie brauchen mehr Raffinerien !'
              }
            ]
          ]
        });
      }
      player.city.setStorageValue(STORAGE_TYPE.MINERAL_ORE, totalStorage);
      return lines;
    }),
    concatAll()
  );
}