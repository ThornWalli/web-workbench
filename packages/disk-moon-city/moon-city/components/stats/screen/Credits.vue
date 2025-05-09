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

const { core } = useCore();

const data = computed(() => {
  if (!core.currentPlayer) {
    return {
      labels: [],
      values: []
    };
  }
  const { labels, values } = core.currentPlayer.roundLogs.slice(-5).reduce<{
    labels: string[];
    values: number[];
  }>(
    (result, log) => {
      result.labels.push(String(log.index));
      result.values.push(log.player.city.credits);
      return result;
    },
    {
      labels: [],
      values: []
    }
  );

  labels.push(String(core.round));
  values.push(core.currentPlayer.city.credits);
  return { labels, values };
});
</script>
