import type { Observable } from 'rxjs';
import {
  concat,
  concatAll,
  concatMap,
  EMPTY,
  from,
  lastValueFrom,
  map,
  of,
  reduce,
  toArray
} from 'rxjs';
import RoundLog from './RoundLog';
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
  processVehiclesAttack,
  processPlayer
} from '../observables/roundComplete/index';
import { energyCellProduction } from '../observables/roundComplete/energyCell';
import type Core from './Core';
import type Player from './Player';
import type {
  ConsoleGroup,
  ConsoleGroupLines
} from '../observables/roundComplete/types';

export default class RoundComplete {
  core: Core;
  constructor(core: Core) {
    this.core = core;
  }
  start(player: Player) {
    return lastValueFrom(
      of(player).pipe(
        concatMap(player => {
          const roundLog = new RoundLog({ index: this.core.round, player });
          player.roundLogs.push(roundLog);
          const nextRound = this.core.round > 1;
          const tasks: Observable<ConsoleGroup>[] = [];
          let observable = of({});
          if (nextRound) {
            observable = processVehiclesAttack(player);
          }
          return observable.pipe(
            concatMap(() => {
              return processPlayer(player, this.core.players).pipe(
                concatMap(player => {
                  if (!player.isPlaying()) {
                    return EMPTY;
                  }
                  return processAttackControl(player).pipe(
                    concatMap(({ groups, linesByVehicle }) => {
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
                          const keys: string[] = [];
                          return from(
                            groups.filter(group => {
                              if (
                                !group.key ||
                                (group.key && !keys.includes(group.key))
                              ) {
                                if (group.key) {
                                  keys.push(group.key);
                                }
                                return true;
                              }
                              return false;
                            })
                          );
                        }),
                        source => source,
                        mergeLogs(),
                        reduce((result, line) => result.add(line), roundLog)
                      );
                    })
                  );
                })
              );
            })
          );
        }),
        toArray()
      )
    );
  }
}

const mergeLogs = () => (source: Observable<ConsoleGroup>) =>
  source.pipe(
    reduce<
      ConsoleGroup,
      {
        [key: string]: ConsoleGroupLines;
      }
    >((result, value) => {
      result[value.group] = result[value.group] || [];
      const lines = result[value.group];
      lines.push(...value.lines);
      return result;
    }, {}),
    map(list =>
      Object.entries(list).reduce<ConsoleGroup[]>((result, [group, lines]) => {
        result.push({
          group,
          lines
        });
        return result;
      }, [])
    ),
    concatAll()
  );
