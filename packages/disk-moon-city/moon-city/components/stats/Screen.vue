<template>
  <mc-screen class="mc-stats-screen" :change-key="modelValue">
    <mc-stats-screen-overview
      v-if="modelValue === STATS_NAVIGATION_TYPES.OVERVIEW" />
    <mc-stats-screen-current-log
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.CURRENT_LOG" />
    <mc-stats-screen-last-log
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.LAST_LOG" />
    <mc-stats-screen-population
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.POPULATION" />
    <mc-stats-screen-credits
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.CREDITS" />
    <mc-stats-screen-food
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.FOOD" />
    <mc-stats-screen-energy
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.ENERGY" />
    <mc-stats-screen-mineral-ore
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.MINREAL_ORE" />
    <mc-stats-screen-buildings
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.BUILDINGS" />
    <mc-state-screen-energy-cell
      v-else-if="modelValue === STATS_NAVIGATION_TYPES.ENERGY_CELL" />
    <mc-stats-screen-missing v-else />
    <slot />
  </mc-screen>
</template>

<script setup>
import { STATS_NAVIGATION_TYPES } from '../../utils/keys';
import McScreen from '../Screen.vue';
import McStatsScreenOverview from './screen/Overview.vue';
import McStatsScreenCurrentLog from './screen/CurrentLog.vue';
import McStatsScreenLastLog from './screen/LastLog.vue';
import McStatsScreenPopulation from './screen/Population.vue';
import McStatsScreenCredits from './screen/Credits.vue';
import McStatsScreenFood from './screen/Food.vue';
import McStatsScreenEnergy from './screen/Energy.vue';
import McStatsScreenMineralOre from './screen/MineralOre.vue';
import McStatsScreenBuildings from './screen/Buildings.vue';
import McStatsScreenMissing from './screen/Missing.vue';
import McStateScreenEnergyCell from './screen/EnergyCell.vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
    validator: value => Object.values(STATS_NAVIGATION_TYPES).includes(value)
  }
});
</script>
