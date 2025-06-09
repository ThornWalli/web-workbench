<template>
  <div
    class="wb-disks-extras13-web-painting-display"
    :class="{
      selected: modelValue === display.id
    }"
    :style="{
      '--color-background': display.options.background.toHex()
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
      :dimension="dimension"
      :worker-manager="app.workerManager"
      :density="display.options.density"
      @start="onStart"
      @move="onMove"
      @end="onEnd"
      @cancel="onCancel"
      @context-menu="onContextMenu" />
    <div class="helper highlight"></div>
    <teleport to="#debugWrapper">
      <pre v-if="modelValue === display.id" class="debug">{{
        [
          `P: ${display.options.position.toArray().join(', ')}`,
          `Z: ${display.options.zoomLevel}`
        ].join('\n')
      }}</pre>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import type { App } from '../lib/App';
import type Display from '../lib/classes/Display';
import { ipoint } from '@js-basics/vector';
import { WORKER_ACTION_TYPE } from '../types/worker';
import InteractionCanvas, {
  type InteractionEvent
} from './InteractionCanvas.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { Subscription } from 'rxjs';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';
import type Tool from '../lib/classes/Tool';
import type { ToolPointerEvent } from '../lib/classes/Tool';

const subscription = new Subscription();

const interactionCanvasComponent = ref<InstanceType<
  typeof InteractionCanvas
> | null>(null);

const $emit = defineEmits<{
  (e: 'update:model-value', value?: string): void;
}>();
const $props = defineProps<{
  modelValue?: string;
  app: App;
  display: Display;
  currentTool?: Tool;
}>();

const dimension = ref<(IPoint & number) | undefined>();
const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
  if (interactionCanvasComponent.value?.canvasEl) {
    dimension.value = ipoint(contentRect.width, contentRect.height);
  }
});

watch(
  () => $props.app.options.density,
  () => {
    refreshWorker();
  }
);

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

onMounted(() => {
  if (interactionCanvasComponent.value?.canvasEl) {
    $props.app.setDisplayCanvas(
      $props.display,
      interactionCanvasComponent.value.canvasEl
    );

    resizeObserver.observe(interactionCanvasComponent.value.canvasEl);

    subscription.add(
      domEvents.keyDown.subscribe(async event => {
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
    $props.app.removeDisplayCanvas($props.display);
  }
});

// #region Methods

function setPosition(position: IPoint & number) {
  const display = $props.display;
  display.actions.setPosition(position);
}

async function refreshWorker() {
  await $props.app.actionDisplay($props.display, {
    type: WORKER_ACTION_TYPE.REFRESH,
    payload: {
      dimension: dimension.value!.toJSON(),
      density: $props.app.options.density
    }
  });
}

// #endregion

// #region Events

function normalizePosition(position: IPoint & number) {
  return ipoint(
    () =>
      (position / $props.display.options.density / dimension.value! - 0.5) * 2
  );
}

function getToolPointerEvent({
  position,
  ctx
}: InteractionEvent): ToolPointerEvent {
  const normalizedPosition = normalizePosition(position);
  return {
    dimension: dimension.value!,
    position: position,
    normalizedPosition,
    ctx,
    normalizePosition
  };
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
function onCancel() {
  $props.currentTool?.cancel();
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
.wb-disks-extras13-web-painting-display {
  position: relative;
  display: block;
  background-color: var(--color-background);

  & .wb-disks-extras13-web-painting-interaction-canvas {
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
      border: solid 2px var(--color-web-painting-border-selected);
    }
  }
}
</style>
