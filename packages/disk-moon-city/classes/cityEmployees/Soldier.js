import { EMPLOYEE_TYPE } from '../../utils/keys';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';

export default class Soldier extends CityEmployee {
  constructor(...args) {
    super({
      type: EMPLOYEE_TYPE.SOLDIER,
      recruitmentCosts: 800,
      trainingCosts: 540,
      ...(args || {})
    });
  }

  getIncomingRecruits() {
    return getRandom(40, getRandom(10, 3));
  }
}
