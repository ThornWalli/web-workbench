<template>
  <div
    class="wb-disks-extras13-web-paint-interaction-canvas"
    :style="{
      '--color-background': (background || defaultBackground).toHex(),
      '--color-foreground': (foreground || defaultForeground).toHex()
    }">
    <canvas ref="canvasEl" />
    <canvas
      ref="interactionCanvasEl"
      @pointermove="onPointerMoveStatic"
      @pointerdown.passive="onPointerDown"
      @pointerover.passive="onPointerOver" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { normalizePointerEvent } from '@web-workbench/core/services/dom';
import type { NormalizedPointerEvent } from '@web-workbench/core/services/dom';
import { fromEvent, map, Subscription } from 'rxjs';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Color from '../lib/classes/Color';

export type InteractionEvent = {
  position: IPoint & number;
  ctx?: CanvasRenderingContext2D;
};

const subscription: Subscription = new Subscription();

const canvasEl = ref<HTMLCanvasElement | null>(null);
const interactionCanvasEl = ref<HTMLCanvasElement | null>(null);
const interactionCtx = ref<CanvasRenderingContext2D | null>(null);

const defaultBackground = new Color(0, 0, 0, 0);
const defaultForeground = new Color(0, 0, 0, 0);
const defaultDensity = 1;
const $props = defineProps<{
  background?: Color;
  foreground?: Color;
  density?: number;
  dimension?: IPoint;
  interactingMove?: boolean;
}>();

const currentDimension = computed(() => {
  return $props.dimension || ipoint(800, 600);
});

const $emit = defineEmits<{
  (
    e:
      | 'start'
      | 'move'
      | 'end'
      | 'cancel'
      | 'context-menu'
      | 'over'
      | 'move-static',
    data: InteractionEvent
  ): void;
}>();

watch(
  () => currentDimension.value,
  dimension => {
    if (interactionCanvasEl.value) {
      interactionCanvasEl.value.width = dimension.x;
      interactionCanvasEl.value.height = dimension.y;
      interactionCtx.value = interactionCanvasEl.value.getContext('2d', {
        willReadFrequently: true
      })!;
      interactionCtx.value!.imageSmoothingEnabled = false;
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  if (canvasEl.value && interactionCanvasEl.value) {
    const { width, height } = canvasEl.value.getBoundingClientRect();
    canvasEl.value.width = width * currentDensity.value;
    canvasEl.value.height = height * currentDensity.value;
    interactionCanvasEl.value.width = canvasEl.value.width;
    interactionCanvasEl.value.height = canvasEl.value.height;

    interactionCtx.value = interactionCanvasEl.value.getContext('2d', {
      willReadFrequently: true
    })!;
    interactionCtx.value!.imageSmoothingEnabled = false;
  }

  if (interactionCanvasEl.value) {
    // subscription.add(
    //   fromEvent(document, 'pointermove', { passive: true })
    //     .pipe(map(e => normalizePointerEvent(e)))
    //     .subscribe(onPointerMoveStatic)
    // );
    subscription.add(
      fromEvent(interactionCanvasEl.value, 'pointermove', { passive: true })
        .pipe(map(e => normalizePointerEvent(e)))
        .subscribe(onPointerMove)
    );
    subscription.add(
      fromEvent(interactionCanvasEl.value, 'pointerleave', { passive: true })
        .pipe(map(e => normalizePointerEvent(e)))
        .subscribe(onPointerCancel)
    );
    subscription.add(
      fromEvent(interactionCanvasEl.value, 'pointercancel', { passive: true })
        .pipe(map(e => normalizePointerEvent(e)))
        .subscribe(onPointerCancel)
    );
    subscription.add(
      fromEvent(interactionCanvasEl.value, 'contextmenu')
        .pipe(map(e => normalizePointerEvent(e)))
        .subscribe((e: NormalizedPointerEvent) => {
          const position = ipoint(Math.round(e.x), Math.round(e.y));
          $emit('context-menu', {
            position: getNormalizedPosition(position),
            ctx: interactionCtx.value!
          });
        })
    );
    subscription.add(
      fromEvent(interactionCanvasEl.value, 'pointerup', { passive: true })
        .pipe(map(e => normalizePointerEvent(e)))
        .subscribe(onPointerUp)
    );
  }
  offset = getOffset();
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

const currentPosition = ref<IPoint & number>(ipoint(0, 0));
function setPosition(event: NormalizedPointerEvent) {
  currentPosition.value = ipoint(Math.round(event.x), Math.round(event.y));
}

function startInteracting(event?: NormalizedPointerEvent) {
  event = event || test;
  if (!interactionCanvasEl.value) return;
  isInteracting = true;
  offset = getOffset();

  setPosition(event);

  $emit('start', {
    position: getNormalizedPosition(currentPosition.value),
    ctx: interactionCtx.value!
  });
}

function onPointerDown(event: NormalizedPointerEvent) {
  startInteracting(event);
}

function onPointerOver() {
  $emit('over', {
    position: getNormalizedPosition(currentPosition.value),
    ctx: interactionCtx.value!
  });
}
let test: NormalizedPointerEvent;
function onPointerMoveStatic(event: NormalizedPointerEvent) {
  test = event;
  // if (isInteracting) {
  //   return;
  // }
  $emit('move-static', {
    position: getNormalizedPosition(
      ipoint(Math.round(event.x), Math.round(event.y))
    ),
    ctx: interactionCtx.value!
  });
}

function onPointerUp(event: NormalizedPointerEvent) {
  endInteracting(event);
}

function onPointerCancel() {
  if (isInteracting) {
    isInteracting = false;
  }
  $emit('cancel', {
    position: getNormalizedPosition(currentPosition.value),
    ctx: interactionCtx.value!
  });
}

let isInteracting = false;

function onPointerMove(event: NormalizedPointerEvent) {
  if ($props.interactingMove && !isInteracting) return;

  setPosition(event);

  $emit('move', {
    position: getNormalizedPosition(currentPosition.value),
    ctx: interactionCtx.value!
  });
}

function getNormalizedPosition(position: IPoint & number) {
  return ipoint(() => currentDensity.value * (position - offset));
}

function endInteracting(event: NormalizedPointerEvent) {
  if (!isInteracting) return;
  isInteracting = false;

  setPosition(event);

  $emit('end', {
    position: getNormalizedPosition(currentPosition.value),
    ctx: interactionCtx.value!
  });
}

function refresh() {
  offset = getOffset();
}

defineExpose({
  refresh,
  canvasEl,
  interactionCanvasEl,
  interactionCtx,
  startInteracting
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-interaction-canvas {
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
