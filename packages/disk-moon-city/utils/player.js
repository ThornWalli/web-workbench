import EnergyTransmitter from '../classes/buildings/EnergyTransmitter';
import GreenHouse from '../classes/buildings/GreenHouse';
import House from '../classes/buildings/House';
import OreStorage from '../classes/buildings/OreStorage';
import PowerStation from '../classes/buildings/PowerStation';
import Refinery from '../classes/buildings/Refinery';
import ShieldGenerator from '../classes/buildings/ShieldGenerator';
import Grabber from '../classes/vehicles/Grabber.js';
import { STORAGE_TYPE } from './keys.js';

/**
 *
 * @param {import('../classes/Player.js').default} player
 * @returns
 */
export const basicPlayerConfig = (player, buildings) => {
  player.city.addStorageValue(STORAGE_TYPE.CREDITS, 12000);
  player.city.addStorageValue(STORAGE_TYPE.HUMAN, 4000);
  player.city.addStorageValue(STORAGE_TYPE.ENERGY_CELL, 800);

  player.city.buildings.push(
    ...(buildings || [
      new OreStorage(),
      new Refinery(),
      new PowerStation(),
      new EnergyTransmitter(),
      ...Array(10)
        .fill()
        .map(() => new House()),
      new GreenHouse(),
      new GreenHouse(),
      new ShieldGenerator()
    ])
  );
  player.city.vehicles.push(new Grabber());

  player.city.buildings.forEach(building => {
    Object.entries(building.roundProduction)
      .filter(([key]) => ![STORAGE_TYPE.CREDITS].includes(key))
      .forEach(([key, value]) => {
        player.city.addStorageValue(key, value);
      });
  });

  return player;
};
