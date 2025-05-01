<template>
  <base-input
    hide-caret
    inputmode="numeric"
    :model-value="String(modelValue)"
    type="text"
    class="mc-input-number"
    @update:model-value="onUpdateModelValue" />
</template>

<script setup>
import BaseInput from '../base/Input.vue';
const $props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: undefined
  },
  min: {
    type: Number,
    default: undefined
  }
});

const $emit = defineEmits(['update:modelValue']);

const onUpdateModelValue = value => {
  value = Number(String(value).slice(-1, $props.max));
  const number = Math.min($props.max, Math.max($props.min, Number(value)));

  if (!isNaN(number)) {
    $emit('update:modelValue', number);
  }
};
</script>
