<template>
  <div class="mc-stats-navigation">
    <mc-button-navigation
      :model-value="modelValue"
      :items="actions"
      @update:model-value="onUpdateModelValue" />
  </div>
</template>

<script lang="ts" setup>
import type { STATS_NAVIGATION_TYPES } from '../../types';
import McButtonNavigation from '../ButtonNavigation.vue';
import type { ButtonNavigationItemList } from '../ButtonNavigation.vue';

defineProps<{
  modelValue: STATS_NAVIGATION_TYPES;
  actions: ButtonNavigationItemList;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void;
}>();

const onUpdateModelValue = async (action: string | undefined) => {
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
