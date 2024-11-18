import { LINE_GROUP } from '../../classes/RoundComplete.js';
import { autoEllipsis } from '../../utils/string.js';
import useI18n from '../../composables/useI18n.js';
import { concatMap, from, map, reduce, toArray } from 'rxjs';
import Vehicle from '../../classes/Vehicle.js';

const { t } = useI18n();

export const PROCESS_COST_TYPE = {
  BUILDING: 'building',
  VEHICLE: 'vehicle'
};

const mergeResult = (resultA, resultB) => {
  return Object.fromEntries(
    Object.entries(resultB).map(([key, value]) => [
      key,
      (resultA[String(key)] === undefined ? 0 : resultA[String(key)]) + value
    ])
  );
};

export const processComplete = () => source =>
  source.pipe(
    reduce(
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

export const prepareLines = () => source =>
  source.pipe(
    toArray(),
    concatMap(lists => from(lists.flat()))
  );

function getType(model) {
  if (model instanceof Vehicle) {
    return PROCESS_COST_TYPE.VEHICLE;
  }
  return PROCESS_COST_TYPE.BUILDING;
}

const PROCESS_COSTS_OPTIONS = {
  /**
   * Wenn gesetzt, wird auch produziert, wenn nicht alle Kosten gedeckt sind.
   */
  partiallyProduce: true,
  ignoreCostsMessage: false,
  ignoreStorageMessage: false
};
/**
 * @param {import('../../classes/City.js').default} city
 * @param {PROCESS_COSTS_OPTIONS} options
 */
export const processCosts = (city, options) => {
  const { partiallyProduce, ignoreCostsMessage, ignoreStorageMessage } = {
    ...PROCESS_COSTS_OPTIONS,
    ...options
  };
  return source =>
    source.pipe(
      map(model => {
        const type = getType(model);

        let status = {
          costs: true,
          full: false
        };
        const groups = [];
        const missingCost = Object.entries(model.roundCost).find(
          ([type, value]) => {
            return city.getStorageValue(type) - value < 0;
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
                    content: autoEllipsis(t(`${type}.${model.key}`).name, 12)
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
        const costsDiffs = Object.entries(model.roundCost).reduce(
          (result, [type, value]) => {
            result[String(type)] = Math.min(
              city.getStorageValue(type) / value,
              1
            );
            return result;
          },
          {}
        );

        // Costs Result
        const costsResult = Object.entries(model.roundCost).reduce(
          (result, [type, value]) => {
            result[String(type)] = Math.max(
              value - city.getFreeStorageValue(type),
              0
            );
            return result;
          },
          {}
        );

        const costsResultRatio = Object.entries(model.roundCost).reduce(
          (result, [type, value]) => {
            console.log({ type, value, v: city.getStorageValue(type) });
            result[String(type)] = Math.min(
              city.getStorageValue(type) / value,
              1
            );
            return result;
          },
          {}
        );

        const totalCosts = {};
        // Subtract costs
        Object.entries(model.roundCost).forEach(([type, value]) => {
          city.subtractStorageValue(type, value);

          totalCosts[String(type)] =
            (totalCosts[String(type)] || 0) +
            Math.min(city.getFreeStorageValue(type), value);
        });

        // Berechnen wieviel produziert werden kann. Durschnitt aller verfügbaren Kosten.
        const ratio =
          Object.values(costsDiffs).reduce((a, b) => a + b, 0) /
          Object.values(costsDiffs).length;

        let productionResult = {};
        if (partiallyProduce || ratio === 1) {
          // resolve production
          productionResult = Object.entries(model.roundProduction).reduce(
            (result, [type, value]) => {
              value *= ratio;
              if (city.isMaxStorageValue(type, value)) {
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
                          content: autoEllipsis(t(`resource.${type}`).name, 18)
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

              result[String(type)] = Math.min(
                value,
                city.getFreeStorageValue(type)
              );
              city.setStorageValue(type, city.getStorageValue(type) + value);
              return result;
            },
            {}
          );
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
      })
    );
};
