<template>
  <mc-text class="mc-text-date" color="white" :content="preparedDate" />
</template>

<script setup>
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
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('-');
});
</script>

<style lang="postcss" scoped>
.mc-text-date {
  display: flex;
}
</style>
