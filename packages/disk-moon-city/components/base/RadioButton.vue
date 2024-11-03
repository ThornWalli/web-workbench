<template>
  <div class="mc-base-radio-button" :class="{ selected: modelValue }">
    <input
      :id="id"
      :checked="checked"
      type="radio"
      :value="value"
      @input="onInput" />
    <label :for="id" @click="onPointerDown">
      <slot :checked="checked" />
    </label>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue';

const id = useId();

const $emit = defineEmits(['update:model-value']);
const onInput = e => {
  if (e.target.checked) {
    $emit('update:model-value', $props.value);
  }
};
const $props = defineProps({
  modelValue: {
    type: [Object, String],
    default: null
  },
  value: {
    type: String,
    default: null
  }
});

const checked = computed(() => $props.modelValue === $props.value);

const onPointerDown = e => {
  if ($props.modelValue === $props.value) {
    e.preventDefault();
    $emit('update:model-value', null);
  }
};
</script>

<style lang="postcss" scoped>
.mc-base-radio-button {
  position: relative;
  display: inline-block;

  & input {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }

  & label {
    display: block;
    padding: 0;
    margin: 0;
    font-size: 0;
    cursor: inherit;
    background: none;
    border: none;
  }
}
</style>
