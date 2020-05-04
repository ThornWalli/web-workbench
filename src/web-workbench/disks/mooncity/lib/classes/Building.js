export default class Building {
  type = null;
  key = null;
  name = null;
  description = null;
  cost = null;
  properties = null;
  roundCost = null;
  roundProduction = null;
  roundProductionAction = null;
  storage = {};

  getCity () {
    return undefined;
  }
}

const BUILDINGS = {
  ORE_STORAGE: 'ore_storage',
  REFINERY: 'refinery',
  POWER_STATION: 'power_station',
  ENERGY_TRANSMITTER: 'energy_transmitter',
  HOUSE: 'house',
  GREEN_HOUSE: 'green_house',
  FOOD_STORAGE: 'food_storage',
  VEHICLE_FACTORY: 'vehicle_factory',
  BARRACKS: 'barracks',
  WEAPON_FACTORY: 'weapon_factory',
  BUNKER: 'bunker',
  SHIELD_GENERATOR: 'shield_generator'
};

export const BUILDING_TYPES = {
  RESSOURCE: 'ressource',
  ORE: 'ore',
  STORAGE: 'storage',
  POWER_STATION: 'power_station',
  ENERGY_CELL: 'energy_cell',
  COMMERCE: 'commerce',
  POPULATION: 'population',
  FOOD: 'food',
  INDUSTRIAL: 'industrial',
  VEHICLE: 'vehicle',
  PRODUCTION: 'production',
  FACTORY: 'factory',
  SECRUITY: 'secruity',
  SOLDIERS: 'soldiers',
  MERCENARY: 'mercenary',
  BUNKER: 'bunker',
  SHIELD: 'shield'
};

