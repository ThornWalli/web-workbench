<template>
  <div
    class="wb-disks-extras13-web-painting-display"
    :style="{
      '--color-background': display.options.background.toHex()
    }">
    <interaction-canvas
      ref="interactionCanvasComponent"
      :worker-manager="app.workerManager"
      :density="app.options.density"
      @start="onStart"
      @move="onMove"
      @end="onEnd"
      @cancel="onCancel" />
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { App } from '../lib/App';
import { WORKER_ACTION_TYPE } from '../types/worker';

import InteractionCanvas from './InteractionCanvas.vue';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import type { ZoomPayload } from '../types/worker.payload';
import type Display from '../lib/classes/Display';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { DisplayWorkerIncomingAction } from '../types/worker.message.display';

const interactionCanvasComponent = ref<InstanceType<
  typeof InteractionCanvas
> | null>(null);

const $props = defineProps<{
  app: App;
  display: Display;
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
async function refreshWorker() {
  const payload = {
    dimension: dimension.value!.toJSON(),
    density: $props.app.options.density
  };

  await $props.app.workerManager.action<DisplayWorkerIncomingAction>(
    {
      type: WORKER_ACTION_TYPE.REFRESH,
      payload
    },
    [],
    $props.display.worker
  );
}

onMounted(() => {
  if (interactionCanvasComponent.value?.canvasEl) {
    $props.app.setDisplayCanvas(
      $props.display,
      interactionCanvasComponent.value.canvasEl
    );

    resizeObserver.observe(interactionCanvasComponent.value.canvasEl);
  }
});

onUnmounted(() => {
  if (interactionCanvasComponent.value?.canvasEl) {
    resizeObserver.unobserve(interactionCanvasComponent.value.canvasEl);
    $props.app.removeDisplayCanvas($props.display);
  }
});

function onStart() {
  $props.app.workerManager.action<ActionCommandToMainWorker<ZoomPayload>>({
    type: WORKER_ACTION_TYPE.ZOOM,
    payload: {
      level: 1.2,
      offset: ipoint(0, 0)
    }
  });

  console.log('onStart');
  // Emit start event with positions
}
function onMove() {
  console.log('onMove');
  // Emit start event with positions
}
function onEnd() {
  console.log('onEnd');
  // Emit start event with positions
}
function onCancel() {
  console.log('onCancel');
  // Emit start event with positions
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-display {
  position: relative;
  display: block;

  /* width: 100%;
  height: 100%; */
  background-color: var(--color-background);

  & .wb-disks-extras13-web-painting-interaction-canvas {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
