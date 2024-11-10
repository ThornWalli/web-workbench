<template>
  <mc-screen class="mc-stats-screen" :change-key="action">
    <mc-stats-screen-overview
      v-if="action === NAVIGATION_TYPES.OVERVIEW"
      :action="action" />
    <mc-stats-screen-current-log
      v-else-if="action === NAVIGATION_TYPES.CURRENT_LOG"
      :action="action" />
    <mc-stats-screen-last-log
      v-else-if="action === NAVIGATION_TYPES.LAST_LOG"
      :action="action" />
    <mc-stats-screen-population
      v-else-if="action === NAVIGATION_TYPES.POPULATION"
      :action="action" />
    <mc-stats-screen-credits
      v-else-if="action === NAVIGATION_TYPES.CREDITS"
      :action="action" />
    <mc-stats-screen-food
      v-else-if="action === NAVIGATION_TYPES.FOOD"
      :action="action" />
    <mc-stats-screen-energy
      v-else-if="action === NAVIGATION_TYPES.ENERGY"
      :action="action" />
    <mc-stats-screen-mineral-ore
      v-else-if="action === NAVIGATION_TYPES.MINREAL_ORE"
      :action="action" />
    <mc-stats-screen-missing v-else />
    <slot></slot>
  </mc-screen>
</template>

<script setup>
import { NAVIGATION_TYPES } from '../../utils/keys';
import McScreen from '../Screen.vue';
import McStatsScreenOverview from './screen/Overview.vue';
import McStatsScreenCurrentLog from './screen/CurrentLog.vue';
import McStatsScreenLastLog from './screen/LastLog.vue';
import McStatsScreenPopulation from './screen/Population.vue';
import McStatsScreenCredits from './screen/Credits.vue';
import McStatsScreenFood from './screen/Food.vue';
import McStatsScreenEnergy from './screen/Energy.vue';
import McStatsScreenMineralOre from './screen/MineralOre.vue';
import McStatsScreenMissing from './screen/Missing.vue';

defineProps({
  action: {
    type: String,
    required: true,
    validator: value => Object.values(NAVIGATION_TYPES).includes(value)
  }
});
</script>
