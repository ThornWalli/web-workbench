import { map, of } from 'rxjs';
import { AttackResultBuilding } from '../../classes/AttackResult.js';
import EmployeeAttackResult from '../../classes/attackResult/EmployeeAttackResult.js';
import useI18n from '../../composables/useI18n.js';
import { ATTACK_TYPE, EMPLOYEE_TYPE } from '../../utils/keys.js';
import { autoEllipsis } from '../../utils/string.js';

const { t } = useI18n();

/**
 *
 * @param {import('../../classes/Player.js').default} player
 * @param {Number} count
 * @returns {import('../../classes/Building.js').default[]}
 */
export const destroyBuildings = (
  player,
  count,
  buildings = player.city.buildings
) => {
  buildings = [].concat(buildings);
  return Array(Math.min(count, buildings.length))
    .fill()
    .map(() => {
      const building = buildings
        .splice(Math.round((buildings.length - 1) * Math.random()), 1)
        .shift();
      if (!building) {
        debugger;
      }
      player.city.destroyBuilding(building);
      player.checkStatus();
      return new AttackResultBuilding({
        key: building.key,
        destroyed: true
      });
    });
};

/**
 *
 * @param {import('../../classes/Player.js').default} player
 * @param {Number} count
 * @returns {import('../../classes/Building.js').default[]}
 */
export const sabotateBuildings = (
  player,
  count,
  buildings = player.city.buildings
) => {
  buildings = [].concat(buildings);
  return Array(count)
    .fill()
    .map(() => {
      const building = buildings
        .splice(Math.round((buildings.length - 1) * Math.random()), 1)
        .shift();
      console.log(building);
      player.city.sabotageBuilding(building);
      return new AttackResultBuilding({
        key: building.key,
        sabotaged: true
      });
    });
};

/**
 *
 * @param {import('../../classes/AttackResult.js').default[]} attackResults
 * @returns Array
 */
export const getDestroyedBuildingsLines = attackResults => {
  attackResults = [].concat(attackResults);
  const destroyedBuildings = attackResults.reduce(
    (result, { buildings, fromPlayer }) => {
      result[fromPlayer.index] = result[fromPlayer.index] || [];
      result[fromPlayer.index].push(
        ...buildings.filter(({ destroyed }) => destroyed).map(({ key }) => key)
      );
      return result;
    },
    {}
  );

  return Object.entries(destroyedBuildings)
    .map(([playerIndex, buildings]) => {
      const buildingMap = buildings.reduce((result, key) => {
        result[String(key)] = (result[String(key)] || 0) + 1;
        return result;
      }, {});

      return Object.entries(buildingMap).map(([key, count]) => {
        return {
          color: 'red',
          content: `Spieler ${playerIndex + 1} Zerstörte: ${count} ${autoEllipsis(t(`building.${key}`).name, 14)}`
        };
      });
    })
    .flat();
};

/**
 *
 * @param {import('../../classes/AttackResult.js').default[]} attackResults
 * @returns Array
 */
export const getDestroyedSabotagedLines = attackResults => {
  attackResults = [].concat(attackResults);
  const destroyedBuildings = attackResults.reduce(
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
      const buildingMap = buildings.reduce((result, key) => {
        result[String(key)] = (result[String(key)] || 0) + 1;
        return result;
      }, {});

      return Object.entries(buildingMap).map(([key, count]) => {
        return {
          color: 'red',
          content: `Spieler ${playerIndex + 1} Sabortierte: ${count} ${autoEllipsis(t(`building.${key}`).name, 14)}`
        };
      });
    })
    .flat();
};

/**
 *
 * @param {import('../../classes/AttackResult.js').default[]} attackResults
 * @returns Array
 */
export const getDamagedVehiclesLines = attackResults => {
  attackResults = [].concat(attackResults);
  const damagedVehicles = attackResults.reduce(
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
      const vehicleMap = vehicles.reduce((result, key) => {
        result[String(key)] = (result[String(key)] || 0) + 1;
        return result;
      }, {});

      return Object.entries(vehicleMap).map(([key, count]) => {
        return {
          color: 'red',
          content: `Spieler ${playerIndex + 1} Beschädigte: ${count} ${autoEllipsis(t(`vehicle.${key}`).name, 14)}`
        };
      });
    })
    .flat();
};

/**
 *
 * @param {import('../../classes/AttackResult.js').default[]} attackResults
 * @returns Array
 */
export const getDestroyedVehiclesLines = attackResults => {
  attackResults = [].concat(attackResults);
  const destroyedVehicles = attackResults.reduce(
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
      const vehicleMap = vehicles.reduce((result, key) => {
        result[String(key)] = (result[String(key)] || 0) + 1;
        return result;
      }, {});

      return Object.entries(vehicleMap).map(([key, count]) => {
        return {
          color: 'red',
          content: `Spieler ${playerIndex + 1} Zerstörte: ${count} ${autoEllipsis(t(`vehicle.${key}`).name, 14)}`
        };
      });
    })
    .flat();
};

/**
 *
 * @param {import('../../classes/attackResult/EmployeeAttackResult.js').default[]} employeeAttackResults
 * @returns Array
 */
export const getLossesEmployeesLines = employeeAttackResults => {
  employeeAttackResults = [].concat(employeeAttackResults);
  const losses = employeeAttackResults
    .map(({ losses }) => losses)
    .flat()
    .reduce((result, loss) => {
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

/**
 *
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 * @param {Number} minSoldiers
 * @param {Number} maxSoldiers
 * @param {import('../../utils/keys.js').ATTACK_TYPE} type
 * @returns
 */
export const buildingDestroy = (
  city,
  player,
  minSoldiers,
  maxSoldiers,
  type
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
        throw new Error('not_enough_soldiers');
      }
    })
  );
};

/**
 *
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 * @param {Number} minMercenaries
 * @param {Number} maxMercenaries
 * @param {import('../../utils/keys.js').BUILDING_TYPE} type
 * @returns {import('rxjs').Observable<undefined>}
 */
export const buildingSabotate = (
  city,
  player,
  minMercenaries,
  maxMercenaries,
  type
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
        throw new Error('not_enough_mercenaries');
      }
    })
  );
};
