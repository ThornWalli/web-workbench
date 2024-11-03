import { concat, concatMap, from, lastValueFrom, reduce, toArray } from 'rxjs';
import RoundLog from './RoundLog.js';
import useI18n from '../composables/useI18n.js';
import { STORAGE_TYPE } from '../utils/keys.js';

export const LINE_GROUP = {
  GENERAL: 'general',
  VEHICLE: 'vehicle'
};

export default class RoundComplete {
  /**
   * @type {import('./Core.js').default}
   */
  core;
  constructor(core) {
    this.core = core;
  }
  start() {
    return lastValueFrom(
      from(this.core.players).pipe(
        concatMap(player => {
          const roundLog = new RoundLog();
          player.roundLogs.push(roundLog);
          return concat(processVehicles(player)).pipe(
            reduce((result, line) => {
              console.log('line', line);
              result.add(line);
              return result;
            }, roundLog)
          );

          // return from

          // console.log('process player', player.name);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // roundLog.add(`${player.name} processed`);
          // player.roundLogs.push(roundLog);
        }),
        toArray()
      )
    );
  }
}

const { t } = useI18n();
/**
 *
 * @param {import('./Player.js').default} player
 */
const processVehicles = player => {
  console.log({
    maxStorage: player.city.getMaxStorageValue(STORAGE_TYPE.MINERAL_ORE),
    freeStorage: player.city.getFreeStorageValue(STORAGE_TYPE.MINERAL_ORE)
  });
  const freeStorage = player.city.getFreeStorageValue(STORAGE_TYPE.MINERAL_ORE);

  return from(player.city.getAvailableVehicles()).pipe(
    /**
     * @param {import('./Harvester.js').default} vehicle
     */
    reduce(
      (result, vehicle, index) => {
        const storage = Math.round(
          (vehicle.maxStorage * (80 + Math.random() * 20)) / 100
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
            content: `${t(`vehicle.${vehicle.key}.name`).padEnd(' ', 12)} ${index + 1} brachte ${storage.toString().padStart(' ', 4)} E Erze !`
          }
        ]);

        if (diff < 0) {
          result.lines.push([
            {
              color: 'red',
              content: Math.abs(diff) + ' E Erze zu viel !'
            }
          ]);
        }

        return result;
      },
      {
        incomeStorage: 0,
        totalStorage: 0,
        lines: []
      }
    ),
    concatMap(({ totalStorage, lines }) => {
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
                content: 'Sie haben nicht genug Erzlager'
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
      return from(lines);
    })
  );
};
