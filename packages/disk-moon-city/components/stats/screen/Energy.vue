<template>
  <mc-screen class="mc-stats-screen-current-log">
    <mc-graph v-bind="data" />
  </mc-screen>
</template>

<script setup>
import { computed } from 'vue';
import McScreen from '../../Screen.vue';
import McGraph from '../../Graph.vue';
import useCore from '../../../composables/useCore';
import {
  COLOR_GRAPH,
  COLOR_VALUE_GRAPH_FILL,
  COLOR_VALUE_GRAPH_STROKE
} from '../../../utils/color';
import { STORAGE_TYPE } from '../../../utils/keys';

const { core } = useCore();

const data = computed(() => {
  const { labels, storage, needed, production } = core.currentPlayer.roundLogs
    .slice(-5)
    .reduce(
      (result, log) => {
        result.labels.push(log.index);
        result.needed.values.push(log.player.city.getPopulationEnergy());
        result.production.values.push(
          log.player.city.getProductionValue(STORAGE_TYPE.ENERGY)
        );
        result.storage.values.push(
          log.player.city.getMaxStorageValue(STORAGE_TYPE.ENERGY)
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
  labels.push(core.round);
  needed.values.push(core.currentPlayer.city.getPopulationEnergy());
  production.values.push(
    core.currentPlayer.city.getProductionValue(STORAGE_TYPE.ENERGY)
  );
  storage.values.push(
    core.currentPlayer.city.getMaxStorageValue(STORAGE_TYPE.ENERGY)
  );
  return { labels, values: [storage, production, needed] };
});
</script>
