import { map, of } from 'rxjs';
import type AttackResult from '../../classes/AttackResult';
import { AttackResultBuilding } from '../../classes/AttackResult';
import EmployeeAttackResult from '../../classes/attackResult/EmployeeAttackResult';
import useI18n from '../../composables/useI18n';
import type { BUILDING_TYPE } from '../../types';
import { ATTACK_TYPE, EMPLOYEE_TYPE } from '../../types';
import { autoEllipsis } from '../../utils/string';
import type Player from '../../classes/Player';
import type Building from '../../classes/Building';
import type City from '../../classes/City';

export enum ERROR_MESSAGES {
  NOT_ENOUGH_MERCENARIES = 'not_enough_mercenaries',
  NOT_ENOUGH_SOLDIERS = 'not_enough_soldiers'
}

const { t } = useI18n();

export const destroyBuildings = (
  player: Player,
  count: number,
  buildings = player.city.buildings
) => {
  buildings = Array<Building>().concat(buildings);
  return Array(Math.min(count, buildings.length))
    .fill(undefined)
    .map(() => {
      const building = buildings
        .splice(Math.round((buildings.length - 1) * Math.random()), 1)
        .shift();
      if (!building) {
        debugger;
        throw new Error('building not found');
      }
      player.city.destroyBuilding(building);
      player.checkStatus();
      return new AttackResultBuilding({
        key: building.key,
        destroyed: true
      });
    });
};

export const sabotateBuildings = (
  player: Player,
  count: number,
  buildings = player.city.buildings
) => {
  buildings = Array<Building>().concat(buildings);
  return Array(count)
    .fill(undefined)
    .map(() => {
      const building = buildings
        .splice(Math.round((buildings.length - 1) * Math.random()), 1)
        .shift();

      if (!building) {
        debugger;
        throw new Error('building not found');
      }

      player.city.sabotageBuilding(building);
      return new AttackResultBuilding({
        key: building.key,
        sabotaged: true
      });
    });
};

export const getDestroyedBuildingsLines = (attackResults: AttackResult[]) => {
  attackResults = Array<AttackResult>().concat(attackResults);
  const destroyedBuildings = attackResults.reduce<{
    [key: number]: string[];
  }>((result, { buildings, fromPlayer }) => {
    result[fromPlayer.index] = result[fromPlayer.index] || [];
    result[fromPlayer.index].push(
      ...buildings.filter(({ destroyed }) => destroyed).map(({ key }) => key)
    );
    return result;
  }, {});

  return Object.entries(destroyedBuildings)
    .map(([playerIndex, buildings]) => {
      const buildingMap = buildings.reduce<{ [key: string]: number }>(
        (result, key) => {
          result[key] = (result[key] || 0) + 1;
          return result;
        },
        {}
      );

      return Object.entries(buildingMap).map(([key, count]) => {
        return {
          color: 'red',
          content: t('attacks.lines.destroyed_buildings', {
            overrides: {
              player: playerIndex + 1,
              count,
              building: autoEllipsis(t(`building.${key}.name`), 14)
            }
          })
        };
      });
    })
    .flat();
};

export const getDestroyedSabotagedLines = (attackResults: AttackResult[]) => {
  attackResults = Array<AttackResult>().concat(attackResults);
  const destroyedBuildings = attackResults.reduce<{ [key: number]: string[] }>(
    (result, { buildings, fromPlayer }) => {
      result[fromPlayer.index] = result[fromPlayer.index] || [];
      result[fromPlayer.index].push(
        ...buildings.filter(({ sabotaged }) => sabotaged).map(({ key }) => key)
      );
      return result;
    },
    {}
  );

  return Object.entries(destroyedBuildings)
    .map(([playerIndex, buildings]) => {
      const buildingMap = buildings.reduce<{ [key: string]: number }>(
        (result, key) => {
          result[key] = (result[key] || 0) + 1;
          return result;
        },
        {}
      );

      return Object.entries(buildingMap).map(([key, count]) => {
        return {
          color: 'red',
          content: t('attacks.lines.sabotaged_buildings', {
            overrides: {
              player: playerIndex + 1,
              count,
              building: autoEllipsis(t(`building.${key}.name`), 14)
            }
          })
        };
      });
    })
    .flat();
};

