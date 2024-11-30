import { EMPLOYEE_TYPE } from '../../utils/keys';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';

export const MAX_INCOMING_RECRUITS = 40;
export const MIN_USAGE_VALUE = 10;
export const MAX_USAGE_VALUE = 40;

export default class Soldier extends CityEmployee {
  constructor(options = {}) {
    super({
      type: EMPLOYEE_TYPE.SOLDIER,
      recruitmentCosts: 800,
      trainingCosts: 540,
      ...options
    });
  }

  getIncomingRecruits() {
    return getRandom(MAX_INCOMING_RECRUITS, getRandom(10, 3));
  }
}
