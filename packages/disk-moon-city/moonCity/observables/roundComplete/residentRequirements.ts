import { concat, concatAll, concatMap, map, of } from 'rxjs';
import { LINE_GROUP, STORAGE_TYPE } from '../../types';
import { normalizePercentage } from '../../utils/number';
import { fillTextEnd } from '../../utils/string';
import { DISTRIBUTION_TYPE } from '../../utils/city';
import type Player from '../../classes/Player';
import type { ConsoleGroup, ConsoleLine } from './types';

/**
 * @description Verarbeitet die Anforderungen der Einwohner.
 */
export default function residentRequirements(player: Player) {
  const status = {
    [DISTRIBUTION_TYPE.FOOD]: false,
    [DISTRIBUTION_TYPE.ENERGY]: false,
    [DISTRIBUTION_TYPE.TAXES]: false,
    [DISTRIBUTION_TYPE.HOUSE]: false
  };
  return concat(
    food(player, status),
    taxes(player, status),
    energy(player, status),
    rent(player),
    cityRecruitResidents(player, status),
    of(player.city).pipe(
      concatMap(city => {
        city.resident.executeMood(player.city, status);
        return of({
          group: LINE_GROUP.GENERAL,
          lines: [getMoodText(city.resident.mood)]
        });
      })
    )
  );
}

const getMoodText = (value: number) => {
  if (value < -0.5) {
    return {
      color: 'red',
      content: `Ihrem Volk geht es sehr schlecht !`
    };
  } else if (value < -0.2) {
    return {
      color: 'red',
      content: `Ihrem Volk geht es nicht gut !`
    };
  } else if (value < 0.2) {
    return {
      color: 'yellow',
      content: `Ihrem Volk hat schlechte Stimmung !`
    };
  } else if (value < 0.6) {
    return {
      color: 'green',
      content: `Ihrem Volk geht es gut !`
    };
  } else {
    return {
      color: 'green',
      content: `Ihrem Volk geht es Ausgezeichnet !`
    };
  }
};

/**
 * @description Verarbeitet die Anforderungen der Einwohner.
 */
function food(
  player: Player,
  status: {
    [key in DISTRIBUTION_TYPE]: boolean;
  }
) {
  return of(player.city).pipe(
    map(city => {
      const lines: ConsoleLine[] = [];
      const groups = [
        {
          group: LINE_GROUP.GENERAL,
          lines
        }
      ];

      const min = city.getPopulationFood();

      console.log('min', min);
      const diff = city.getStorageValue(STORAGE_TYPE.FOOD) - min;
      if (diff < 0) {
        lines.push(
          {
            color: 'red',
            content: 'Nahrungs-Lager sind Leer !'
          },

          {
            color: 'red',
            content: `${Math.round(Math.abs(diff / city.distributionFood / city.population) * 100)}% Ihrer Leute Hungern !`
          }
        );
      } else {
        status[DISTRIBUTION_TYPE.FOOD] = true;
        city.subtractStorageValue(STORAGE_TYPE.FOOD, min);
      }

      if (!status.food) {
        lines.push({
          color: 'red',
          content: 'Ihr Volk hungert!'
        });
        // TODO: Stimmung senken
      }

      return groups;
    }),
    concatAll()
  );
}

/**
 * @description Verarbeitet die Energieanforderungen der Einwohner.
 */
function energy(
  player: Player,
  status: {
    [key in DISTRIBUTION_TYPE]: boolean;
  }
) {
  return of(player.city).pipe(
    map(city => {
      const lines: ConsoleLine[] = [];
      const groups: ConsoleGroup[] = [
        {
          group: LINE_GROUP.GENERAL,
          lines
        }
      ];

      let populationEnergy = city.getPopulationEnergy();
      const diff = city.getStorageValue(STORAGE_TYPE.ENERGY) - populationEnergy;
      if (diff < 0) {
        groups.push({
          key: 'not_enough_energy',
          group: LINE_GROUP.GENERAL,
          lines: [
            {
              color: 'red',
              content: 'Nicht genug Strom !'
            }
          ]
        });

        lines.push({
          color: 'red',
          content: `${Math.round(Math.abs(diff / city.distributionEnergy / city.population) * 100)}% Ihrer Leute haben keine Energie !`
        });

        populationEnergy = Math.min(
          populationEnergy,
          city.getStorageValue(STORAGE_TYPE.ENERGY)
        );
      } else {
        status[DISTRIBUTION_TYPE.ENERGY] = true;
      }

      if (populationEnergy > 0) {
        city.subtractStorageValue(STORAGE_TYPE.ENERGY, populationEnergy);

        player.city.credits += populationEnergy;

        groups.push({
          group: LINE_GROUP.INCOME,
          lines: [
            [
              {
                color: 'green',
                content:
                  fillTextEnd('Einnahmen - Stromverbrauch: ', 30, '.') +
                  ` ${populationEnergy}`
              }
            ]
          ]
        });
      }

      return groups;
    }),
    concatAll()
  );
}

