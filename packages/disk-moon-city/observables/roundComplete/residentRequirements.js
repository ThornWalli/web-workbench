import { of } from 'rxjs';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { STORAGE_TYPE } from '../../utils/keys.js';
// import useI18n from '../../composables/useI18n.js';

// const { t } = useI18n();

/**
 * Verarbeitet die Anforderungen der Einwohner.
 * @param {import('../../classes/Player.js').default} player
 */
export default function residentRequirements(player) {
  const lines = [];

  const status = { food: false };

  const min = player.city.getPopulationFood();
  const diff = player.city.getStorageValue(STORAGE_TYPE.FOOD) - min;
  if (diff < 0) {
    lines.push(
      {
        color: 'red',
        content: 'Nahrungs-Lager sind Leer !'
      },

      {
        color: 'red',
        content: `${Math.round(Math.abs(diff / player.city.distributionFood / player.city.population) * 100)}% Ihrer Leute Hungern !`
      }
    );
  } else {
    status.food = true;
  }

  if (!status.food) {
    lines.push({
      color: 'red',
      content: 'Ihr Volk hungert!'
    });
    // TODO: Stimmung senken
  }

  return of({
    group: LINE_GROUP.GENERAL,
    lines
  });
}
