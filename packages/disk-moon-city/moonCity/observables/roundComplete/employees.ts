import { concat, concatMap, defer, EMPTY, filter, from, of } from 'rxjs';
import { EMPLOYEE_TYPE, LINE_GROUP, STORAGE_TYPE } from '../../types';
import { fillTextEnd } from '../../utils/string';
import useI18n from '../../composables/useI18n';
import type Player from '../../classes/Player';
import type City from '../../classes/City';
import type CityEmployee from '../../classes/CityEmployee';

const { t } = useI18n();

export const employees = function (player: Player) {
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

const process = (
  city: City,
  employee: CityEmployee,
  status: {
    [key in EMPLOYEE_TYPE]: boolean;
  }
) => {
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
      const incoming = employee.getIncomingRecruits();

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
