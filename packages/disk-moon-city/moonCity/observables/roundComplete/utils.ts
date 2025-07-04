import { autoEllipsis } from '../../utils/string';
import useI18n from '../../composables/useI18n';
import type { Observable } from 'rxjs';
import { concatMap, filter, from, map, reduce, toArray } from 'rxjs';
import Vehicle from '../../classes/Vehicle';
import type { ConsoleGroupLines, Result } from './types';
import type Model from '../../classes/Model';
import type City from '../../classes/City';
import type Building from '../../classes/Building';
import { LINE_GROUP } from '../../types';
import type { STORAGE_TYPE } from '../../types';

const { t } = useI18n();

export const PROCESS_COST_TYPE = {
  BUILDING: 'building',
  VEHICLE: 'vehicle'
};

const mergeResult = (
  resultA: {
    [key: string]: number;
  },
  resultB: {
    [key: string]: number;
  }
) => {
  return Object.fromEntries(
    Object.entries(resultB).map(([key, value]) => [
      key,
      (resultA[String(key)] === undefined ? 0 : resultA[String(key)]) + value
    ])
  );
};

export const processComplete = () => (source: Observable<Result>) =>
  source.pipe(
    reduce<Result, Result>(
      (result, data) => ({
        ratio: data.ratio || result.ratio,
        costsResult: mergeResult(result.costsResult, data.costsResult),
        productionResult: mergeResult(
          result.productionResult,
          data.productionResult
        ),
        costsResultRatio: mergeResult(
          result.costsResultRatio,
          data.costsResultRatio
        ),
        totalCosts: mergeResult(result.totalCosts, data.totalCosts),

        status: {
          costs: data.status.costs || result.status.costs,
          full: data.status.full || result.status.full
        },
        groups: [...result.groups, ...data.groups]
      }),
      {
        ratio: 1,
        costsResult: {},
        productionResult: {},

        costsResultRatio: {},
        totalCosts: {},

        status: {
          costs: true,
          full: false
        },
        groups: []
      }
    )
  );

export const prepareLines = () => (source: Observable<ConsoleGroupLines>) =>
  source.pipe(
    toArray(),
    concatMap(lists => from(lists.flat()))
  );

function getType(model: Model) {
  if (model instanceof Vehicle) {
    return PROCESS_COST_TYPE.VEHICLE;
  }
  return PROCESS_COST_TYPE.BUILDING;
}
interface ProcessCostsOptions {
  partiallyProduce?: boolean;
  ignoreCostsMessage?: boolean;
  ignoreStorageMessage?: boolean;
}
/**
 * @param {import('../../classes/City').default} city
 * @param {PROCESS_COSTS_OPTIONS} options
 */
export const processCosts = (city: City, options = {}) => {
  const {
    partiallyProduce,
    ignoreCostsMessage,
    ignoreStorageMessage
  }: ProcessCostsOptions = {
    partiallyProduce: true,
    ignoreCostsMessage: false,
    ignoreStorageMessage: false,
    ...options
  };
  return (source: Observable<Building>) =>
    source.pipe(
      map(
        /**
         * @param {import('../../classes/Building').default} model
         */
        model => {
          const type = getType(model);

          // Wenn sabotiert, dann nicht produzieren.
          if (model.sabotaged) {
            model.sabotaged = false;
            return;
          }

          const status = {
            costs: true,
            full: false
          };
          const groups = [];
          const missingCost = Object.entries(model.roundCost).find(
            ([type, value]) => {
              return city.getStorageValue(type as STORAGE_TYPE) - value < 0;
            }
          );
          if (missingCost) {
            status.costs = false;
            if (!ignoreCostsMessage) {
              groups.push({
                key: 'round_cost_' + type,
                group: LINE_GROUP.GENERAL,
                lines: [
                  [
                    {
                      color: 'red',
                      content: 'Kosten für '
                    },
                    {
                      color: 'white',
                      content: autoEllipsis(t(`${type}.${model.key}.name`), 12)
                    },
                    {
                      color: 'red',
                      content: ` nicht gedeckt !`
                    }
                  ]
                ]
              });
            }
          }

          // Costs Differece
          const costsDiffs = Object.entries(model.roundCost).reduce<{
            [key: string]: number;
          }>((result, [type, value]) => {
            result[type] = Math.min(
              city.getStorageValue(type as STORAGE_TYPE) / value,
              1
            );
            return result;
          }, {});

          // Costs Result
          const costsResult = Object.entries(model.roundCost).reduce<{
            [key: string]: number;
          }>((result, [type, value]) => {
            result[type] = Math.max(
              value - city.getFreeStorageValue(type as STORAGE_TYPE),
              0
            );
            return result;
          }, {});

          const costsResultRatio = Object.entries(model.roundCost).reduce<{
            [key: string]: number;
          }>((result, [type, value]) => {
            console.log({
              type,
              value,
              v: city.getStorageValue(type as STORAGE_TYPE)
            });
            result[String(type)] = Math.min(
              city.getStorageValue(type as STORAGE_TYPE) / value,
              1
            );
            return result;
          }, {});

          const totalCosts: {
            [key: string]: number;
          } = {};
          // Subtract costs
          Object.entries(model.roundCost).forEach(([type, value]) => {
            city.subtractStorageValue(type as STORAGE_TYPE, value);

            totalCosts[type] =
              (totalCosts[type] || 0) +
              Math.min(city.getFreeStorageValue(type as STORAGE_TYPE), value);
          });

          // Berechnen wieviel produziert werden kann. Durschnitt aller verfügbaren Kosten.
          const ratio =
            Object.values(costsDiffs).reduce((a, b) => a + b, 0) /
            Object.values(costsDiffs).length;

          model.roundProductionRatio = ratio;

          let productionResult = {};
          if (partiallyProduce || ratio === 1) {
            // resolve production
            productionResult = Object.entries(model.roundProduction).reduce<{
              [key: string]: number;
            }>((result, [type, value]) => {
              value *= ratio;
              if (city.isMaxStorageValue(type as STORAGE_TYPE, value)) {
                if (!ignoreStorageMessage) {
                  groups.push({
                    key: 'round_production_' + type,
                    group: LINE_GROUP.GENERAL,
                    lines: [
                      [
                        {
                          color: 'yellow',
                          content: 'Lager für '
                        },
                        {
                          color: 'white',
                          content: autoEllipsis(t(`resource.${type}.name`), 18)
                        },
                        {
                          color: 'yellow',
                          content: ` ist voll !`
                        }
                      ]
                    ]
                  });
                }

                status.full = true;
              }

              result[type] = Math.min(
                value,
                city.getFreeStorageValue(type as STORAGE_TYPE)
              );
              city.setStorageValue(
                type as STORAGE_TYPE,
                city.getStorageValue(type as STORAGE_TYPE) + value
              );
              return result;
            }, {});
          }
          return {
            ratio,
            totalCosts,
            costsResultRatio,
            costsResult,
            productionResult,
            model,
            status,
            groups
          };
        }
      ),
      filter(Boolean)
    );
};
