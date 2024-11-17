<template>
  <div class="mc-frame-stats-secondary">
    <mc-stats-navigation v-model="currentAction" :actions="actions" />
    <teleport to="#layout_screen">
      <mc-stats-screen v-if="currentAction" v-model="currentAction" />
    </teleport>
  </div>
</template>

<script setup>
import { STATS_NAVIGATION_TYPES } from '../../utils/keys';
import McStatsNavigation from '../stats/Navigation.vue';
import McStatsScreen from '../stats/Screen.vue';

const currentAction = ref(STATS_NAVIGATION_TYPES.OVERVIEW);

const actions = ref([
  [
    {
      label: 'Übersicht',
      shortLabel: 'Übersicht',
      value: STATS_NAVIGATION_TYPES.OVERVIEW
    },
    {
      label: 'Aktuelles Log',
      shortLabel: 'Aktue. Log',
      value: STATS_NAVIGATION_TYPES.CURRENT_LOG
    },
    {
      label: 'Letztes Log',
      shortLabel: 'Letzt. Log',
      value: STATS_NAVIGATION_TYPES.LAST_LOG
    },
    { label: 'Gebäude', value: STATS_NAVIGATION_TYPES.BUILDINGS },
    { label: 'Credits', value: STATS_NAVIGATION_TYPES.CREDITS },
    { next: true }
  ],
  [
    {
      label: 'Bevölkerung',
      shortLabel: 'Bevölker.',
      value: STATS_NAVIGATION_TYPES.POPULATION
    },
    {
      label: 'Sicherheitsdienst',
      shortLabel: 'S.Dienst',
      value: STATS_NAVIGATION_TYPES.SECURITY_SERVICE
    },
    { label: 'Soldaten', value: STATS_NAVIGATION_TYPES.SOLDIER },
    { label: 'Spione', value: STATS_NAVIGATION_TYPES.MERCENARY },
    { label: 'Strom', value: STATS_NAVIGATION_TYPES.ENERGY },
    { next: true }
  ],
  [
    { label: 'Nahrung', value: STATS_NAVIGATION_TYPES.FOOD },
    { label: 'Erz', value: STATS_NAVIGATION_TYPES.MINREAL_ORE },
    {
      label: 'Energiezellen',
      shortLabel: 'Energiezel.',
      value: STATS_NAVIGATION_TYPES.ENERGY_CELL
    },
    { label: 'Fahrzeuge', value: STATS_NAVIGATION_TYPES.VEHICLES },
    { label: 'Waffen', value: STATS_NAVIGATION_TYPES.WEAPONS },
    { next: true }
  ]
]);
</script>

<style lang="postcss" scoped>
.mc-frame-stats-secondary {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  background: url('../../assets/graphics/layout/stats-content-2.png');
  background-size: contain;
}
</style>
