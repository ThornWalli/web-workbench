import { map, of } from 'rxjs';
import { STORAGE_TYPE } from '../../utils/keys.js';
import { LINE_GROUP } from '../../classes/RoundComplete.js';

/**
 * Verarbeitet die Rekrutierung von Einwohnern.
 * @param {import('../../classes/Player.js').default} player
 */
export default function cityRecruitResidents(player) {
  const lines = [];

  return of(player.city).pipe(
    map(city => {
      if (city.recruitResidents) {
        // var storageDifference = maxStorage - player.city.population;
        var value = 300 + Math.round(Math.random() * 300);

        /*
         * if (storageDifference < 500) value =
         * randomNumber(0,storageDifference);
         */
        if (value > 0) {
          city.addStorageValue(STORAGE_TYPE.HUMANS, value, true);
        }
        city.recruitResidents = false;

        lines.push({
          group: LINE_GROUP.GENERAL,
          color: 'green',
          content: `Es kamen ${value} Einwanderer in die Stadt.`
        });
      }

      const maxPopulation = city.getMaxStorageValue(STORAGE_TYPE.HUMANS);
      if (city.population > maxPopulation) {
        // TODO: Stimmung sinken lassen.
        lines.push({
          color: 'red',
          content: 'Sie haben nicht genug Wohnraum !'
        });
      }

      return {
        group: LINE_GROUP.GENERAL,
        lines
      };
    })
  );
}