function taxes(
  player: Player,
  status: {
    [key in DISTRIBUTION_TYPE]: boolean;
  }
) {
  return of(player.city).pipe(
    map(city => {
      const taxes = Math.round((city.population * city.taxes) / 100);
      player.city.credits += taxes;

      status[DISTRIBUTION_TYPE.TAXES] = true;

      return {
        group: LINE_GROUP.INCOME,
        lines: [
          [
            {
              color: 'green',
              content:
                fillTextEnd('Einnahmen - Steuern: ', 30, '.') + ` ${taxes}`
            }
          ]
        ]
      };
    })
  );
}

function rent(player: Player) {
  return of(player.city).pipe(
    map(city => {
      const rentPrice = 460 / 4000;
      const rent = Math.round(city.population * rentPrice);
      player.city.credits += rent;

      return {
        group: LINE_GROUP.INCOME,
        lines: [
          [
            {
              color: 'green',
              content: fillTextEnd('Einnahmen - Miete: ', 30, '.') + ` ${rent}`
            }
          ]
        ]
      };
    })
  );
}

/**
 * Verarbeitet die Rekrutierung von Einwohnern.
 * @param {import('../../classes/Player').default} player
 */
function cityRecruitResidents(
  player: Player,
  status: {
    [key in DISTRIBUTION_TYPE]: boolean;
  }
) {
  return of(player.city).pipe(
    map(city => {
      const lines: ConsoleLine[] = [];
      const groups = [
        {
          group: LINE_GROUP.GENERAL,
          lines
        }
      ];

      let value = 0;
      if (city.resident.recruiting) {
        // var storageDifference = maxStorage - player.city.population;
        value = city.resident.getIncomingRecruits();

        /*
         * if (storageDifference < 500) value =
         * randomNumber(0,storageDifference);
         */
        if (value > 0) {
          city.addStorageValue(STORAGE_TYPE.HUMAN, value);
        }

        city.resident.executeRecruiting(value);

        lines.push({
          group: LINE_GROUP.GENERAL,
          color: 'green',
          content: `Es kamen ${value} Einwanderer in die Stadt.`
        });
      }

      const difference = normalizePercentage(
        1 -
          city.getMaxStorageValue(STORAGE_TYPE.HUMAN) /
            (city.getMaxStorageValue(STORAGE_TYPE.HUMAN) + value)
      );

      // if (city.getFreeStorageValue(STORAGE_TYPE.HUMAN) === 0) {
      //   // TODO: Stimmung sinken lassen.
      //   lines.push({
      //     color: 'red',
      //     content: 'Sie haben nicht genug Wohnraum !'
      //   });
      // } else

      if (difference > 0) {
        lines.push({
          color: 'red',
          content: difference + '% Ihrer Leute haben keine Wohnung !'
        });
      } else {
        status.house = true;
      }

      // TODO: Wenn zuwenig mood, dann gehen Einwohner.

      return groups;
    }),
    concatAll()
  );
}
// /*
//  * if (city.population() < 1)
//  * consoleLines['clue'].push('[color=gold]! Es gibt kein Volk
//  * ![/color]'); else if (populationMoodScalar >= .9)
//  * consoleLines['clue'].push('[color=gold]! Ihrem Volk geht es
//  * Ausgezeichnet ![/color]'); else if (populationMoodScalar >= .6)
//  * consoleLines['clue'].push('[color=gold]! Ihrem Volk geht es gut
//  * ![/color]'); else if (populationMoodScalar >= .4)
//  * consoleLines['clue'].push('[color=gold]! Ihr Volk hat schlechte
//  * Stimmung ![/color]'); else if (populationMoodScalar >= .2)
//  * consoleLines['clue'].push('[color=gold]! Ihrem Volk geht es nicht
//  * gut ![/color]'); else if (populationMoodScalar <= .0)
//  * consoleLines['clue'].push('[color=gold]! Ihrem Volk geht es
//  * schlecht ![/color]');
//  */

// if (populationMoodScalar <= 0.10) {

// 	// Wenn die Stimmung im Keller ist, verpissen sich Einwohner und
// 	// die Stimmung steigt auf 100%.

// 	var value = randomNumber(200, 500);
// 	if (city.population() < value)
// 		value = city.population();

// 	city.population(city.population() - value);
// 	consoleLines['warning'].push('[color=red]Es gingen: ' + value + ' Einwohner ![/color]');

// }
