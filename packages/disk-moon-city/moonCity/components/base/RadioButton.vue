<template>
  <div class="mc-base-radio-button" :class="{ selected: modelValue }">
    <input
      :id="id"
      :disabled="disabled"
      :checked="checked"
      type="radio"
      :value="value"
      @input="onInput" />
    <label :for="id" @pointerdown="onPointerDown">
      <slot :checked="checked" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue';

const id = useId();

const $emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void;
}>();

const onInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement && e.target.checked) {
    $emit('update:model-value', $props.value);
  }
};

const $props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
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

const onPointerDown = (e: PointerEvent) => {
  if ($props.modelValue === $props.value) {
    e.preventDefault();
    $emit('update:model-value', undefined);
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
