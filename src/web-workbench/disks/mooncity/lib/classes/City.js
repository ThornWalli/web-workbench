export default class City {
  weapons= [];
  vehicles= [];
  buildings= [];
  destroyedBuildings= [];
  user= null;
  credits= 0;
  ore= 0;
  food= 0;
  population= 0;
  security= 0;
  soldiers= 0;
  mercenary= 0;
  populationMood= {
    energy: 0,
    food: 0,
    house: 0,
    credits: 0
  };

  taxesFood= 4;
  taxesEnergy= 4;
  taxesCredits= 50;
  taxesRent= 15;
  energyCell= 0;
  energyCellPowerStationVolume= 100;
  energyTransferVolume= 100;
  energy= 0;
  energySales= 0;
  populationRecruit= false;
  securityRecruit= false;
  soldiersRecruit= false;
  mercenaryRecruit= false;
  securityLevel= 0;
  securityTraining= false;
  soldiersLevel= 0;
  soldiersTraining= false;
  mercenaryLevel= 0;
  mercenaryTraining= false;
  userSpies= [];
  vehicleAttacks= {};
  userAttack= {};
  userSabotage= [];
  cityAttack= {};

  /**
   * Ruft die max. Anzahl an Nahrung ab.
   * @return {number}
   */
  getMaxFood () {
    const buildings = this.getBuildingsByType([
      'storage', 'food'
    ], true);
    let units = 0;
    buildings.forEach(function (building) {
      units += building.get('storage').food;
    });
    return units;
  }

  /**
   * Ruft die max. Anzahl an Energiezellen ab.
   * @return {Number}
   */
  getMaxEnergyCell () {
    const buildings = this.getBuildingsByType([
      'storage', 'energyCell'
    ], true);
    let units = 0;
    buildings.forEach(function (building) {
      units += building.get('storage').energyCell || 0;
    });
    return units;
  }

  /**
    * Ruft die Gebaeude mit dem angegebenen Typen ab.
    */
  getBuildingsByType (types, strict) {
    if (strict) {
      return this.buildings.filter((building) => {
        return types.filter(type => building.type.includes(type)).length === types.length;
      });
    } else {
      return this.buildings.filter((building) => {
        return building.type.find(type => types.includes(type));
      });
    }

    // if (strict) {
    //   return this.buildings.filter(building => types.filter(type => building.type).length === types.length);
    // }
    // return this.buildings.filter(building => types.includes(building.type));
  }

  /**
   * Ruft den aktuellen Enerieumwandlungs Betrag ab.
   * @return {Number}
   */
  getCurrentEnergyTransfer () {
    if (this.getBuildingsByType([
      'energy', 'transmitter'
    ], true).length < 1) {
      return 0;
    }
    const energy = this.energy * (this.energyTransferVolume / 100);
    return energy >= 1600 ? 1600 : energy;
  }
}
// define(['../base/Model', '../utils', '../base/collection/WeaponsCollection', '../base/collection/VehicleCollection', '../base/collection/BuildingsCollection'],
//     function (Model, utils, WeaponsCollection, VehicleCollection, BuildingsCollection) {

//         return Model.extend({

//             MAX_TAXES: 8,
//             MAX_VEHICLES: 4,
//             MAX_TAXES: 8,
//             SIZE_NAMES: ['Kleinstadt', 'Stadt', 'Großstadt'],
//             DEFAULT_CITY_ATTACK: function () {
//                 return {
//                     cityAttack: null,
//                     factorySabotage: null,
//                     powerStationSabotage: null,
//                     energyTransmitterDestroy: null,
//                     vehicleSabotage: null,
//                     weapon: []
//                 };
//             },

//             idAttribute: 'id',
//             defaults: function () {
//                 return {

//                     weapons: new WeaponsCollection,
//                     vehicles: new VehicleCollection,
//                     buildings: new BuildingsCollection,
//                     destroyedBuildings: [],

//                     user: null,
//                     credits: 0,

//                     ore: 0,
//                     food: 0,

//                     population: 0,
//                     security: 0,
//                     soldiers: 0,
//                     mercenary: 0,

//                     populationMood: {
//                         energy: 0,
//                         food: 0,
//                         house: 0,
//                         credits: 0
//                     },

//                     taxesFood: 4,
//                     taxesEnergy: 4,
//                     taxesCredits: 50,
//                     taxesRent: 15,

