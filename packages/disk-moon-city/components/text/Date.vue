<template>
  <mc-text class="mc-text-date" color="white" :content="preparedDate" />
</template>

<script setup>
import { fillTextStart } from '../../utils/string';
import McText from '../Text';
const $props = defineProps({
  date: {
    type: Date,
    default: new Date()
  }
});

const preparedDate = computed(() => {
  const date = new Date($props.date);
  return [
    fillTextStart(date.getDate(), 2, '0'),
    fillTextStart(date.getMonth() + 1, 2, '0'),
    date.getFullYear()
  ].join('-');
});
</script>

<style lang="postcss" scoped>
.mc-text-date {
  display: flex;
}
</style>
