<template>
  <mc-screen class="mc-stats-screen-current-log">
    <mc-graph v-bind="data" />
  </mc-screen>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McGraph from '../../Graph.vue';
import useCore from '../../../composables/useCore';
import {
  COLOR_GRAPH,
  COLOR_VALUE_GRAPH_FILL,
  COLOR_VALUE_GRAPH_STROKE
} from '../../../utils/color';
import { RESOURCE_TYPE, STORAGE_TYPE } from '../../../types';

const { core } = useCore();

const data = computed(() => {
  if (!core.currentPlayer) {
    return {
      labels: [],
      values: []
    };
  }
  const { labels, storage, needed, production } = core.currentPlayer.roundLogs
    .slice(-5)
    .reduce<{
      labels: string[];
      needed: {
        style: { fill: string; stroke: string };
        values: number[];
      };
      production: {
        style: { fill: string; stroke: string };
        values: number[];
      };
      storage: {
        style: { fill: string; stroke: string };
        values: number[];
      };
    }>(
      (result, log) => {
        result.labels.push(String(log.index));
        result.needed.values.push(log.player.city.populationEnergy);
        result.production.values.push(
          log.player.city.productionValue[RESOURCE_TYPE.ENERGY] || 0
        );
        result.storage.values.push(
          log.player.city.maxProductionValue[STORAGE_TYPE.ENERGY] || 0
        );
        return result;
      },
      {
        labels: [],
        needed: {
          style: {
            fill: COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.RED],
            stroke: COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.RED]
          },
          values: []
        },
        production: {
          style: {
            fill: COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.YELLOW],
            stroke: COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.YELLOW]
          },
          values: []
        },
        storage: {
          style: {
            fill: COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.GRAY],
            stroke: COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.GRAY]
          },
          values: []
        }
      }
    );
  labels.push(String(core.round));
  needed.values.push(core.currentPlayer.city.getPopulationEnergy());
  production.values.push(
    core.currentPlayer.city.getProductionValue(RESOURCE_TYPE.ENERGY)
  );
  storage.values.push(
    core.currentPlayer.city.getMaxStorageValue(STORAGE_TYPE.ENERGY)
  );
  return { labels, values: [storage, production, needed] };
});
</script>