//                     energyCell: 0,
//                     energyCellPowerStationVolume: 100,
//                     energyTransferVolume: 100,
//                     energy: 0,
//                     energySales: 0,

//                     populationRecruit: false,
//                     securityRecruit: false,
//                     soldiersRecruit: false,
//                     mercenaryRecruit: false,

//                     securityLevel: 0,
//                     securityTraining: false,
//                     soldiersLevel: 0,
//                     soldiersTraining: false,
//                     mercenaryLevel: 0,
//                     mercenaryTraining: false,

//                     userSpies: [],
//                     vehicleAttacks: {},
//                     userAttack: {},
//                     userSabotage: [],
//                     cityAttack: {}

//                 };
//             },

//             initialize: function () {
//                 Model.prototype.initialize.apply(this, arguments);
//                 this.get('weapons').on('add', onAddItem.bind(this));
//                 this.get('vehicles').on('add', onAddItem.bind(this));
//                 this.get('buildings').on('add', onAddItem.bind(this));
//                 this.get('weapons').on('remove', onRemoveItem.bind(this));
//                 this.get('vehicles').on('remove', onRemoveItem.bind(this));
//                 this.get('buildings').on('remove', onRemoveItem.bind(this));
//                 //this.get('weapons').add(new
//                 //    Model)
//                 console.log(this.get('weapons').length, this.get('vehicles').length, this.get('buildings').length);

//                 this.on('change:credits', function (model, value) {
//                     console.log(value);
//                 })

//             },

//             /**
//              * Ruft die prozentuale Bevölkerungsstimmung ab.
//              * @return {number}
//              */
//             populationMoodScalar: function () {
//                 var mood = 0;
//                 var populationMood = this.get('populationMood');
//                 for (var type in populationMood) {
//                     if (populationMood.hasOwnProperty(type)) {
//                         mood += populationMood[type];
//                     }
//                 }
//                 return mood;
//             },

//             /**
//              * Ruft alle verfügbaren Fahrzeuge ab.
//              * @return {Array}
//              */
//             getAvailableVehicles: function () {
//                 return this.get('vehicles').where({repair: false});
//             },
//             /**
//              * Setzt den angegebenen Sucher auf reparieren.
//              * @param {object} vehicle
//              */
//             repairVehicle: function (vehicle) {
//                 this.set('credits', this.get('credits') - vehicle.getRepairCost());
//                 vehicle.set('repair', true);
//             },
//             /**
//              * Fügt ein neuen Sucher hinzu und zieht die Kosten ab.
//              * @param {object} vehicle
//              */
//             buyVehicle: function (vehicle) {
//                 this.set('credits', this.get('credits') - vehicle.get('cost'));
//                 this.get('vehicles').add(vehicle);
//             },
//             /**
//              * Entfernt den angegebenen Sucher und fügt Kosten hinzu.
//              * @param {object} vehicle
//              */
//             sellVehicle: function (vehicle) {
//                 var cost = parseInt(vehicle.get('cost') * (vehicle.get('plating') / vehicle.get('maxPlating')));
//                 this.set('credits', this.get('credits') + cost);
//                 vehicle.destroy();
//             },
//             /**
//              * Fügt ein neues Gebäude hinzu und zieht die Kosten ab.
//              * @param {object} building
//              */
//             buyBuilding: function (building) {
//                 this.set('credits', this.get('credits') - building.get('cost'));
//                 this.get('buildings').add(building);
//             },
//             /**
//              * Entfernt das angegebenen Gebäude und fügt Kosten hinzu.
//              * @param {object} building
//              */
//             sellBuilding: function (building) {
//                 this.set('credits', this.get('credits') + building.get('cost'));
//                 building.destroy();
//             },
//             /**
//              * Entfernt die angegebene Gebäude und setzt dieses in die Liste der zerstörten Gebäude.
//              * @param {object} building
//              */
//             destroyBuilding: function (building) {
//                 this.get('destroyedBuildings').push(building.get('key'));
//                 building.remove();
//             },
//             /**
//              * Fügt eine neue Waffe hinzu und zieht die Kosten ab.
//              * @param {object} building
//              */
//             buyWeapon: function (weapon) {
//                 this.set('credits', this.get('credits') - weapon.get('cost'));
//                 this.get('weapons').add(weapon);
//             },
//             /**
//              * Entfernt die angegebene Waffe und fügt Kosten hinzu.
//              * @param {object} weapon
//              */
//             sellWeapon: function (weapon) {
//                 this.set('credits', this.get('credits') + weapon.get('cost'));
//                 weapon.destroy();
//             },

