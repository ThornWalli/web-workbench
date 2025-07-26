<template>
  <div
    class="wb-disks-extras13-web-paint-display"
    :class="{
      selected
    }"
    :style="{
      '--color-background': display.options.colors.background.toHex()
    }"
    @click="onClick">
    <input
      :model-value="modelValue"
      type="radio"
      :value="display.id"
      name="display"
      :checked="modelValue === display.id"
      @input="onUpdateModelValue" />
    <interaction-canvas
      ref="interactionCanvasComponent"
      :interacting-move="currentTool?.interactingMove"
      :dimension="_dimension"
      :worker-manager="app.workerManager"
      @start="onStart"
      @over="onOver"
      @move="onMove"
      @move-static="onMoveStatic"
      @end="onEnd"
      @cancel="onCancel"
      @context-menu="onContextMenu" />
    <div class="helper highlight"></div>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import type Display from '../lib/classes/Display';
import { ipoint } from '@js-basics/vector';
import { WORKER_ACTION_TYPE } from '../types/worker';
import InteractionCanvas from './InteractionCanvas.vue';
import type { InteractionEvent } from './InteractionCanvas.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { filter, Subscription } from 'rxjs';

import type InteractionTool from '../lib/classes/tool/InteractionTool';
import type { Model } from '../types';
import type Core from '@web-workbench/core/classes/Core';
import { KEYBOARD_KEY } from '@web-workbench/core/types/dom';
import ToolPointerEvent from '../lib/classes/ToolPointerEvent';
// import {
//   dimensionToRealDimension,
//   fixedDimension,
//   fixedPosition,
//   normalizeDimension,
//   normalizePosition,
//   positionToRealPosition,
//   realPositionToPosition,
//   unnormalizeDimension,
//   unnormalizePosition
// } from '../utils/display';

const subscription = new Subscription();

const interactionCanvasComponent = ref<InstanceType<
  typeof InteractionCanvas
> | null>(null);

const $emit = defineEmits<{
  (e: 'update:model-value', value?: string): void;
}>();
const $props = defineProps<{
  core: Core;
  modelValue?: string;
  model: Model;
  display: Display;
  currentTool?: InteractionTool;
}>();

const app = computed(() => $props.model.app);

const _dimension = ref<(IPoint & number) | undefined>();
const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
  if (interactionCanvasComponent.value?.canvasEl) {
    _dimension.value = ipoint(contentRect.width, contentRect.height);
    interactionCanvasComponent.value.refresh();
  }
});

const selected = computed(() => {
  return $props.modelValue === $props.display.id;
});

watch(
  () => _dimension.value,
  (currentDimension, lastDimension) => {
    if (
      currentDimension &&
      lastDimension &&
      !currentDimension.equals(lastDimension) &&
      interactionCanvasComponent.value?.canvasEl &&
      $props.display.worker
    ) {
      refreshWorker();
    }
  }
);

onMounted(async () => {
  if (interactionCanvasComponent.value?.canvasEl) {
    await app.value.setDisplayCanvas(
      $props.display,
      interactionCanvasComponent.value.canvasEl
    );

    if (interactionCanvasComponent.value?.canvasEl) {
      resizeObserver.observe(interactionCanvasComponent.value.canvasEl);
    }

    subscription.add(
      domEvents.pointerDown.subscribe(e => {
        if (
          e.target &&
          !(e.target as HTMLElement).closest(
            '.wb-disks-extras13-web-paint-display'
          )
        ) {
          $props.currentTool.cancel({
            dimension: _dimension.value!,
            ctx: interactionCanvasComponent.value.interactionCtx
          });
        }
      })
    );

    subscription.add(
      domEvents.keyDown
        .pipe(filter(event => selected.value && event.target === document.body))
        .subscribe(async event => {
          let position = ipoint(0, 0);
          switch (event.key) {
            case KEYBOARD_KEY.ARROW_UP:
              position = ipoint(0, -0.01);
              break;
            case KEYBOARD_KEY.ARROW_DOWN:
              position = ipoint(0, 0.01);
              break;
            case KEYBOARD_KEY.ARROW_LEFT:
              position = ipoint(-0.01, 0);
              break;
            case KEYBOARD_KEY.ARROW_RIGHT:
              position = ipoint(0.01, 0);
              break;
            default:
              return;
          }

          if (domEvents.shiftLeftActive) {
            position = ipoint(() => position * 10);
          }

          position = ipoint(() => $props.display.options.position + position);

          setPosition(position);
        })
    );
  }
});

