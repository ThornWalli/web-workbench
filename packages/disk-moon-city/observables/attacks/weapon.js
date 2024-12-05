import { map, of } from 'rxjs';
import { STORAGE_TYPE } from '../../utils/keys.js';
import WeaponAttackResult from '../../classes/attackResult/WeaponAttackResult.js';
import { destroyBuildings } from './utils.js';
import { getRandom } from '../../utils/number.js';

/**
 * Greift mit Soldaten Gebäude an.
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/Player.js').default} player
 * @param {import('../../classes/Weapon.js').default} weapon
 */
export default function weapon(city, player, weapon) {
  return of({ city, player }).pipe(
    map(({ city, player }) => {
      let weaponStrength = getRandom(weapon.maxDamage, weapon.damage);
      console.log({ weaponStrength });
      // shields
      let shield = [];

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
