<template>
  <div
    class="wb-disks-extras13-web-painting-interaction-canvas"
    :style="{
      '--color-background': (background || defaultBackground).toHex(),
      '--color-foreground': (foreground || defaultForeground).toHex()
    }">
    <canvas ref="canvasEl" />
    <canvas ref="interactionCanvasEl" @pointerdown="onPointerDown" />
    <!-- <teleport to="#debugWrapper">
      <pre class="debug">
        {{
          {
            positions,
            normalized: getNormalizedPositions()
          }
        }}
      </pre>
    </teleport> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import {
  normalizePointerEvent,
  type NormalizedPointerEvent
} from '@web-workbench/core/services/dom';
import { fromEvent, map, Subscription } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Color } from '../lib/classes/Color';

interface Positions {
  start: IPoint & number;
  current: IPoint & number;
  end: IPoint & number;
}

export type InteractionEvent = {
  positions: Positions;
};

const canvasEl = ref<HTMLCanvasElement | null>(null);
const interactionCanvasEl = ref<HTMLCanvasElement | null>(null);

const defaultBackground = new Color(0, 0, 0, 0);
const defaultForeground = new Color(0, 0, 0, 0);
const defaultDensity = 1;
const $props = defineProps<{
  background?: Color;
  foreground?: Color;
  density?: number;
}>();

const $emit = defineEmits<{
  (e: 'start' | 'move' | 'end' | 'cancel', data: InteractionEvent): void;
}>();

onMounted(() => {
  if (canvasEl.value) {
    const { width, height } = canvasEl.value.getBoundingClientRect();
    canvasEl.value.width = width * currentDensity.value;
    canvasEl.value.height = height * currentDensity.value;
    interactionCanvasEl.value!.width = width * currentDensity.value;
    interactionCanvasEl.value!.height = height * currentDensity.value;
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

const currentDensity = computed(() => $props.density || defaultDensity);

let offset: IPoint & number = ipoint(0, 0);
function getOffset() {
  const { x: offsetX, y: offsetY } =
    interactionCanvasEl.value!.getBoundingClientRect();
  return ipoint(offsetX, offsetY);
}

let subscription: Subscription;
function onPointerDown(event: NormalizedPointerEvent) {
  if (!interactionCanvasEl.value) return;
  isInteracting = true;
  offset = getOffset();
  positions.start = ipoint(Math.round(event.x), Math.round(event.y));
  // console.log('Drawing started at:', positions.start.toArray());

  subscription = new Subscription();
  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointermove')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerMove)
  );

  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointerup')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerUp)
  );
  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointerleave')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerCancel)
  );
  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointercancel')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerCancel)
  );

  $emit('start', {
    positions: getNormalizedPositions()
  });
}

function onPointerUp(event: NormalizedPointerEvent) {
  endInteracting(event);
  subscription.unsubscribe();
}

function onPointerCancel() {
  if (isInteracting) {
    isInteracting = false;
  }
  subscription.unsubscribe();
  $emit('cancel', {
    positions: getNormalizedPositions()
  });
}

let isInteracting = false;

const positions = reactive<Positions>({
  start: ipoint(0, 0),
  current: ipoint(0, 0),
  end: ipoint(0, 0)
});

function onPointerMove(event: NormalizedPointerEvent) {
  if (!isInteracting) return;

  positions.current = ipoint(() => Math.round(ipoint(event.x, event.y)));

  $emit('move', {
    positions: getNormalizedPositions()
  });
}

function getNormalizedPositions() {
  return {
    start: ipoint(() => currentDensity.value * (positions.start - offset)),
    current: ipoint(() => currentDensity.value * (positions.current - offset)),
    end: ipoint(() => currentDensity.value * (positions.end - offset))
  };
}

function endInteracting(event: NormalizedPointerEvent) {
  if (!isInteracting) return;
  isInteracting = false;

  positions.end = ipoint(() => Math.round(ipoint(event.x, event.y)));

  $emit('end', {
    positions: getNormalizedPositions()
  });
}

defineExpose({
  canvasEl,
  interactionCanvasEl
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-interaction-canvas {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);

  & .debug {
    display: none;
  }

  & canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: none;
    image-rendering: pixelated;
  }
}
</style>
