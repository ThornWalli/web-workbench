import { EMPLOYEE_TYPE } from '../../types';
import { getRandom } from '../../utils/number';
import CityEmployee from '../CityEmployee';
import type { CityEmployeeOptions } from '../CityEmployee';

export const MAX_INCOMING_RECRUITS = 40;
export const MAX_USAGE_VALUE = 40;

export default class ServiceSecurity extends CityEmployee {
  constructor(options: Partial<CityEmployeeOptions> = {}) {
    super({
      type: EMPLOYEE_TYPE.SECURITY_SERVICE,
      recruitmentCosts: 590,
      trainingCosts: 460,
      ...(options || {})
    });
  }

  override getIncomingRecruits() {
    return getRandom(MAX_INCOMING_RECRUITS, getRandom(10, 3));
  }
}
