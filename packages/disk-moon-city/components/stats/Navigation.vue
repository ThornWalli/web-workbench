<template>
  <div class="mc-stats-navigation">
    <mc-button-navigation
      :model-value="modelValue"
      :items="actions"
      @update:model-value="onUpdateModelValue" />
  </div>
</template>

<script setup>
import { STATS_NAVIGATION_TYPES } from '../../utils/keys';

import McButtonNavigation from '../ButtonNavigation.vue';

defineProps({
  modelValue: {
    type: String,
    default: null,
    validator: value => Object.values(STATS_NAVIGATION_TYPES).includes(value)
  },
  actions: {
    type: Array,
    required: true
  }
});

const $emit = defineEmits(['update:model-value']);

const onUpdateModelValue = async action => {
  $emit('update:model-value', action);
};
</script>

<style lang="postcss" scoped>
.mc-stats-navigation {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
