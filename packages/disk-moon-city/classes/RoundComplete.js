import {
  concat,
  concatMap,
  from,
  lastValueFrom,
  map,
  reduce,
  toArray
} from 'rxjs';
import RoundLog from './RoundLog.js';
import {
  processCityRecruitResidents,
  processEnergyProduction,
  processResidentRequirements,
  processVehicleArrives,
  processVehicleRepair
} from '../observables/roundComplete/index.js';

export const LINE_GROUP = {
  VEHICLE: 'vehicle',
  GENERAL: 'general',
  COST: 'cost'
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
          const roundLog = new RoundLog({ index: this.core.round, player });
          player.roundLogs.push(roundLog);
          return concat(
            processEnergyProduction(player),
            processCityRecruitResidents(player),
            processResidentRequirements(player),
            processVehicleArrives(player),
            processVehicleRepair(player)
          ).pipe(
            mergeLogs(),
            reduce((result, line) => result.add(...line), roundLog)
          );
        }),
        toArray()
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
    )
  );
