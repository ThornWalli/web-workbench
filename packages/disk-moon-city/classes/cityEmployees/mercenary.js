import { EMPLOYEE_TYPE } from '../../utils/keys';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';

export default class Mercenary extends CityEmployee {
  constructor(...args) {
    super({
      type: EMPLOYEE_TYPE.MERCENARY,
      recruitmentCosts: 970,
      trainingCosts: 720,
      ...(args || {})
    });
  }

  getIncomingRecruits() {
    return getRandom(40, getRandom(10, 3));
  }
}