//             /**
//              * Führt einen Waffen angriff auf einen Spieler Stadt aus.
//              * @param {number} userId Gegnerische Spieler-ID
//              * @param {object} weapon Waffe
//              * @return Boolean
//              */
//             useWeapon: function (userId, weapon) {
//                 weapon.remove();
//                 var user = this.get('user');

//                 var targetUser = user.get('game').get('users').get(userId);
//                 var targetCity = targetUser.get('city');

//                 var buildings = targetCity.get('buildings');
//                 //var shields = targetCity.get('buildings').findTypes(['shield']);

//                 var damage = utils.randomNumber(weapon.get('damage'), weapon.get('maxDamage') > (buildings.length) ? buildings.length : weapon.get('maxDamage'));
//                 var cityAttack = this.getCityAttack(userId);

//                 cityAttack.weapon.push({
//                     key: weapon.get('key'),
//                     destroyedBuildingsCount: damage
//                 });

//                 return true;

//             },

//             // city attack

//             /**
//              * Fügt einen neuen Stadt-Angriff hinzu.
//              *
//              * @param {Number} user Spieler-ID
//              * @param {boolean} cityAttack
//              * @param {boolean} factorySabotage
//              * @param {boolean} powerStationSabotage
//              * @param {boolean} energyTransmitterDestroy
//              * @param {boolean} vehicleSabotage
//              * @param {object[]} weapon
//              */
//             addCityAttack: function (user, cityAttack, factorySabotage, powerStationSabotage, energyTransmitterDestroy, vehicleSabotage, weapon) {
//                 if (!Array.isArray(weapon)) {
//                     weapon = [];
//                 }
//                 this.get('cityAttack')[user] = {
//                     cityAttack: cityAttack,
//                     factorySabotage: factorySabotage,
//                     powerStationSabotage: powerStationSabotage,
//                     energyTransmitterDestroy: energyTransmitterDestroy,
//                     vehicleSabotage: vehicleSabotage,
//                     weapon: weapon

//                 };
//             },

//             /**
//              * Ruft die Attack auf den angegebenen Spieler ab.
//              * @param {Number} user Spieler-ID
//              */
//             getCityAttack: function (user) {
//                 if (this.get('cityAttack')[user] == undefined) {
//                     this.addCityAttack(user, false, false, false, false, false, []);
//                 }
//                 return this.get('cityAttack')[user];
//             },

//             // utils

//             /**
//              * Ruft einen Smilie je nach Stimmung der Stadt ab.
//              * @return {string}
//              */
//             getMoodSmile: function () {

//                 var population = this.get('population');
//                 var populationMoodScalar = this.populationMoodScalar();
//                 var text = '';
//                 if (population < 1) {
//                     text = ' :-X';
//                 } else if (populationMoodScalar >= .9) {
//                     text = ' :-D';
//                 } else if (populationMoodScalar >= .6) {
//                     text = ' :-)';
//                 } else if (populationMoodScalar >= .4) {
//                     text = ' :-|';
//                 } else if (populationMoodScalar >= .2) {
//                     text = ' :-(';
//                 } else if (populationMoodScalar <= .0) {
//                     text = '>:-(';
//                 }
//                 return text;
//             },
//             /**
//              * Ruft einen Text je nach Stimmung der Stadt ab.
//              * @param {boolean} console Konsolenausgabe
//              * @returns {string}
//              */
//             getMoodText: function (console) {

//                 var population = this.get('population');
//                 var populationMoodScalar = this.populationMoodScalar();
//                 var text = '';

//                 if (console != undefined && !Boolean(console)) {

