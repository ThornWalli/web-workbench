import VehicleWeapon from './VehicleWeapon';

export default class Vehicle {
  key = null;
  name = null;
  storage = 0;
  maxStorage = 0;
  plating = 0;
  maxPlating = 0;
  weapon = null;
  cost = 0;
  repair = false;

  constructor (options) {
    options = Object.assign({

    }, options);

    this.key = options.key;
    this.name = options.name;
    this.storage = options.storage;

    if (this.plating > this.maxPlating) {
      this.maxPlating = this.plating;
    }
    if (this.storage > this.maxStorage) {
      this.maxStorage = this.storage;
    }
    if (this.weapon) {
      this.weapon = VehicleWeapon;
    }
  }

  getRepairCost () {
    return parseInt((this.get('cost') - parseInt(this.get('cost') * (this.get('plating') / this.get('maxPlating')))) * 0.8);
  }

  parseFromItem (item) {
    this.set(item);
  }

  toJSON () {
    return {

      key: this.attributes.key,
      storage: this.attributes.storage,
      plating: this.attributes.plating,
      weapon: this.attributes.weapon

    };
  }
}

// define([
//   './VehicleWeapon'
// ], function (VehicleWeapon) {
//   return {
//     grabber: {
//       key: 'grabber',
//       name: 'Grabber',
//       storage: 20,
//       plating: 10,
//       weapon: VehicleWeapon.none,
//       cost: 720
//     },
//     shrimp: {
//       key: 'shrimp',
//       name: 'Shrimp',
//       storage: 20,
//       plating: 20,
//       weapon: VehicleWeapon.none,
//       cost: 920
//     },
//     birdy: {
//       key: 'birdy',
//       name: 'birdy',
//       storage: 40,
//       plating: 20,
//       weapon: VehicleWeapon.none,
//       cost: 1220
//     },
//     spider: {
//       key: 'spider',
//       name: 'Spider',
//       storage: 40,
//       plating: 40,
//       weapon: VehicleWeapon.cannon,
//       cost: 4220
//     },
//     hawk: {
//       key: 'hawk',
//       name: 'Hawk',
//       storage: 60,
//       plating: 40,
//       weapon: VehicleWeapon.cannon,
//       cost: 5020
//     },
//     phantom: {
//       key: 'phantom',
//       name: 'Phantom',
//       storage: 60,
//       plating: 60,
//       weapon: VehicleWeapon.laser_cannon,
//       cost: 7920
//     },
//     thunder: {
//       key: 'thunder',
//       name: 'Thunder',
//       storage: 60,
//       plating: 60,
//       weapon: VehicleWeapon.plasma_cannon,
//       cost: 7920
//     },
//     bigPlunder: {
//       key: 'bigPlunder',
//       name: 'Big Plunder',
//       storage: 80,
//       plating: 90,
//       weapon: VehicleWeapon.rocket_launcher,
//       cost: 9920
//     }
//   };
// });
