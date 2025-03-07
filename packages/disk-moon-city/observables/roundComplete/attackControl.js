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
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { ATTACK_TYPE } from '../../utils/keys.js';
import {
  getDamagedVehiclesLines,
  getDestroyedBuildingsLines,
  getDestroyedSabotagedLines,
  getDestroyedVehiclesLines,
  getLossesEmployeesLines
} from '../attacks/utils.js';
import useI18n from '../../composables/useI18n.js';
import { autoEllipsis } from '../../utils/string.js';

const { t } = useI18n();

/**
 * @param {import('../../classes/Player.js').default} player
 */
export function attackControl(player) {
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
/**
 * @param {import('../../classes/Player.js').default} player
 */
function getVehicleAttackLines(player) {
  return of(player.city).pipe(
    concatMap(city => {
      const results = city.attackControl.extractResultByType(
        ATTACK_TYPE.VEHICLE_ATTACK
      );

      // results

      const linesByVehicle = results.reduce(
        (result, { fromPlayer, vehicles }) => {
          vehicles.forEach(({ id, attackedFrom }) => {
            result[String(id)] = result[String(id)] || [];
            result[String(id)].push({
              color: 'dark-yellow',
              content: `Kämpfte mit ${autoEllipsis(t(`vehicle.${attackedFrom.key}`).name, 14)} von Spieler: ${fromPlayer.index + 1}`
            });
          });
          return result;
        },
        {}
      );

      return of(linesByVehicle);
    })
  );
}

/**
 * @param {import('../../classes/Player.js').default} player
 */
function weaponAttack(player) {
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

/**
 * @param {import('../../classes/Player.js').default} player
 */
function employeeAttack(player) {
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
              ...getLossesEmployeesLines(results),
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

/**
 *
 * @param {import('../../classes/Player.js').default} player
 * @param {import('../../utils/keys.js').ATTACK_TYPE} type
 * @returns
 */
const processEmployee = (player, type) => {
  const city = player.city;
  /**
   * @type {import('../../classes/attackResult/EmployeeAttackResult.js').default[]}
   */
  const employeeResults = city.attackControl.getResultByType(type);

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
      const groups = [];
      return groups;
    })
  );
};

/**
 * @param {import('../../classes/AttackResult.js').default[]} results
 */
const hasLosses = results => results.some(result => result.losses.length > 0);

/**
 * @param {import('../../classes/AttackResult.js').default[]} results
 */
const hasDestroyedBuildings = results =>
  results.some(result => result.buildings.length);

/**
 * @param {import('../../classes/AttackResult.js').default[]} results
 */
const hasDestroyedSabotaged = results =>
  results.some(result => result.buildings.length);
/**
 * @param {import('../../classes/AttackResult.js').default[]} results
 */
const hasDamagedVehicles = results =>
  results.some(result => result.vehicles.length);
/**
 * @param {import('../../classes/AttackResult.js').default[]} results
 */
const hasDestroyedVehcles = results =>
  results.some(result => result.vehicles.length);