//                     if (population < 1) {
//                         text = 'Kein Volk';
//                     } else if (populationMoodScalar >= .83) {
//                         text = 'Dem Volk geht es Ausgezeichnet';
//                     } else if (populationMoodScalar >= .67) {
//                         text = 'Dem Volk geht es gut';
//                     } else if (populationMoodScalar >= .50) {
//                         text = 'Das Volk hat schlechte Stimmung';
//                     } else if (populationMoodScalar >= .33) {
//                         text = 'Dem Volk geht es nicht gut';
//                     } else if (populationMoodScalar <= .17) {
//                         text = 'Dem Volk geht es schlecht';
//                     }
//                 } else if (population < 1) {
//                     text = '[color=white]! Es gibt kein Volk ![/color]';
//                 } else if (populationMoodScalar >= .83) {
//                     text = '[color=yellow]! Ihrem Volk geht es Ausgezeichnet ![/color]';
//                 } else if (populationMoodScalar >= .67) {
//                     text = '[color=orange]! Ihrem Volk geht es gut ![/color]';
//                 } else if (populationMoodScalar >= .50) {
//                     text = '[color=red]! Ihr Volk hat schlechte Stimmung ![/color]';
//                 } else if (populationMoodScalar >= .33) {
//                     text = '[color=red]! Ihrem Volk geht es nicht gut ![/color]';
//                 } else if (populationMoodScalar <= .17) {
//                     text = '[color=red]! Ihrem Volk geht es schlecht ![/color]';
//                 }
//                 return text;

//             },
//             /**
//              * Ruft den Einwohner-Index ab.
//              * @returns {number}
//              */
//             getCityPopulationIndex: function () {

//                 if (this.get('population') > 25000) {
//                     return 4;
//                 } else if (this.get('population') > 12000) {
//                     return 3;
//                 } else if (this.get('population') > 6000) {
//                     return 2;
//                 } else {
//                     return 1;
//                 }
//             },

//             /**
//              * Einwohner anwerben
//              *
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits
//              * @return {boolean}
//              */
//             populationRecruit: function (value, reduceCredits) {
//                 if (value) {
//                     var last = this.get('populationRecruit');
//                     this.set('populationRecruit', value);
//                     if (reduceCredits || reduceCredits == undefined) {
//                         var credits = this.get('credits');
//                         var cost = this.populationRecruitCost();
//                         if (credits >= cost || last && !value) {
//                             if (value) {
//                                 this.set('credits', credits - cost);
//                             }
//                             else {
//                                 this.set('credits', credits + cost);
//                             }
//                         } else {
//                             return false;
//                         }
//                     }
//                 }
//                 return this.get('populationRecruit');
//             },
//             /**
//              * Ruft die aktuellen Kosten zum anwerben von Einwohnern an.
//              * @return {Number}
//              */
//             populationRecruitCost: function () {
//                 return parseInt(this.get('population') / 10);
//             },

//             /**
//              * Ruft die akutellen Steuer-Kosten an.
//              * @return {Number}
//              */
//             getTaxes: function () {

//                 var foodPercent = this.get('taxesFood') / this.MAX_TAXES;
//                 var energyPercent = this.get('taxesEnergy') / this.MAX_TAXES;
//                 var creditsPercent = -(this.get('taxesCredits') / 100);

//                 console.log(foodPercent, energyPercent, creditsPercent);

//                 return (foodPercent + energyPercent + creditsPercent) / 2;

//             },

//             /**
//              * Ruft den aktuellen Enerieumwandlungs Betrag ab.
//              * @return {Number}
//              */
//             energyTransfer: function () {

//                 if (this.getBuildingsByType(['energy', 'transmitter'], true).length < 1) {
//                     return 0;
//                 }

//                 var energy = this.get('energy') * (this.get('energyTransferVolume') / 100);

//                 return energy >= 1600 ? 1600 : energy;

//             },

//             /**
//              * Fügt der Stadt einen neuen Mitspieler Angriff hinzu.
//              * @param {String} type Type
//              * @param {User} user Mitspieler
//              * @param {Array} buildings Gebaeude-Keys
//              */
//             addUserAttack: function (type, user, buildings) {
//                 var userAttack = this.get('userAttack');
//                 if (!Array.isArray(buildings)) {
//                     buildings = [buildings];
//                 }

//                 if (!userAttack[type][user]) {
//                     userAttack[type][user] = buildings;
//                 } else {
//                     userAttack[type][user] = userAttack[type][user].concat(buildings);
//                 }

//             },
//             /**
//              * Entfernt die Spieler Attacken.
//              */
//             clearUserAttack: function () {
//                 this.set('userAttack', {

//                     cityAttack: {},
//                     factorySabotage: {},
//                     energyTransmitterDestroy: {},
//                     powerStationSabotage: {},
//                     vehicleSabotage: {},
//                     weaponAttack: {}

//                 });

//             },

//             /**
//              * Fügt der Stadt einen neue Spieler Sabotage hinzu.
//              * @param {User} user Spieler-ID
//              * @param {Array} buildings Gebaeude-Keys
//              */
//             addUserSabotage: function (user, buildings) {

