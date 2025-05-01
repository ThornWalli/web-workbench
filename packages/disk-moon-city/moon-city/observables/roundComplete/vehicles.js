import { concatAll, filter, from, map, reduce, toArray } from 'rxjs';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { ATTACK_TYPE, STORAGE_TYPE } from '../../utils/keys.js';
import useI18n from '../../composables/useI18n.js';
import { fillTextEnd, fillTextStart } from '../../utils/string.js';
import { getHitRate, meetsVehicle } from '../utils.js';
import AttackResult, {
  AttackResultVehicle
} from '../../classes/AttackResult.js';

const { t } = useI18n();

/**
 *
 * @param {import('../../classes/Player.js').default} player
 */
export function vehiclesAttack(player) {
  const otherVehicles = player.core.players
    .filter(({ id }) => id !== player.id)
    .map(player =>
      player.city.vehicles
        .filter(vehicle => vehicle.isAvailable)
        .map(vehicle => ({ vehicle, player }))
    )
    .flat();

  return from(player.city.vehicles).pipe(
    filter(vehicle => !vehicle.repairing),
    reduce((result, vehicle) => {
      if (meetsVehicle()) {
        const fromDamage = Math.round(vehicle.weapon.damage * getHitRate());

        const otherVehicle = otherVehicles
          .splice(Math.round(Math.random() * (otherVehicles.length - 1)), 1)
          .pop();
        if (otherVehicle) {
          otherVehicle.vehicle.attack(fromDamage);
          if (!otherVehicle.vehicle.destroyed) {
            const toDamage = Math.round(
              otherVehicle.vehicle.weapon.damage * getHitRate()
            );
            vehicle.attack(toDamage);
            result.push({
              fromPlayer: otherVehicle.player,
              toPlayer: player,
              fromVehicle: otherVehicle.vehicle,
              toVehicle: vehicle
            });
          }
          result.push({
            toVehicle: otherVehicle.vehicle,
            fromVehicle: vehicle,
            fromPlayer: player,
            toPlayer: otherVehicle.player
          });
        }
      }
      return result;
    }, []),
    map(attackedVehicles => {
      /**
       * @type {Object.<string, {fromPlayer: import('../../classes/Player.js').default, toPlayer: import('../../classes/Player.js').default, vehicles: {fromVehicle: import('../../classes/Vehicle.js').default, toVehicle: import('../../classes/Vehicle.js').default}[]}>}
       */
      const vehicleByUsers = attackedVehicles.reduce(
        (result, { fromPlayer, toPlayer, fromVehicle, toVehicle }) => {
          result[`${fromPlayer.id}_${toPlayer.id}`] = result[player.id] || {
            fromPlayer,
            toPlayer,
            vehicles: []
          };
          result[`${fromPlayer.id}_${toPlayer.id}`].vehicles.push({
            fromVehicle,
            toVehicle
          });
          return result;
        },
        {}
      );

      const results = Object.values(vehicleByUsers).map(
        ({ fromPlayer, toPlayer, vehicles }) => {
          return new AttackResult({
            type: ATTACK_TYPE.VEHICLE_ATTACK,
            fromPlayer,
            toPlayer,
            vehicles: vehicles.map(
              vehicle =>
                new AttackResultVehicle({
                  id: vehicle.toVehicle.id,
                  key: vehicle.toVehicle.key,
                  damaged: vehicle.toVehicle.damaged,
                  destroyed: vehicle.toVehicle.destroyed,
                  attackedFrom: vehicle.fromVehicle
                })
            )
          });
        }
      );

      results.forEach(result => {
        result.toPlayer.city.attackControl.addResult(result);
      });
    }),
    toArray()
  );
}

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

        if (player.city.credits - price > 0) {
          result.repaired = true;
          player.city.credits -= price;
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
                  content: `Ausgaben - Sucher: ${fillTextStart('', 15, '.')} ${fillTextStart(totalCost, 5, '0')}`
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
 * @param {AttackResult[]} attackResults
 */
export function vehicleArrives(player, vehicleAttackLines = {}) {
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
              content: `${fillTextEnd(t(`vehicle.${vehicle.key}.name`), ' ', 12)} ${index + 1} brachte ${fillTextStart(storage, ' ', 4)} ${t('label.unit')} Erze !`
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

          if (vehicle.id in vehicleAttackLines) {
            result.lines.push(...vehicleAttackLines[vehicle.id]);
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

      if (freeStorage <= 0) {
        lines.push({
          group: LINE_GROUP.GENERAL,
          lines: [
            [
              {
                color: 'red',
                content: 'Sie haben nicht genug Erzlager !'
              }
            ]
          ]
        });
      }
      if (freeStorage < totalStorage / 2) {
        lines.push({
          group: LINE_GROUP.GENERAL,
          lines: [
            [
              {
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
