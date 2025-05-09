import {
  concat,
  concatMap,
  defer,
  finalize,
  from,
  map,
  of,
  partition,
  toArray
} from 'rxjs';
import { ATTACK_TYPE, LINE_GROUP } from '../../types';
import {
  getDamagedVehiclesLines,
  getDestroyedBuildingsLines,
  getDestroyedSabotagedLines,
  getDestroyedVehiclesLines,
  getLossesEmployeesLines
} from '../attacks/utils';
import useI18n from '../../composables/useI18n';
import { autoEllipsis } from '../../utils/string';
import type Player from '../../classes/Player';
import type EmployeeAttackResult from '../../classes/attackResult/EmployeeAttackResult';
import type AttackResult from '../../classes/AttackResult';
import type { ConsoleLine } from './types';

const { t } = useI18n();

export function attackControl(player: Player) {
  return of(player).pipe(
    concatMap(player => {
      return getVehicleAttackLines(player).pipe(
        concatMap(linesByVehicle => {
          return concat(weaponAttack(player), employeeAttack(player)).pipe(
            finalize(() => player.city.attackControl.reset()),
            toArray(),
            map(groups => {
              return { groups, linesByVehicle };
            })
          );
        })
      );
    })
  );
}

function getVehicleAttackLines(player: Player) {
  return of(player.city).pipe(
    concatMap(city => {
      const results = city.attackControl.extractResultByType(
        ATTACK_TYPE.VEHICLE_ATTACK
      );

      // results

      const linesByVehicle = results.reduce<{
        [key: string]: ConsoleLine[];
      }>((result, { fromPlayer, vehicles }) => {
        vehicles.forEach(({ key, attackedFrom }) => {
          if (!attackedFrom) {
            throw new Error('attackedFrom is undefined');
          }
          result[key] = result[key] || [];
          result[key].push({
            color: 'dark-yellow',
            content: `Kämpfte mit ${autoEllipsis(t(`vehicle.${attackedFrom.key}.name`), 14)} von Spieler: ${fromPlayer.index + 1}`
          });
        });
        return result;
      }, {});

      return of(linesByVehicle);
    })
  );
}

function weaponAttack(player: Player) {
  return of(player.city).pipe(
    concatMap(city => {
      const groups = [];
      const results = city.attackControl.extractResultByType(
        ATTACK_TYPE.WEAPON
      );

      if (results.length > 0) {
        const lines = getDestroyedBuildingsLines(results);

        if (lines.length > 0) {
          groups.push({
            group: LINE_GROUP.ATTACK,
            lines
          });
        }
      }
      return from(groups);
    })
  );
}

function employeeAttack(player: Player) {
  return of(player).pipe(
    concatMap(player => {
      return concat(
        processEmployee(player, ATTACK_TYPE.ATTACK_CITY),
        processEmployee(player, ATTACK_TYPE.FACTORY_SABOTAGE),
        processEmployee(player, ATTACK_TYPE.DAMAGE_VEHICLE),
        of(player).pipe(
          concatMap(player => {
            const results = player.city.attackControl.getResultByType([
              ATTACK_TYPE.ATTACK_CITY,
              ATTACK_TYPE.FACTORY_SABOTAGE,
              ATTACK_TYPE.DAMAGE_VEHICLE
            ]);
            const groups = [];

            const lines = [
              ...getLossesEmployeesLines(results as EmployeeAttackResult[]),
              ...getDestroyedBuildingsLines(results),
              ...getDestroyedSabotagedLines(results),
              ...getDamagedVehiclesLines(results),
              ...getDestroyedVehiclesLines(results)
            ];
            if (lines.length > 0) {
              groups.push({
                group: LINE_GROUP.ATTACK,
                lines
              });
            }
            return from(groups);
          })
        )
      );
    })
  );
}

const processEmployee = (player: Player, type: ATTACK_TYPE) => {
  const city = player.city;
  /**
   * @type {import('../../classes/attackResult/EmployeeAttackResult').default[]}
   */
  const employeeResults = city.attackControl.getResultByType(
    type
  ) as EmployeeAttackResult[];

  const [successfullyResults, failedResults] = partition(
    from(employeeResults),
    ({ successfully }) => successfully
  );

  return concat(
    successfullyResults.pipe(
      toArray(),
      concatMap(results => {
        const [defenseResults, attackResults] = partition(
          from(results),
          result => result.isDefended(player)
        );

        return concat(
          attackResults.pipe(
            toArray(),
            concatMap(results => {
              const groups = [];
              if (hasLosses(results)) {
                groups.push({
                  group: LINE_GROUP.GENERAL,
                  lines: [
                    {
                      class: 'blinking-successfully',
                      color: 'green',
                      content: t(
                        `round_complete.attack_control.employee_attack.${type}.attack_success`
                      )
                    }
                  ]
                });
              }
              return from(groups);
            })
          ),

          defenseResults.pipe(
            toArray(),
            concatMap(results => {
              const groups = [];
              if (hasLosses(results)) {
                groups.push({
                  group: LINE_GROUP.GENERAL,
                  lines: [
                    {
                      class: 'blinking-successfully',
                      color: 'green',
                      content: t(
                        `round_complete.attack_control.employee_attack.${type}.defense_success`
                      )
                    }
                  ]
                });
              }
              return from(groups);
            })
          )
        );
      })
    ),

    failedResults.pipe(
      toArray(),
      concatMap(results => {
        const [defenseResults, attackResults] = partition(
          from(results),
          result => result.isDefended(player)
        );

        return concat(
          attackResults.pipe(
            toArray(),
            concatMap(results => {
              const groups = [];
              if (hasLosses(results)) {
                groups.push({
                  group: LINE_GROUP.GENERAL,
                  lines: [
                    {
                      class: 'blinking-error',
                      color: 'red',
                      content: t(
                        `round_complete.attack_control.employee_attack.${type}.attack_failed`
                      )
                    }
                  ]
                });
              }
              return from(groups);
            })
          ),

          defenseResults.pipe(
            toArray(),
            concatMap(results => {
              const groups = [];

              if (
                hasLosses(results) ||
                hasDestroyedBuildings(results) ||
                hasDestroyedSabotaged(results) ||
                hasDamagedVehicles(results) ||
                hasDestroyedVehcles(results)
              ) {
                groups.push({
                  group: LINE_GROUP.GENERAL,
                  lines: [
                    {
                      class: 'blinking-error',
                      color: 'red',
                      content: t(
                        `round_complete.attack_control.employee_attack.${type}.defense_failed`
                      )
                    }
                  ]
                });
              }
              return from(groups);
            })
          )
        );
      })
    ),

    defer(() => {
      return [];
    })
  );
};

const hasLosses = (results: EmployeeAttackResult[]) =>
  results.some(result => result.losses.length > 0);

const hasDestroyedBuildings = (results: AttackResult[]) =>
  results.some(result => result.buildings.length);

const hasDestroyedSabotaged = (results: AttackResult[]) =>
  results.some(result => result.buildings.length);

const hasDamagedVehicles = (results: AttackResult[]) =>
  results.some(result => result.vehicles.length);
/**
 * @param {import('../../classes/AttackResult').default[]} results
 */
const hasDestroyedVehcles = (results: AttackResult[]) =>
  results.some(result => result.vehicles.length);