//                 var userSabotage = this.get('userSabotage');

//                 if (!Array.isArray(buildings))
//                     buildings = [buildings];

//                 if (!userSabotage[user.get('id')])
//                     userSabotage[user.get('id')] = buildings;
//                 else
//                     userSabotage[user.get('id')].concat(buildings);

//             }
//             ,
//             /**
//              * Entfernt die Spieler Sabotagen.
//              */
//             removeUserSabotage: function () {
//                 this.set('userSabotage', []);
//             }
//             ,

//             /**
//              * Überprüft ob die Stadt einen Spion vom angegebenen Spieler hat.
//              * @param {User} user Spieler
//              * @return Boolean
//              */
//             hasSpy: function (user) {

//                 return this.get('userSpies').indexOf(user.get('id')) > -1;

//             }
//             ,

//             /**
//              * Fügt der Stadt einen neuen Spieler Spion hinzu
//              *
//              * @param {User} user Spieler
//              */
//             addUserSpy: function (user) {

//                 this.get('userSpies').push(user.get('id'));

//             }
//             ,
//             /**
//              * Entfernt die Spieler Spione.
//              */
//             removeUserSpies: function () {
//                 this.set('userSpies', []);
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Erz ab.
//              * @returns {number}
//              */
//             getMaxOre: function () {
//                 var buildings = this.get('buildings').findTypes(['ore', 'storage'], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     units += building.get('storage').ore;
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Nahrung ab.
//              * @return {number}
//              */
//             getMaxFood: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'food'], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     units += building.get('storage').food;
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Bevlökerung.
//              * @return {number}
//              */
//             getMaxPopulation: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'population',], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     units += building.get('storage').population;
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Sicherheitsleute ab.
//              * @return {Number}
//              */
//             getMaxSecurity: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'secruity',], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     if (building.get('storage').secruitySoldierMercenary != undefined) {
//                         units += building.get('storage').secruitySoldierMercenary;
//                     }
//                     if (building.get('storage').secruity != undefined) {
//                         units += building.get('storage').secruity;
//                     }
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Soldaten ab.
//              * @return {Number}
//              */
//             getMaxSoldiers: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'soldiers',], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     if (building.get('storage').secruitySoldierMercenary != undefined) {
//                         units += building.get('storage').secruitySoldierMercenary;
//                     }
//                     if (building.get('storage').soldier != undefined) {
//                         units += building.get('storage').soldier;
//                     }
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Söldner ab.
//              * @return {Number}
//              */
//             getMaxMercenary: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'mercenary',], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     if (building.get('storage').secruitySoldierMercenary != undefined) {
//                         units += building.get('storage').secruitySoldierMercenary;
//                     }
//                     if (building.get('storage').mercenary != undefined) {
//                         units += building.get('storage').mercenary;
//                     }
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Ruft die max. Anzahl an Energiezellen ab.
//              * @return {Number}
//              */
//             getMaxEnergyCell: function () {
//                 var buildings = this.get('buildings').findTypes(['storage', 'energyCell',], true);
//                 var units = 0;
//                 buildings.forEach(function (building) {
//                     units += building.get('storage').energyCell || 0
//                 });
//                 return units;
//             }
//             ,

