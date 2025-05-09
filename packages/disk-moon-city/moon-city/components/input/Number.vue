<template>
  <base-input
    hide-caret
    :inputmode="InputMode.NUMERIC"
    :model-value="value"
    type="text"
    class="mc-input-number"
    @update:model-value="onUpdateModelValue" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { InputMode } from '../../types';
import BaseInput from '../base/Input.vue';
const $props = defineProps<{
  modelValue: number;
  max?: number;
  min?: number;
}>();

const value = computed(() => {
  return String($props.modelValue || 0);
});

const $emit = defineEmits(['update:modelValue']);

const onUpdateModelValue = (value: string) => {
  let number = Number(String(value).slice(-1, $props.max));
  if ($props.max) {
    number = Math.min($props.max, number);
  }
  if ($props.min) {
    number = Math.max($props.min, number);
  }
  if (!isNaN(number)) {
    $emit('update:modelValue', number);
  }
};
</script>
