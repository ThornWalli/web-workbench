import { EMPLOYEE_TYPE } from '../../types';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';
import type { CityEmployeeOptions } from '../CityEmployee';

export const MAX_INCOMING_RECRUITS = 40;

/**
 * Die Anzahl an Söldner die mindestens benötigt wird um zu sabotieren.
 * Wird auch verwendet um die Anzahl an Gebäuden zu ermitteln die sabotiert werden.
 * Desto mehr Söldner desto mehr Gebäude können sabotiert werden.
 * Beispiel: 10 Söldner = 1 Gebäude
 *
 * TODO: Könnte nochmal überarbeitet werden.
 * @type {Number}
 */
export const MIN_USAGE_VALUE = 10;
export const MAX_USAGE_VALUE = 40;

export default class Mercenary extends CityEmployee {
  constructor(options: Partial<CityEmployeeOptions> = {}) {
    super({
      type: EMPLOYEE_TYPE.MERCENARY,
      recruitmentCosts: 970,
      trainingCosts: 720,
      ...(options || {})
    });
  }

  override getIncomingRecruits() {
    return getRandom(MAX_INCOMING_RECRUITS, getRandom(10, 3));
  }
}
