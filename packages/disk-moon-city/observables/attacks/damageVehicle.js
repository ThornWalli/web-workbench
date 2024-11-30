import { map, of } from 'rxjs';
import EmployeeAttackResult from '../../classes/attackResult/EmployeeAttackResult.js';
import {
  MAX_USAGE_VALUE,
  MIN_USAGE_VALUE
} from '../../classes/cityEmployees/Soldier.js';
import { ATTACK_TYPE, EMPLOYEE_TYPE } from '../../utils/keys.js';
import { AttackResultVehicle } from '../../classes/AttackResult.js';

/**
 * Greift mit Soldaten Gebäude an.
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 */
export default function damageVehicle(city, player) {
  const minSoldiers = MIN_USAGE_VALUE;
  const maxSoldiers = MAX_USAGE_VALUE;

  return of({ city, player }).pipe(
    map(({ city, player }) => {
      const vehicles = player.city.getAvailableVehicles();

      if (!vehicles.length) {
        return;
      }

      const totalSoldiers = city.soldier.value;

      if (totalSoldiers >= minSoldiers) {
        // angreifer
        let soldiers = Math.min(maxSoldiers, totalSoldiers);
        const startSoliders = soldiers;

        // // Verteidiger
        // const securityService = player.city.securityService.value;

        // const defenseValue = Math.round(
        //   securityService * (0.25 + 0.75 * player.city.securityService.level)
        // );

        // attackValue = attackValue - defenseValue;
        // const defenseDiffValue = defenseValue - attackValue;

        const fromPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.DAMAGE_VEHICLE,
          fromPlayer: city.player,
          toPlayer: player
        });
        const toPlayerResult = new EmployeeAttackResult({
          type: ATTACK_TYPE.DAMAGE_VEHICLE,
          fromPlayer: city.player,
          toPlayer: player
        });

        // if (attackValue > 0) {
        //   fromPlayerResult.successfully = true;
        //   fromPlayerResult.addEmployeeLoss(EMPLOYEE_TYPE.SOLDIER, soldiers);
        //   city.soldier.remove(Math.max(attackValue, 0));
        //   toPlayerResult.addEmployeeLoss(
        //     EMPLOYEE_TYPE.SECURITY_SERVICE,
        //     Math.abs(defenseDiffValue)
        //   );
        // }

        /**
         * @type {import('../../classes/Vehicle.js').default[]}
         */
        const vehicles = [];
        const meetsVehicle = () => Math.random() > 0;
        const getHitRate = () => Math.random();

        player.city.vehicles.forEach(vehicle => {
          if (meetsVehicle()) {
            const soldatHitRate = getHitRate();
            const vehicleHitRate = getHitRate();
            const vehicleAttacksFirst = Math.random() > 0.5;

            console.log({
              soldatHitRate,
              vehicleHitRate
            });

            let defenseValue = 0;
            // first vehicle shoot
            if (vehicleAttacksFirst && vehicleHitRate) {
              defenseValue = Math.round(vehicle.weapon.damage * vehicleHitRate);
              soldiers = soldiers - defenseValue;
            }

            let attackValue = Math.round(
              soldiers * (0.25 + 0.75 * city.soldier.level)
            );
            attackValue = attackValue - defenseValue;
            attackValue = Math.max(attackValue, 0);

            console.log({
              soldatHitRate,
              attackValue,
              soldiers,
              test: Math.round(attackValue * soldatHitRate)
            });

            if (soldatHitRate && attackValue) {
              const value = Math.round(attackValue * soldatHitRate);
              vehicle.attack(value);

              if (vehicle.destroyed) {
                player.city.removeVehicle(vehicle);
              }
              vehicles.push(vehicle);
            }

            if (!vehicleAttacksFirst && vehicleHitRate) {
              const defenseValue = Math.round(
                vehicle.weapon.damage * vehicleHitRate
              );
              soldiers = soldiers - defenseValue;
            }
          }
        });

        if (vehicles.length > 0) {
          fromPlayerResult.successfully = vehicles.length > 0;
          fromPlayerResult.addEmployeeLoss(
            EMPLOYEE_TYPE.SOLDIER,
            Math.max(startSoliders - soldiers, 0)
          );
          city.soldier.remove(startSoliders - soldiers);
        } else {
          toPlayerResult.successfully = true;
          fromPlayerResult.addEmployeeLoss(EMPLOYEE_TYPE.SOLDIER, soldiers);
          city.soldier.remove(soldiers);
        }

        toPlayerResult.vehicles = vehicles.map(
          vehicle =>
            new AttackResultVehicle({
              key: vehicle.key,
              damaged: vehicle.damaged,
              destroyed: vehicle.destroyed
            })
        );
        player.city.attackControl.addResult(toPlayerResult);
        city.attackControl.addResult(fromPlayerResult);
      } else {
        throw new Error('not_enough_soldiers');
      }
    })
  );
}
