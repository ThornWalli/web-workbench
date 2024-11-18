/* eslint-disable no-unused-vars */
import EnergyTransmitter from '../classes/buildings/EnergyTransmitter';
import GreenHouse from '../classes/buildings/GreenHouse';
import House from '../classes/buildings/House';
import OreStorage from '../classes/buildings/OreStorage';
import PowerStation from '../classes/buildings/PowerStation';
import Refinery from '../classes/buildings/Refinery';
import ShieldGenerator from '../classes/buildings/ShieldGenerator';
import Grabber from '../classes/vehicles/Grabber';

/**
 *
 * @param {import('../classes/Player.js').default} player
 * @returns
 */
export const basicPlayerConfig = player => {
  player.city.buildings.push(
    new OreStorage(),
    new Refinery(),
    new PowerStation(),
    // new EnergyTransmitter(),
    ...Array(10)
      .fill()
      .map(() => new House()),
    new GreenHouse(),
    new GreenHouse()
    // new ShieldGenerator()
  );
  player.city.vehicles.push(new Grabber());

  return player;
};
