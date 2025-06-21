<template>
  <div
    class="wb-env-element-color-select"
    :style="{
      '--size': currentSize
    }"
    :class="{ disabled, readonly }">
    <canvas ref="canvasEl" :width="currentSize * 2" :height="currentSize * 2" />
    <input
      :id="id"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :value="modelValue"
      type="color"
      @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

const defaultSize = COLOR_SELECT_SIZE.MEDIUM;

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

const $props = defineProps<{
  size?: COLOR_SELECT_SIZE;
  modelValue: string;
  id?: string;
  name?: string;
  readonly?: boolean;
  disabled?: boolean;
}>();

const currentSize = computed(() => {
  return $props.size || defaultSize;
});

const canvasEl = ref<HTMLCanvasElement | null>(null);

function onChange(e: Event) {
  const input = e.target as HTMLInputElement;
  console.log('Color changed:', input.value);
  $emit('update:model-value', input.value);
}

watch(
  () => $props.modelValue,
  () => {
    refresh();
  },
  { immediate: true }
);

onMounted(() => {
  refresh();
});

function refresh() {
  if (!canvasEl.value) return;

  const ctx = canvasEl.value.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);

  ctx.fillStyle = $props.modelValue || '#000000';
  ctx.fillRect(0, 0, canvasEl.value.width, canvasEl.value.height);
}
</script>

<script lang="ts">
export enum COLOR_SELECT_SIZE {
  SMALL = 8,
  MEDIUM = 16,
  LARGE = 24,
  XLARGE = 32,
  XXLARGE = 48
}
</script>

<style lang="postcss" scoped>
.wb-env-element-color-select {
  --color-border: #fff;

  position: relative;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  border: solid var(--color-border) 2px;

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  & input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }
}
</style>