export const getDamagedVehiclesLines = (attackResults: AttackResult[]) => {
  attackResults = Array<AttackResult>().concat(attackResults);
  const damagedVehicles = attackResults.reduce<{ [key: string]: string[] }>(
    (result, { vehicles, fromPlayer }) => {
      result[fromPlayer.index] = result[fromPlayer.index] || [];
      result[fromPlayer.index].push(
        ...vehicles
          .filter(({ destroyed, damaged }) => !destroyed && damaged)
          .map(({ key }) => key)
      );
      return result;
    },
    {}
  );

  return Object.entries(damagedVehicles)
    .map(([playerIndex, vehicles]) => {
      const vehicleMap = vehicles.reduce<{ [key: string]: number }>(
        (result, key) => {
          result[key] = (result[key] || 0) + 1;
          return result;
        },
        {}
      );

      return Object.entries(vehicleMap).map(([key, count]) => {
        return {
          color: 'red',
          content: t('attacks.lines.damaged_vehicles', {
            overrides: {
              player: playerIndex + 1,
              count,
              vehicle: autoEllipsis(t(`vehicle.${key}.name`), 14)
            }
          })
        };
      });
    })
    .flat();
};

/**
 *
 * @param {import('../../classes/AttackResult').default[]} attackResults
 * @returns Array
 */
export const getDestroyedVehiclesLines = (attackResults: AttackResult[]) => {
  attackResults = Array<AttackResult>().concat(attackResults);
  const destroyedVehicles = attackResults.reduce<{ [key: string]: string[] }>(
    (result, { vehicles, fromPlayer }) => {
      result[fromPlayer.index] = result[fromPlayer.index] || [];
      result[fromPlayer.index].push(
        ...vehicles.filter(({ destroyed }) => destroyed).map(({ key }) => key)
      );
      return result;
    },
    {}
  );

  return Object.entries(destroyedVehicles)
    .map(([playerIndex, vehicles]) => {
      const vehicleMap = vehicles.reduce<{ [key: string]: number }>(
        (result, key) => {
          result[String(key)] = (result[String(key)] || 0) + 1;
          return result;
        },
        {}
      );

      return Object.entries(vehicleMap).map(([key, count]) => {
        return {
          color: 'red',
          content: t('attacks.lines.destroyed_vehicles', {
            overrides: {
              player: playerIndex + 1,
              count,
              vehicle: autoEllipsis(t(`vehicle.${key}.name`), 14)
            }
          })
        };
      });
    })
    .flat();
};

export const getLossesEmployeesLines = (
  employeeAttackResults: EmployeeAttackResult[]
) => {
  employeeAttackResults = Array<EmployeeAttackResult>().concat(
    employeeAttackResults
  );
  const losses = employeeAttackResults
    .map(({ losses }) => losses)
    .flat()
    .reduce<{ [key: string]: number }>((result, loss) => {
      result[loss.key] = result[loss.key] || 0;
      result[loss.key] += loss.value;
      return result;
    }, {});

  return Object.entries(losses).map(([key, count]) => {
    return {
      color: count > 0 ? 'red' : 'green',
      content: t(`round_complete.attack_control.losses.${key}`, {
        overrides: { count }
      })
    };
  });
};

