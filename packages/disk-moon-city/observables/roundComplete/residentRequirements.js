import { map, of } from 'rxjs';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { STORAGE_TYPE } from '../../utils/keys.js';
// import useI18n from '../../composables/useI18n.js';

// const { t } = useI18n();

/**
 * Verarbeitet die Anforderungen der Einwohner.
 * @param {import('../../classes/Player.js').default} player
 */
export default function residentRequirements(player) {
  return of(player.city).pipe(
    map(city => {
      const lines = [];

      const status = { food: false };

      const min = city.getPopulationFood();
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
        status.food = true;
        lines.push({
          color: 'blue',
          content: 'Nahrungsüberschuss wird gelagert !'
        });
      }

      if (!status.food) {
        lines.push({
          color: 'red',
          content: 'Ihr Volk hungert!'
        });
        // TODO: Stimmung senken
      }

      if (!Object.values(status).includes(false)) {
        lines.push({
          color: 'orange',
          content: '! Ihrem Volk geht es ausgezeichnet !'
        });
      }

      return {
        group: LINE_GROUP.GENERAL,
        lines
      };
    })
  );
}
