<template>
  <mc-screen class="mc-stats-screen" :change-key="modelValue">
    <mc-info-screen-start v-if="modelValue === INFO_NAVIGATION_TYPES.START" />
    <mc-stats-screen-missing v-else />
    <slot />
  </mc-screen>
</template>

<script lang="ts" setup>
import { INFO_NAVIGATION_TYPES } from '../../types';
import McScreen from '../Screen.vue';

import McInfoScreenStart from './screen/Start.vue';
import McStatsScreenMissing from './screen/Missing.vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
    validator: (value: INFO_NAVIGATION_TYPES) =>
      Object.values(INFO_NAVIGATION_TYPES).includes(value)
  }
});
</script>
