import { concatAll, filter, from, map, reduce, toArray } from 'rxjs';
import { ATTACK_TYPE, LINE_GROUP, STORAGE_TYPE } from '../../types';
import useI18n from '../../composables/useI18n';
import { fillTextEnd, fillTextStart } from '../../utils/string';
import { getHitRate, meetsVehicle } from '../utils';
import AttackResult, { AttackResultVehicle } from '../../classes/AttackResult';
import type Player from '../../classes/Player';
import type Vehicle from '../../classes/Vehicle';
import type { ConsoleGroup, ConsoleGroupLines, ConsoleLine } from './types';

const { t } = useI18n();

export function vehiclesAttack(player: Player) {
  const otherVehicles = (player.core?.players || [])
    .filter(({ id }) => id !== player.id)
    .map(player =>
      player.city.vehicles
        .filter(vehicle => vehicle.isAvailable)
        .map(vehicle => ({ vehicle, player }))
    )
    .flat();

  return from(player.city.vehicles).pipe(
    filter(vehicle => !vehicle.repairing),
    reduce<
      Vehicle,
      {
        fromPlayer: Player;
        toPlayer: Player;
        fromVehicle: Vehicle;
        toVehicle: Vehicle;
      }[]
    >((result, vehicle) => {
      if (meetsVehicle()) {
        const fromDamage = Math.round(
          (vehicle.weapon?.damage || 0) * getHitRate()
        );

        const otherVehicle = otherVehicles
          .splice(Math.round(Math.random() * (otherVehicles.length - 1)), 1)
          .pop();
        if (otherVehicle) {
          otherVehicle.vehicle.attack(fromDamage);
          if (!otherVehicle.vehicle.destroyed) {
            const toDamage = Math.round(
              (otherVehicle.vehicle.weapon?.damage || 0) * getHitRate()
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
       * @type {Object.<string, {fromPlayer: import('../../classes/Player').default, toPlayer: import('../../classes/Player').default, vehicles: {fromVehicle: import('../../classes/Vehicle').default, toVehicle: import('../../classes/Vehicle').default}[]}>}
       */
      const vehicleByUsers = attackedVehicles.reduce<{
        [key: string]: {
          fromPlayer: Player;
          toPlayer: Player;
          vehicles: { fromVehicle: Vehicle; toVehicle: Vehicle }[];
        };
      }>((result, { fromPlayer, toPlayer, fromVehicle, toVehicle }) => {
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
      }, {});

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

export function vehiclesRepair(player: Player) {
  return from(player.city.vehicles).pipe(
    filter(vehicle => vehicle.repairing),
    reduce<
      Vehicle,
      {
        repaired: boolean;
        totalCost: number;
        lines: ConsoleGroup[];
      }
    >(
      (result, vehicle) => {
        const price = vehicle.repairPrice;

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
                  content: `Ausgaben - Sucher: ${fillTextStart('', 15, '.')} ${fillTextStart(String(totalCost), 5, '0')}`
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

export function vehicleArrives(
  player: Player,
  vehicleAttackLines: {
    [key: string]: ConsoleLine[];
  }
) {
  const freeStorage = player.city.getFreeStorageValue(STORAGE_TYPE.MINERAL_ORE);

  const storageType = STORAGE_TYPE.MINERAL_ORE;

  return from(player.city.vehicles).pipe(
    reduce<
      Vehicle,
      {
        incomeStorage: number;
        totalStorage: number;
        lines: ConsoleGroupLines;
      }
    >(
      (result, vehicle, index) => {
        if (vehicle.isAvailable) {
          if (!vehicle.storage) {
            throw new Error('vehicle.storage is undefined');
          }
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
              content: `${fillTextEnd(t(`vehicle.${vehicle.key}.name`), 12, ' ')} ${index + 1} brachte ${fillTextStart(String(storage), 4, ' ')} ${t('label.unit')} Erze !`
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
            const tst = vehicleAttackLines[vehicle.id];

            tst.forEach(line => {
              result.lines.push(line);
            });
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
      const groupedLines: ConsoleGroup[] = [
        {
          group: LINE_GROUP.VEHICLE,
          lines
        }
      ];

      if (freeStorage <= 0) {
        groupedLines.push({
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
        groupedLines.push({
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
      return groupedLines;
    }),
    concatAll()
  );
}
