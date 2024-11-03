<template>
  <div class="mc-frame-stats-secondary">
    <mc-stats-navigation v-model="currentAction" :actions="actions" />
    <teleport to="#layout_screen">
      <mc-stats-screen v-if="currentAction" :action="currentAction" />
    </teleport>
  </div>
</template>

<script setup>
import { NAVIGATION_TYPES } from '../../utils/keys';
import McStatsNavigation from '../stats/Navigation.vue';
import McStatsScreen from '../stats/Screen.vue';

const currentAction = ref(NAVIGATION_TYPES.OVERVIEW);

const actions = ref([
  [
    {
      label: 'Ubersicht',
      shortLabel: 'Ubersicht',
      action: NAVIGATION_TYPES.OVERVIEW
    },
    {
      label: 'Aktuelles Log',
      shortLabel: 'Aktue. Log',
      action: NAVIGATION_TYPES.CURRENT_LOG
    },
    {
      label: 'Letztes Log',
      shortLabel: 'Letzt. Log',
      action: NAVIGATION_TYPES.LAST_LOG
    },
    {
      label: 'Bevoelkerung',
      shortLabel: 'Bevoelker.',
      action: NAVIGATION_TYPES.POPULATION
    },
    { label: 'Credits', action: NAVIGATION_TYPES.CREDITS },
    { label: 'Weiter', action: NAVIGATION_TYPES.NEXT }
  ],
  [
    {
      label: 'Sicherheitsdienst',
      shortLabel: 'S.Dienst',
      action: NAVIGATION_TYPES.SECURITY_SERVICE
    },
    { label: 'Soldaten', action: NAVIGATION_TYPES.SOLDIERS },
    { label: 'Spione', action: NAVIGATION_TYPES.MERCENARY },
    { label: 'Strom', action: NAVIGATION_TYPES.ENERGY },
    { label: 'Nahrung', action: NAVIGATION_TYPES.FOOD },
    { label: 'Weiter', action: NAVIGATION_TYPES.NEXT }
  ],
  [
    { label: 'Erz', action: NAVIGATION_TYPES.RESOURCE_ORE },
    {
      label: 'Energiezellen',
      shortLabel: 'Energiezel.',
      action: NAVIGATION_TYPES.RESOURCE_ENERGY_CELL
    },
    { label: 'Gebaeude', action: NAVIGATION_TYPES.BUILDINGS },
    { label: 'Fahrzeuge', action: NAVIGATION_TYPES.VEHICLES },
    { label: 'Waffen', action: NAVIGATION_TYPES.WEAPONS },
    { label: 'Weiter', action: NAVIGATION_TYPES.NEXT }
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
