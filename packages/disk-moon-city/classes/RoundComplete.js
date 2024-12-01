import {
  concat,
  concatAll,
  concatMap,
  from,
  lastValueFrom,
  map,
  of,
  reduce,
  toArray
} from 'rxjs';
import RoundLog from './RoundLog.js';
import {
  processEmployees,
  processEnergyProduction,
  processEnergyTransmitterProduction,
  processFoodProduction,
  processResidentRequirements,
  processShieldProduction,
  processVehicleArrives,
  processVehicleRepair,
  processAttackControl,
  processVehiclesAttack
} from '../observables/roundComplete/index.js';
import { energyCellProduction } from '../observables/roundComplete/energyCell.js';

export const LINE_GROUP = {
  VEHICLE: 'vehicle',
  GENERAL: 'general',
  COST: 'cost',
  INCOME: 'income',
  ATTACK: 'attack'
};

export default class RoundComplete {
  /**
   * @type {import('./Core.js').default}
   */
  core;
  constructor(core) {
    this.core = core;
  }
  start(player) {
    return lastValueFrom(
      of(player).pipe(
        concatMap(player => {
          const roundLog = new RoundLog({ index: this.core.round, player });
          player.roundLogs.push(roundLog);
          const nextRound = this.core.round > 1;
          const tasks = [];
          let observable = of({});
          if (nextRound) {
            observable = processVehiclesAttack(player);
          }
          return observable.pipe(
            concatMap(() => {
              return processAttackControl(player).pipe(
                concatMap(({ groups, linesByVehicle }) => {
                  console.log({ groups, linesByVehicle });
                  tasks.push(from(groups));

                  if (nextRound) {
                    tasks.push(
                      processVehicleArrives(player, linesByVehicle),
                      energyCellProduction(player),
                      processEnergyProduction(player),
                      processShieldProduction(player),
                      processFoodProduction(player),
                      processEnergyTransmitterProduction(player),
                      processResidentRequirements(player),
                      processVehicleRepair(player),
                      processEmployees(player)
                    );
                  }
                  return concat(...tasks).pipe(
                    toArray(),
                    concatMap(groups => {
                      const keys = [];
                      return from(
                        Object.values(
                          groups.filter(group => {
                            if (
                              !group.key ||
                              (group.key && !keys.includes(group.key))
                            ) {
                              group.key && keys.push(group.key);
                              return true;
                            }
                            return false;
                          })
                        )
                      );
                    }),
                    mergeLogs(),
                    reduce((result, line) => result.add(line), roundLog)
                  );
                })
              );
            })
          );
        })
      )
    );
  }
}

const mergeLogs = () => source =>
  source.pipe(
    reduce((result, value) => {
      result[value.group] = result[value.group] || [];
      const lines = result[value.group];
      lines.push(...value.lines);
      return result;
    }, {}),
    map(list =>
      Object.entries(list).reduce((result, [group, lines]) => {
        result.push({
          group,
          lines
        });
        return result;
      }, [])
    ),
    concatAll()
  );
