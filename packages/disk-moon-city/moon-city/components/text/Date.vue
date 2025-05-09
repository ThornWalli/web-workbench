<template>
  <mc-text class="mc-text-date" color="white" :content="preparedDate" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { fillTextStart } from '../../utils/string';
import McText from '../Text.vue';
const $props = defineProps({
  date: {
    type: Date,
    default: new Date()
  }
});

const preparedDate = computed(() => {
  const date = new Date($props.date);
  return [
    fillTextStart(String(date.getDate()), 2, '0'),
    fillTextStart(String(date.getMonth() + 1), 2, '0'),
    date.getFullYear()
  ].join('-');
});
</script>

<style lang="postcss" scoped>
.mc-text-date {
  display: flex;
}
</style>
