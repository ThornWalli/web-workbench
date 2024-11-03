import { BUILDING_KEY, BUILDING_TYPE, STORAGE_TYPE } from '../../utils/keys';
import Storage from './Storage';

export default class House extends Storage {
  constructor() {
    super({
      type: [BUILDING_TYPE.STORAGE],
      key: BUILDING_KEY.HOUSE,
      storageTypes: [STORAGE_TYPE.HUMANS],
      price: 220,
      roundCost: {
        [STORAGE_TYPE.ENERGY]: 0
      },
      storage: 400,
      roundProductionAction: function () {
        // var city = this.city();
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
    });
  }
}
