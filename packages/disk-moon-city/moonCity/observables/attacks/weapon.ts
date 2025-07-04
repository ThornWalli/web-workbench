import { map, of } from 'rxjs';
import { STORAGE_TYPE } from '../../types';
import WeaponAttackResult from '../../classes/attackResult/WeaponAttackResult';
import { destroyBuildings } from './utils';
import { getRandom } from '../../utils/number';
import type City from '../../classes/City';
import type Player from '../../classes/Player';
import type Weapon from '../../classes/Weapon';

/**
 * @description Greift mit Soldaten Gebäude an.
 */
export default function weapon(city: City, player: Player, weapon: Weapon) {
  return of({ city, player }).pipe(
    map(({ city, player }) => {
      let weaponStrength = getRandom(weapon.maxDamage, weapon.damage);
      console.log({ weaponStrength });
      // shields
      let shield: number[] = [];

      // 3 ist ein volles Schild
      const SHIELD_ENERGY = 3;
      const shieldEnergy = player.city.getStorageValue(
        STORAGE_TYPE.SHIELD_ENERGY
      );
      const shieldExists = shieldEnergy > 0;

      if (shieldEnergy > 0) {
        const weaponStrengthShield = weaponStrength * SHIELD_ENERGY;

        shield = [
          shieldEnergy / SHIELD_ENERGY,
          Math.max((shieldEnergy - weaponStrengthShield) / SHIELD_ENERGY, 0)
        ];

        player.city.subtractStorageValue(
          STORAGE_TYPE.SHIELD_ENERGY,
          weaponStrengthShield
        );
        weaponStrength = Math.max(weaponStrength - shieldEnergy, 0);
      }

      const buildings = destroyBuildings(
        player,
        Math.min(weaponStrength, city.buildings.length)
      );

      const result = new WeaponAttackResult({
        weapon,
        fromPlayer: city.player,
        toPlayer: player,
        shield,
        shieldExists,
        buildings
      });
      player.city.attackControl.addResult(result);
      return result;
    })
  );
}