//             /**
//              * Rekrutiert Sicherheitsleute
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             securityRecruit: function (value, reduceCredits) {
//                 var last = this.get('securityRecruit');
//                 this.set('securityRecruit', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.securityRecruitCost();
//                     if (credits >= cost || last && !value) {

//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Rekrutiert Soldaten
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             soldiersRecruit: function (value, reduceCredits) {
//                 var last = this.get('soldiersRecruit');
//                 this.set('soldiersRecruit', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.soldiersRecruitCost();
//                     if (credits >= cost || last && !value) {

//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Rekrutiert Söldner
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             mercenaryRecruit: function (value, reduceCredits) {
//                 var last = this.get('mercenaryRecruit');
//                 this.set('mercenaryRecruit', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.mercenaryRecruitCost();
//                     if (credits >= cost || last && !value) {

//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Erhöht die ausgebildeten Sicherheitsleute
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             securityTraining: function (value, reduceCredits) {
//                 var last = this.get('securityTraining');
//                 this.set('securityTraining', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.securityTrainingCost();
//                     if (credits >= cost || last && !value) {

//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Erhöht die ausgebildeten Soldaten
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             soldiersTraining: function (value, reduceCredits) {
//                 var last = this.get('soldiersTraining');
//                 this.set('soldiersTraining', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.soldiersTrainingCost();
//                     if (credits >= cost || last && !value) {
//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Erhöht die ausgebildeten Söldner
//              * @param {boolean} value Legt fest ob Rekrutiert wird.
//              * @param {boolean} reduceCredits Abziehen der nötigen Credits.
//              * @return {boolean}
//              */
//             mercenaryTraining: function (value, reduceCredits) {
//                 var last = this.get('mercenaryTraining');
//                 this.set('mercenaryTraining', value);
//                 if (!!reduceCredits) {
//                     var credits = this.get('credits');
//                     var cost = this.mercenaryTrainingCost();
//                     if (credits >= cost || last && !value) {
//                         if (value) {
//                             this.set('credits', credits - cost);
//                         } else {
//                             this.set('credits', credits + cost);
//                         }
//                         return true
//                     }
//                     return false;
//                 }
//             }
//             ,

//             /**
//              * Ruft die Rekrutierungskosten für die Sicherheitsleute ab.
//              * @return {Number}
//              */
//             securityRecruitCost: function () {
//                 return 710;
//             }
//             ,

//             /**
//              * Ruft die Rekrutierungskosten für die Soldaten ab.
//              * @return {Number}
//              */
//             soldiersRecruitCost: function () {
//                 return 950;
//             }
//             ,

//             /**
//              * Ruft die Rekrutierungskosten für die Söldner ab.
//              * @return {Number}
//              */
//             mercenaryRecruitCost: function () {
//                 return 1180;
//             }
//             ,

//             /**
//              * Ruft die Level-Kosten für die Sicherheitsleute ab.
//              * @return {Number}
//              */
//             securityTrainingCost: function () {
//                 return 700;
//             }
//             ,

//             /**
//              * Ruft die Level-Kosten für die Soldaten ab.
//              * @return {Number}
//              */
//             soldiersTrainingCost: function () {
//                 return 810;
//             }
//             ,

//             /**
//              * Ruft die Level-Kosten für die Söldner ab.
//              * @return {Number}
//              */
//             mercenaryTrainingCost: function () {
//                 return 1080;
//             }
//             ,

//             /**
//              * Beschädigt das angegebene Fahrzeug.
//              *
//              * @param {Vehicle} vehicle Fahrzeug
//              * @param {Number} damage
//              * @return {Vehicle}
//              */
//             damageVehicle: function (vehicle, damage) {

//                 vehicle.set('plating', vehicle.get('plating') - damage);
//                 return vehicle;
//             }
//             ,

//             /**
//              * Sabotiert den angegebenen Sucher.
//              * @param {Vehicle} vehicle Sucher.
//              * @return {Vehicle}
//              */
//             sabotageVehicle: function (vehicle) {
//                 vehicle.set('plating', vehicle.get('plating') * (utils.randomNumber(25, 99) / 100));
//                 return vehicle;
//             },

//             /**
//              * Entfernt alle Sucher Angriffe.
//              */
//             clearVehicleAttacks: function () {
//                 this.set('vehicleAttack', {});
//             }
//             ,

//             /**
//              * Fügt einen neuen Sucher anrgiff hinzu.
//              * @param {String} weapon Sucher-Waffe
//              * @param {Number} targetUserId Ziel User
//              * @param {String} vehicleKey Sucher-Key
//              */
//             addVehicleAttack: function (vehicleIndex, targetUserId, vehicleKey, damage) {

//                 var vehicleAttacks = this.get('vehicleAttacks');

//                 if (vehicleAttacks[vehicleIndex] == null) {
//                     vehicleAttacks[vehicleIndex] = [];
//                 }
//                 var attacks = vehicleAttacks[vehicleIndex];
//                 var exist = false
//                 attacks.forEach(function (attack) {
//                     if (attack.targetUserId == targetUserId) {
//                         exist = true;
//                     }
//                 });
//                 if (!exist) {
//                     attacks.push({key: vehicleKey, targetUserId: targetUserId, damage: damage});
//                 }

//             }

//         });

//         function onAddItem(model, value) {
//             var models = value.models;
//             models.forEach(function (model) {
//                 model.set('city', this);
//             });
//         }

//         function onRemoveItem(model, value) {
//             if (value.get('destroyed')) {
//             }
//         }

//     })
// ;