export const buildingDestroy = (
  city: City,
  player: Player,
  minSoldiers: number,
  maxSoldiers: number,
  type?: BUILDING_TYPE | BUILDING_TYPE[]
) => {
  return of({ city, player }).pipe(
    map(({ city, player }) => {
      const buildings = player.city.buildings.filter(
        building => !type || building.isType(type)
      );

      if (!buildings.length) {
        return;
      }

      const totalSoldiers = city.soldier.value;

      if (totalSoldiers >= minSoldiers) {
        // angreifer
        const soldiers = Math.min(maxSoldiers, totalSoldiers);
        let attackValue = Math.round(
          soldiers * (0.25 + 0.75 * city.soldier.level)
        );

        // Verteidiger
        const securityService = player.city.securityService.value;

        const defenseValue = Math.round(
          securityService * (0.25 + 0.75 * player.city.securityService.level)
        );

        attackValue = attackValue - defenseValue;
        const defenseDiffValue = defenseValue - attackValue;

        const fromPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.ATTACK_CITY,
          fromPlayer: city.player,
          toPlayer: player
        });
        const toPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.ATTACK_CITY,
          fromPlayer: city.player,
          toPlayer: player
        });

        if (attackValue > 0) {
          fromPlayerResult.successfully = true;
          fromPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SOLDIER,
            Math.max(attackValue, 0)
          );
          city.soldier.remove(attackValue);
          toPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SECURITY_SERVICE,
            Math.abs(defenseDiffValue)
          );
          player.city.securityService.remove(defenseDiffValue);
        } else {
          toPlayerResult.successfully = true;
          toPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SECURITY_SERVICE,
            Math.abs(attackValue)
          );
          player.city.securityService.remove(Math.abs(attackValue));
          fromPlayerResult.addEmployeeLoss(EMPLOYEE_TYPE.SOLDIER, soldiers);
          city.soldier.remove(soldiers);
        }

        toPlayerResult.buildings = destroyBuildings(
          player.city.player,
          Math.round((Math.max(attackValue, 0) / minSoldiers) * Math.random()),
          buildings.filter(building => !type || building.isType(type))
        );

        player.city.attackControl.addResult(toPlayerResult);
        city.attackControl.addResult(fromPlayerResult);
      } else {
        throw new Error(ERROR_MESSAGES.NOT_ENOUGH_SOLDIERS);
      }
    })
  );
};

export const buildingSabotate = (
  city: City,
  player: Player,
  minMercenaries: number,
  maxMercenaries: number,
  type: BUILDING_TYPE[]
) => {
  return of({ city, player }).pipe(
    map(({ city, player }) => {
      const buildings = player.city.buildings.filter(
        building => !type || building.isType(type)
      );

      if (!buildings.length) {
        return;
      }

      const totalMercenary = city.mercenary.value;

      if (totalMercenary >= minMercenaries) {
        // angreifer
        const mercenaries = Math.min(maxMercenaries, totalMercenary);
        let attackValue = Math.round(
          mercenaries * (0.25 + 0.75 * city.mercenary.level)
        );

        // Verteidiger
        const securityService = player.city.securityService.value;

        const defenseValue = Math.round(
          securityService * (0.25 + 0.75 * player.city.securityService.level)
        );

        attackValue = attackValue - defenseValue;
        const defenseDiffValue = defenseValue - attackValue;

        const fromPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.FACTORY_SABOTAGE,
          fromPlayer: city.player,
          toPlayer: player
        });
        const toPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.FACTORY_SABOTAGE,
          fromPlayer: city.player,
          toPlayer: player
        });

        if (attackValue > 0) {
          fromPlayerResult.successfully = true;
          fromPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.MERCENARY,
            mercenaries
          );
          city.mercenary.remove(Math.max(attackValue, 0));
          toPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SECURITY_SERVICE,
            Math.abs(defenseDiffValue)
          );
          player.city.securityService.remove(defenseDiffValue);
        } else {
          toPlayerResult.successfully = true;
          toPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SECURITY_SERVICE,
            Math.abs(attackValue)
          );
          player.city.securityService.remove(Math.abs(attackValue));
          fromPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.MERCENARY,
            mercenaries
          );
          player.city.mercenary.remove(mercenaries);
        }

        toPlayerResult.buildings = sabotateBuildings(
          player,
          Math.round(
            (Math.max(attackValue, 0) / minMercenaries) * Math.random()
          ),
          buildings
        );

        player.city.attackControl.addResult(toPlayerResult);
        city.attackControl.addResult(fromPlayerResult);
      } else {
        throw new Error(ERROR_MESSAGES.NOT_ENOUGH_MERCENARIES);
      }
    })
  );
};
