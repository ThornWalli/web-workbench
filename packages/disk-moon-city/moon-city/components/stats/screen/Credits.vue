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

const { core } = useCore();

const data = computed(() => {
  const { labels, values } = core.currentPlayer.roundLogs.slice(-5).reduce(
    (result, log) => {
      result.labels.push(log.index);
      result.values.push(log.player.city.credits);
      return result;
    },
    {
      labels: [],
      values: []
    }
  );

  labels.push(core.round);
  values.push(core.currentPlayer.city.credits);
  return { labels, values };
});
</script>
