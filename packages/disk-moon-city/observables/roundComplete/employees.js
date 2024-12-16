import { concat, concatMap, defer, EMPTY, filter, from, of } from 'rxjs';
import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { EMPLOYEE_TYPE, STORAGE_TYPE } from '../../utils/keys.js';
import { fillTextEnd } from '../../utils/string.js';
import useI18n from '../../composables/useI18n.js';

const { t } = useI18n();

/**
 * @param {import('../../classes/Player.js').default} player
 */
export const employees = function (player) {
  const status = {
    [EMPLOYEE_TYPE.SECURITY_SERVICE]: false,
    [EMPLOYEE_TYPE.SOLDIER]: false,
    [EMPLOYEE_TYPE.MERCENARY]: false
  };
  return of(player.city).pipe(
    concatMap(city => {
      return concat(
        process(city, city.securityService, status),
        process(city, city.soldier, status),
        process(city, city.mercenary, status),
        defer(() => {
          if (!Object.values(status).includes(false)) {
            return of({
              group: LINE_GROUP.GENERAL,
              lines: [
                [
                  {
                    color: 'red',
                    content: t('round_complete.employee.not_enough_barracks')
                  }
                ]
              ]
            });
          }
          return EMPTY;
        })
      ).pipe(filter(Boolean));
    })
  );
};

/**
 * @param {import('../../classes/City.js').default} city
 * @param {import('../../classes/CityEmployee.js').default} employee
 */
const process = (city, employee, status) => {
  return defer(() => {
    const lineGroups = [];

    if (employee.training) {
      employee.executeTraining();

      lineGroups.push({
        key: 'training',
        group: LINE_GROUP.GENERAL,
        lines: [
          [
            {
              color: 'blue',
              content: fillTextEnd(
                t('round_complete.employee.training_complete'),
                39,
                '.'
              )
            }
          ]
        ]
      });
    }

    if (employee.recruiting) {
      const lines = [];
      let incoming = employee.getIncomingRecruits();

      const realIncoming = Math.min(
        incoming,
        city.getFreeStorageValue(STORAGE_TYPE.EMPLOYEE)
      );
      // const hasDiff = city.getDiffStorageValue(STORAGE_TYPE.EMPLOYEE, incoming);
      if (realIncoming > 0) {
        employee.executeRecruiting(realIncoming);
        city.addStorageValue(STORAGE_TYPE.EMPLOYEE, realIncoming);

        lines.push([
          {
            color: 'blue',
            content: t(`round_complete.employee.incoming.${employee.type}`, {
              overrides: { value: realIncoming }
            })
          }
        ]);

        status[employee.type] = true;
      } else {
        employee.abortRecruiting();
        lines.push([
          {
            color: 'blue',
            content: t(`round_complete.employee.not_incoming.${employee.type}`)
          }
        ]);
      }

      lineGroups.push({
        group: LINE_GROUP.GENERAL,
        lines
      });
    }

    return from(lineGroups);
  });
};
