import { EMPLOYEE_TYPE } from '../../utils/keys';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';

export default class ServiceSecurity extends CityEmployee {
  constructor(...args) {
    super({
      type: EMPLOYEE_TYPE.SECURITY_SERVICE,
      recruitmentCosts: 590,
      trainingCosts: 460,
      ...(args || {})
    });
  }

  getIncomingRecruits() {
    return getRandom(40, getRandom(10, 3));
  }
}