export const buildings = {

  [BUILDINGS.ORE_STORAGE]: {
    type: [
      'ressource', 'ore', 'storage'
    ],
    key: BUILDINGS.ORE_STORAGE,
    name: 'Erzlager',
    description: 'Fuer Maximal 1600E Einheinten',
    cost: 920,
    roundCost: {
      energy: 0
    },
    storage: {

      ore: 1600

    }
  },

  [BUILDINGS.ORE_STORAGE]: {
    type: [
      'ressource', 'refinery', 'storage', 'ore', 'energyCell'
    ],
    key: 'refinery',
    name: 'Raffinerie',
    description: [
      'Wandelt (400E) Erze in Energiezellen um', 'Lagert Maximal 400E Energiezellen ein', 'Lagert Maximal 400E Erz ein'
    ],
    cost: 520,
    roundCost: {
      energy: 0,
      ore: 400
    },
    storage: {
      energyCell: 400,
      ore: 400
    },
    roundProduction: {
      energyCell: 400
    },
    roundProductionAction (consoleLines) {
      const city = this.city;
      const value = city.ore >= 400 ? 400 : city.ore;
      if (city.getMaxEnergyCell() < city.energyCell + value) {
        city.energyCell = city.getMaxEnergyCell();
        consoleLines.addLine('warning', '[color=red]Sie haben nicht genug Energiezellenlager[/color]');
      } else {
        city.ore = city.ore - value;
        city.energyCell = city.energyCell() + value;
      }
    }
  },

  [BUILDINGS.POWER_STATION]: {
    type: [
      'ressource', 'powerStation', 'storage', 'energyCell'
    ],
    key: BUILDINGS.POWER_STATION,
    name: 'Kraftwerk',
    description: [
      'Setzt (800E) Energiezellen in Strom um', 'Lagert Maximal 1600E Energiezellen ein'
    ],
    cost: 720,
    roundCost: {
      energy: 0,
      energyCell: 800
    },
    storage: {
      energyCell: 800
    },
    roundProduction: {
      energy: 1600
    },
    roundProductionAction () {
      const city = this.city;
      let value = city.energyCell >= 800 ? 800 : city.energyCell;
      value *= (city.energyCellPowerStationVolume / 100);

      city.energyCell = city.energyCell - value;

      // Energiezelle : Strom - 1 : 2
      city.energy = city.energy + value * 2;
    }

  },

  [BUILDINGS.ENERGY_TRANSMITTER]: {
    type: [
      'ressource', 'commerce', 'energy', 'transmitter'
    ],
    key: BUILDINGS.ENERGY_TRANSMITTER,
    name: 'Energiesender',
    description: 'Sendet 1600E Strom zur Erde',
    cost: 3220,
    roundCost: {
      energy: 1600
    },
    roundProduction: {
      credits: 1600
    },
    roundProductionAction (consoleLines) {
      const city = this.city;
      const value = city.getCurrentEnergyTransfer();
      city.credits = city.credits + value;
      city.energy = city.energy - value;
      city.energySales = city.energySales + value;
      return value;
    }
  },

  [BUILDINGS.HOUSE]: {
    type: [
      'storage', 'population'
    ],
    key: BUILDINGS.HOUSE,
    name: 'Haus',
    description: [
      'Apartments fuer 400 Einheiten'
    ],
    cost: 220,
    roundCost: {
      energy: 0
    },
    storage: {
      population: 400
    },
    roundProductionAction (consoleLines) {
      // const city = this.city;

      /*
                  * var noFood = 0; var noEnergy = 0;
                  *
                  * var food = city.food(); var energy = city.energy();
                  *
                  * if (food < 4000) {
                  *
                  * noFood += 4000/food; } else food -= 4000;
                  *
                  * if (energy < 0) {
                  *
                  * noEnergy += 0/energy; } else energy -= 0;
                  *
                  * return {
                  *
                  * 'food' : noFood, 'energy' : noEnergy, };
                  */

      /*
                  *
                  * var value = city.food() + 8000; if (city.maxFood() == city.food()) { value = 0;
                  * consoleLines.addLine('warning', '[color=red]Keine Lager - Nahrung verkommt![/color]'); } if
                  * (city.maxFood() <= value) { value = city.maxFood(); consoleLines.addLine('clue','[color=yellow]Nicht
                  * genug Nahrungs-Lager ![/color]'); } else if (value < city.maxFood())
                  * consoleLines.addLine('clue','[color=blue]Nahrungsueberschuss wird gelagert ![/color]');
                  *
                  * city.food(value);
                  */
    }
  },

  [BUILDINGS.GREEN_HOUSE]: {
    type: [
      'ressource', 'production', 'food', 'storage'
    ],
    key: BUILDINGS.GREEN_HOUSE,
    name: 'Gewaechshaus',
    description: 'Produziert 8000E Nahrung fuer Einwohner',
    cost: 320,
    storage: {
      food: 16000
    },
    roundCost: {
      energy: 0
    },
    roundProduction: {
      food: 8000
    },
    roundProductionAction (consoleLines) {
      const city = this.city;

      let value = city.food + 8000;
      const value_ = value;
      const maxFood = city.getMaxFood();
      if (maxFood === city.food) {
        value = maxFood;
        consoleLines.addLine('warning', '[color=red]Keine Lager - Nahrung verkommt![/color]');
      }

      if (maxFood <= value) {
        value = maxFood;
      }

      city.food = value;

      return value_;
    }
  },

  [BUILDINGS.FOOD_STORAGE]: {
    type: [
      'ressource', 'storage', 'food'
    ],
    key: BUILDINGS.FOOD_STORAGE,
    name: 'Nahrungslager',
    description: 'Fuer Maximal 16000E Einheinten',
    cost: 920,
    roundCost: {
      energy: 0
    },
    storage: {
      food: 16000
    }
  },
  [BUILDINGS.VEHICLE_FACTORY]: {
    type: [
      'industrial', 'vehicle', 'production', 'factory'
    ],
    key: BUILDINGS.VEHICLE_FACTORY,
    name: 'Sucherfabrik',
    description: 'Hier werden Sucher produziert',
    cost: 570,
    roundCost: {
      energy: 0
    }
  },
  [BUILDINGS.BARRACKS]: {
    type: [
      'storage', 'secruity', 'soldiers', 'mercenary'
    ],
    key: BUILDINGS.BARRACKS,
    name: 'Kaserne',
    description: [
      'Fuer 50 Soldaten, Sicherheitsdienst', 'und Soeldner'
    ],
    cost: 620,
    roundCost: {
      energy: 0
    },
    storage: {
      secruitySoldierMercenary: 50
    }
  },
  [BUILDINGS.WEAPON_FACTORY]: {
    type: [
      'industrial', 'weapon', 'production', 'factory'
    ],
    key: BUILDINGS.WEAPON_FACTORY,
    name: 'Waffenfabrik',
    description: 'Hier werden Waffen produziert',
    cost: 1520,
    roundCost: {
      energy: 0
    }
  },
  [BUILDINGS.BUNKER]: {
    type: [
      'weapon', 'vehicle', 'bunker'
    ],
    key: BUILDINGS.BUNKER,
    name: 'Bunker',
    description: 'Schuetzt einen Sucher vor Angriffe',
    cost: 420,
    max_amount: 4,
    properties: {
      vehicle: 1
    },
    roundCost: {
      energy: 0
    }
  },
  [BUILDINGS.SHIELD_GENERATOR]: {
    type: [
      'weapon', 'shield'
    ],
    key: BUILDINGS.SHIELD_GENERATOR,
    name: 'Schildgenerator',
    description: [
      'Schuetzt Stadt', 'Verbraucht 400 Credits und 125 Strom'
    ],
    cost: 4520,
    roundCost: {
      energy: 125,
      credits: 400
    },

    properties: {

      power: 3
      // Die Energie ist relativ zur anzahl an zu
      // zerstörenden Gebaeude
    },
    roundProductionAction (consoleLines) {
      const city = this.city;
      let cityHasCredits = false;
      let cityHasEnergy = false;

      if (city.credits - 400 > 0) {
        cityHasCredits = true;
      }
      if (city.energy - 125 > 0) {
        cityHasEnergy = true;
      }
      if (!cityHasCredits) {
        consoleLines.addLine('warning', '[color=red]Nicht genug Credits fuer Ihre Schilder[/color]');
      }
      if (!cityHasEnergy) {
        consoleLines.addLine('warning', '[color=red]Nicht genug Strom fuer Ihre Schilder[/color]');
      }
      if (cityHasCredits && cityHasEnergy) {
        city.credits = city.credits - 400;
        city.energy = city.energy - 125;
        return 400;
      }

      return false;
    }
  }

};