onUnmounted(() => {
  subscription.unsubscribe();
  if (interactionCanvasComponent.value?.canvasEl) {
    resizeObserver.unobserve(interactionCanvasComponent.value.canvasEl);
    app.value.removeDisplayCanvas($props.display);
  }
});

watch(
  () => $props.currentTool,
  (tool, lastTool) => {
    if (lastTool) {
      if (!interactionCanvasComponent.value?.interactionCtx) {
        throw new Error(
          'Interaction context is not available for the last tool cancel.'
        );
      }
      lastTool.cancel({
        dimension: _dimension.value!,
        ctx: interactionCanvasComponent.value.interactionCtx
      });
    }
  }
);

// #region Methods

function setPosition(position: IPoint & number) {
  const display = $props.display;
  display.actions.setPosition(position);
}

async function refreshWorker() {
  await app.value.actionDisplay($props.display, {
    type: WORKER_ACTION_TYPE.REFRESH,
    payload: {
      dimension: _dimension.value!
    }
  });
}

// #endregion

// #region Events

function onEnd(e: InteractionEvent) {
  $props.currentTool?.pointerUp(getToolPointerEvent(e));
}

function onStart(e: InteractionEvent) {
  $props.currentTool?.pointerDown(getToolPointerEvent(e));
}

function onOver(e: InteractionEvent) {
  $props.currentTool?.pointerOver(getToolPointerEvent(e));
}

function onMoveStatic(e: InteractionEvent) {
  positionDebounce(
    'onMoveStatic',
    getToolPointerEvent(e),
    (event: ToolPointerEvent) => {
      $props.currentTool?.pointerMoveStatic(event);
    }
  );
}

function onMove(e: InteractionEvent) {
  positionDebounce(
    'onMove',
    getToolPointerEvent(e),
    (event: ToolPointerEvent) => {
      $props.currentTool?.pointerMove(event);
    }
  );
}

function onCancel({ ctx }: InteractionEvent) {
  $props.currentTool?.pointerCancel({
    dimension: _dimension.value!,
    ctx
  });
}

function onContextMenu(e: InteractionEvent) {
  $props.currentTool?.contextMenu(getToolPointerEvent(e));
}

function onUpdateModelValue() {
  $emit('update:model-value', $props.display.id);
}

function onClick() {
  if ($props.modelValue !== $props.display.id) {
    $emit('update:model-value', $props.display.id);
  }
}

// #endregion

function getToolPointerEvent({
  position,
  ctx
}: InteractionEvent): ToolPointerEvent {
  const e = new ToolPointerEvent({
    seed: getRandomNumber(0, 1000000),
    dimension: _dimension.value!,
    position,
    ctx,
    documentMeta: app.value.currentDocument!.meta,
    displayOptions: app.value.currentDisplay!.options
  });
  // console.log(
  //   JSON.stringify(
  //     {
  //       clampedPosition: e.clampedPosition,
  //       position: e.position,
  //       clampedNormalizedPosition: e.clampedNormalizedPosition,
  //       normalizeBounds: e.normalizeBounds,
  //       normalizedPosition: e.normalizedPosition,
  //       realPosition: e.realPosition
  //     },
  //     null,
  //     2
  //   )
  // );

  return e;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const lastEvents = new Map<string, ToolPointerEvent>();
function positionDebounce(
  name: string,
  event: ToolPointerEvent,
  cb: (e: ToolPointerEvent) => void
) {
  const lastEvent = lastEvents.get(name);
  const lastRealPosition = lastEvent
    ? ipoint(
        Math.floor(lastEvent!.realPosition.x),
        Math.floor(lastEvent!.realPosition.y)
      )
    : undefined;
  let realPosition = event.realPosition;
  realPosition = ipoint(() => Math.floor(realPosition));
  if (!lastRealPosition || !lastRealPosition.equals(realPosition)) {
    cb(event);
    lastEvents.set(name, event);
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-display {
  position: relative;
  display: block;
  background-color: var(--color-background);

  & .wb-disks-extras13-web-paint-interaction-canvas {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  & input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    &:not(:checked) + * {
      pointer-events: none;
    }
  }

  & .helper {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  & input:focus ~ .helper {
    display: block;
    border: solid 2px var(--workbench-color-2);
  }

  &.selected {
    & .helper {
      display: block;
      border: solid 2px var(--color-web-paint-border-selected);
    }
  }
}
</style>
