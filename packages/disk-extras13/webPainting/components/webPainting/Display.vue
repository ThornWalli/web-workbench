<template>
  <div
    ref="rootEl"
    class="wb-disks-extras13-web-painting-display"
    :style="style">
    <div ref="displayWrapper" class="wrapper">
      <canvas ref="canvasEl" class="canvas" v-bind="canvasAttrs" />
    </div>
    <div v-if="true || showDisplayInfo" class="info" v-html="info" />
  </div>
</template>

<script lang="ts" setup>
import { Subscription, filter } from 'rxjs';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type Display from '../../lib/Display';

const $props = defineProps<{
  model: Display;
}>();

const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

const zoomFactor = ref($props.model.zoomFactor);
const maxZoomFactor = ref($props.model.maxZoomFactor);
const size = ref<IPoint & number>(ipoint(0, 0));
const subscription = new Subscription();
const showDisplayInfo = ref(false);

// const canvasSize = computed(() => {
//   return ipoint(() => $props.model.app.canvas.size * zoomFactor.value);
// });
const style = computed(() => {
  return Object.assign(
    {
      '--display-foreground': $props.model.app.options.display.foreground,
      '--display-background': $props.model.app.options.display.background
    },
    size.value.toCSSVars('size'),
    $props.model.canvasLayout.position.toCSSVars('canvas-position'),
    $props.model.canvasLayout.size.toCSSVars('canvas-size'),
    $props.model.canvasLayout.naturalSize.toCSSVars('canvas-natural-size')
  );
});
const canvasAttrs = computed(() => {
  return {
    width: $props.model.canvasLayout.size.x,
    height: $props.model.canvasLayout.size.y
  };
});
const displayOffset = computed(() => {
  return $props.model.offset;
});
const info = computed(() => {
  let { x, y } = displayOffset.value;
  x = [
    -$props.model.zoomBounds.min.x,
    x,
    $props.model.canvasLayout.naturalSize.x - $props.model.zoomBounds.max.x
  ].join('/');
  y = [
    -$props.model.zoomBounds.min.y,
    y,
    $props.model.canvasLayout.naturalSize.y - $props.model.zoomBounds.max.y
  ].join('/');

  return `${zoomFactor.value}/${maxZoomFactor.value} Z&nbsp;<br />${x} X&nbsp;<br />${y} Y&nbsp;`;
});

watch(
  () => size.value,
  () => {
    nextTick(() => {
      $props.model.refresh();
    });
  }
);

let timeout: number;
watch(
  () => displayOffset.value,
  () => {
    showDisplayInfo.value = true;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      showDisplayInfo.value = false;
    }, 500);
  }
);

onMounted(() => {
  if (!rootEl.value || !canvasEl.value) {
    throw new Error('Display: rootEl or canvasEl is null');
  }

  $props.model.setElement(rootEl.value);
  $props.model.setCanvas(canvasEl.value);

  subscription.add(
    $props.model.events
      .pipe(filter(({ name }) => name === 'change:size'))
      .subscribe(() => {
        size.value = $props.model.size;
      })
  );
  subscription.add(
    $props.model.events
      .pipe(filter(({ name }) => name === 'change:zoomFactor'))
      .subscribe(() => {
        zoomFactor.value = $props.model.zoomFactor;
        maxZoomFactor.value = $props.model.maxZoomFactor;
      })
  );
});

onUnmounted(() => {
  return $props.model.destroy();
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-display {
  --display-background: #000;
  --display-foreground: #fff;

  position: relative;
  width: calc(var(--size-x) * 1px);
  height: calc(var(--size-y) * 1px);
  background: var(--display-background);

  & .wrapper {
    position: relative;
    top: calc(var(--canvas-position-y) * 1px);
    left: calc(var(--canvas-position-x) * 1px);
    width: calc(var(--canvas-size-x) * 1px);
    height: calc(var(--canvas-size-y) * 1px);
  }

  & .canvas {
    width: 100%;
    height: 100%;
    cursor: none;
    user-select: none;
    background: var(--display-foreground);
  }

  & .info {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    text-align: right;
  }
}
</style>
