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
import { STORAGE_TYPE } from '../../../utils/keys';
import {
  COLOR_GRAPH,
  COLOR_VALUE_GRAPH_FILL,
  COLOR_VALUE_GRAPH_STROKE
} from '../../../utils/color';

const { core } = useCore();

const data = computed(() => {
  const { labels, needLine, storageLine } = core.currentPlayer.roundLogs
    .slice(-5)
    .reduce(
      (result, log) => {
        result.labels.push(log.index);
        result.needLine.values.push(log.player.city.population);
        result.storageLine.values.push(
          log.player.city.getMaxStorageValue(STORAGE_TYPE.HUMANS)
        );
        return result;
      },
      {
        labels: [],
        needLine: {
          style: {
            fill: COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.RED],
            stroke: COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.RED]
          },
          values: []
        },
        storageLine: {
          style: {
            fill: COLOR_VALUE_GRAPH_FILL[COLOR_GRAPH.GRAY],
            stroke: COLOR_VALUE_GRAPH_STROKE[COLOR_GRAPH.GRAY]
          },
          values: []
        }
      }
    );

  labels.push(core.round);
  needLine.values.push(core.currentPlayer.city.population);
  storageLine.values.push(
    core.currentPlayer.city.getMaxStorageValue(STORAGE_TYPE.HUMANS)
  );
  return { labels, values: [storageLine, needLine] };
});
</script>
