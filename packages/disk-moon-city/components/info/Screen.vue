<template>
  <mc-screen class="mc-stats-screen" :change-key="modelValue">
    <mc-info-screen-start v-if="modelValue === INFO_NAVIGATION_TYPES.START" />
    <mc-stats-screen-missing v-else />
    <slot></slot>
  </mc-screen>
</template>

<script setup>
import { INFO_NAVIGATION_TYPES } from '../../utils/keys';
import McScreen from '../Screen.vue';

import McInfoScreenStart from './screen/Start.vue';
import McStatsScreenMissing from './screen/Missing.vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
    validator: value => Object.values(INFO_NAVIGATION_TYPES).includes(value)
  }
});
</script>
