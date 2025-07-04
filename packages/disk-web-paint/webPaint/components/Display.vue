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
      :dimension="dimension"
      :worker-manager="app.workerManager"
      @start="onStart"
      @move="onMove"
      @end="onEnd"
      @cancel="onCancel"
      @context-menu="onContextMenu" />
    <div class="helper highlight"></div>
    <!-- <teleport to="#debugWrapper">
      <pre v-if="modelValue === display.id" class="debug">{{
        [
          `P: ${display.options.position.toArray().join(', ')}`,
          `Z: ${display.options.zoomLevel}`
        ].join('\n')
      }}</pre>
    </teleport> -->
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
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';
import type { ToolPointerEvent } from '../lib/classes/Tool';
import type InteractionTool from '../lib/classes/tool/InteractionTool';
import type { Model } from '../types';
import type Core from '@web-workbench/core/classes/Core';

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

const dimension = ref<(IPoint & number) | undefined>();
const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
  if (interactionCanvasComponent.value?.canvasEl) {
    dimension.value = ipoint(contentRect.width, contentRect.height);
  }
});

const selected = computed(() => {
  return $props.modelValue === $props.display.id;
});

watch(
  () => dimension.value,
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

    resizeObserver.observe(interactionCanvasComponent.value.canvasEl);

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
        dimension: dimension.value!,
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
      dimension: dimension.value!
    }
  });
}

// #endregion

// #region Events

function normalizePosition(position: IPoint & number) {
  return ipoint(() => (position / dimension.value! - 0.5) * 2);
}
function unnormalizePosition(position: IPoint & number) {
  return ipoint(() => (position / 2 + 0.5) * dimension.value!);
}
function normalizeDimension(size: IPoint & number) {
  return ipoint(() => size / dimension.value!);
}

function unnormalizeDimension(size: IPoint & number) {
  return ipoint(() => size * dimension.value!);
}

function getToolPointerEvent({
  position,
  ctx
}: InteractionEvent): ToolPointerEvent {
  const normalizedPosition = normalizePosition(position);

  return {
    zoomLevel: $props.display.options.zoomLevel,
    dimension: dimension.value!,
    position: position,
    normalizedPosition,
    positionToRealPosition: position =>
      positionToRealPosition(position, {
        dimension: dimension.value!,
        displayPosition: $props.display.options.position,
        zoomLevel: $props.display.options.zoomLevel
      }),
    realPositionToPosition: position => {
      return realPositionToPosition(position, {
        dimension: dimension.value!,
        displayPosition: $props.display.options.position,
        zoomLevel: $props.display.options.zoomLevel
      });
    },
    fixedPosition,
    fixedDimension,
    fixedRealPosition: position => {
      position = fixedPosition(position);
      position = unnormalizePosition(position);
      position = ipoint(() => position + $props.display.options.zoomLevel / 2);
      return position;
    },

    ctx,
    normalizePosition,
    unnormalizePosition: unnormalizePosition,
    normalizeDimension,
    unnormalizeDimension
  };
}

function fixedPosition(position: IPoint & number) {
  position = positionToRealPosition(normalizePosition(position), {
    dimension: dimension.value!,
    displayPosition: $props.display.options.position,
    zoomLevel: $props.display.options.zoomLevel
  });
  position = realPositionToPosition(
    ipoint(() => {
      return Math.round(position);
    }),
    {
      dimension: dimension.value!,
      displayPosition: $props.display.options.position,
      zoomLevel: $props.display.options.zoomLevel
    }
  );
  return position;
}

function dimensionToRealDimension(
  normalizedDimension: IPoint & number,
  {
    dimension,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const realPosition = ipoint(() =>
    Math.round(normalizedDimension * (dimension / zoomLevel))
  );
  return realPosition;
}

function realDimensionToDimension(
  realDimension: IPoint & number,
  {
    dimension,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  return ipoint(() => realDimension / (dimension / zoomLevel));
}

function fixedDimension(normalizedDimension: IPoint & number) {
  normalizedDimension = dimensionToRealDimension(
    normalizeDimension(normalizedDimension),
    {
      dimension: dimension.value!,
      displayPosition: $props.display.options.position,
      zoomLevel: $props.display.options.zoomLevel
    }
  );
  normalizedDimension = realDimensionToDimension(normalizedDimension, {
    dimension: dimension.value!,
    displayPosition: $props.display.options.position,
    zoomLevel: $props.display.options.zoomLevel
  });
  return normalizedDimension;
}

function positionToRealPosition(
  position: IPoint & number,
  {
    dimension,
    displayPosition,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const imageDataDimension = app.value.currentDocument!.meta.dimension;

  const realPosition = ipoint(
    () =>
      displayPosition * imageDataDimension +
      imageDataDimension / 2 +
      ((position / zoomLevel) * dimension) / 2
  );
  return realPosition;
}

function realPositionToPosition(
  realPosition: IPoint & number,
  {
    dimension,
    displayPosition,
    zoomLevel
  }: {
    dimension: IPoint & number;
    displayPosition: IPoint & number;
    zoomLevel: number;
  }
) {
  const imageDataDimension = app.value.currentDocument!.meta.dimension;

  const position = ipoint(
    () =>
      ((realPosition -
        (displayPosition * imageDataDimension + imageDataDimension / 2)) *
        zoomLevel) /
      (dimension / 2)
  );
  return position;
}

function onEnd(e: InteractionEvent) {
  $props.currentTool?.pointerUp(getToolPointerEvent(e));
}

function onStart(e: InteractionEvent) {
  $props.currentTool?.pointerDown(getToolPointerEvent(e));
}

function onMove(e: InteractionEvent) {
  $props.currentTool?.pointerMove(getToolPointerEvent(e));
}
function onCancel({ ctx }: InteractionEvent) {
  $props.currentTool?.pointerCancel({
    dimension: dimension.value!,
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
