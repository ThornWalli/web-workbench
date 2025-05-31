<!-- <template>
  <div
    class="wb-disks-extras13-web-painting-interaction-canvas"
    :style="{
      '--color-background': background.toHex(),
      '--color-foreground': foreground.toHex()
    }">
    <canvas ref="canvasEl" />
    <canvas ref="interactionCanvasEl" @pointerdown="onPointerDown" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import type WorkerManager from '../lib/classes/WorkerManager';
import domEvents from '@web-workbench/core/services/domEvents';
import {
  normalizePointerEvent,
  type NormalizedPointerEvent
} from '@web-workbench/core/services/dom';
import { fromEvent, map, Subscription } from 'rxjs';
import { WORKER_ACTION_TYPE } from '../types/worker';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { Color } from '../lib/classes/Color';
import type { ActionCommandToMainWorker } from '../types/worker.message.main';
import type { DrawRectanglePayload } from '../types/worker.payload';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const interactionCanvasEl = ref<HTMLCanvasElement | null>(null);

const defaultDensity = 1;
const $props = defineProps<{
  workerManager: WorkerManager;
  background: Color;
  foreground: Color;
  density?: number;
}>();

let workerUnsubscribe: CallableFunction | undefined = undefined;
onMounted(() => {
  if (canvasEl.value) {
    const { width, height } = canvasEl.value.getBoundingClientRect();
    canvasEl.value.width = width * currentDensity.value;
    canvasEl.value.height = height * currentDensity.value;
    interactionCanvasEl.value!.width = width * currentDensity.value;
    interactionCanvasEl.value!.height = height * currentDensity.value;
    workerUnsubscribe = $props.workerManager.registerCanvas(canvasEl.value);
  }
  if (interactionCanvasEl.value) {
    interactionCtx = interactionCanvasEl.value.getContext('2d');
    if (interactionCtx) {
      interactionCtx.strokeStyle = 'red'; // Farbe für das temporäre Rechteck
      interactionCtx.lineWidth = 2;
    }
  }
});

onUnmounted(() => {
  workerUnsubscribe?.();
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
  if (!interactionCtx || !interactionCanvasEl.value) return;
  isDrawing = true;
  offset = getOffset();
  positions.start = ipoint(Math.round(event.x), Math.round(event.y));
  interactionCtx.beginPath();
  console.log('Drawing started at:', positions.start.toArray());

  subscription = new Subscription();
  subscription.add(domEvents.pointerMove.subscribe(onPointerMove));

  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointerup')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerUp)
  );
  subscription.add(
    fromEvent(interactionCanvasEl.value, 'pointercancel')
      .pipe(map(e => normalizePointerEvent(e)))
      .subscribe(onPointerCancel)
  );
}

function onPointerUp(event: NormalizedPointerEvent) {
  endDrawing(event);
  subscription.unsubscribe();
}

function onPointerCancel() {
  cancelDrawing();
  subscription.unsubscribe();
}

let interactionCtx: CanvasRenderingContext2D | null = null;
let isDrawing = false;
const positions = reactive({
  start: ipoint(0, 0),
  current: ipoint(0, 0),
  end: ipoint(0, 0)
});

function onPointerMove(event: NormalizedPointerEvent) {
  if (!isDrawing || !interactionCtx) return;
  interactionCtx.clearRect(
    0,
    0,
    interactionCtx.canvas.width,
    interactionCtx.canvas.height
  );

  positions.current = ipoint(() => Math.round(ipoint(event.x, event.y)));

  onDraw();
}

function getNormalizedPositions() {
  return {
    start: ipoint(() => currentDensity.value * (positions.start - offset)),
    current: ipoint(() => currentDensity.value * (positions.current - offset)),
    end: ipoint(() => currentDensity.value * (positions.end - offset))
  };
}

function onDraw() {
  if (!interactionCtx) return;
  const normalzedPositions = getNormalizedPositions();

  if (isDrawing) {
    const dimension = ipoint(
      () => normalzedPositions.current - normalzedPositions.start
    );

    interactionCtx.strokeRect(
      normalzedPositions.start.x,
      normalzedPositions.start.y,
      dimension.x,
      dimension.y
    );
  } else {
    const rect = ipoint(() =>
      Math.min(normalzedPositions.start, normalzedPositions.end)
    );
    const rectDimension = ipoint(() =>
      Math.min(
        Math.abs(normalzedPositions.end - normalzedPositions.start),
        ipoint(
          $props.workerManager.canvas.width,
          $props.workerManager.canvas.height
        )
      )
    );

    if (rectDimension.x > 0 && rectDimension.y > 0) {
      const drawCommand: ActionCommandToMainWorker<DrawRectanglePayload> = {
        type: WORKER_ACTION_TYPE.DRAW_RECTANGLE,
        payload: {
          x: rect.x,
          y: rect.y,
          width: rectDimension.x,
          height: rectDimension.y,
          color: 'black'
        } // Permanente Farbe
      };
      $props.workerManager.action(drawCommand);
    }
  }
}

function endDrawing(event: NormalizedPointerEvent) {
  if (!isDrawing || !interactionCtx || !$props.workerManager?.ready) return;
  isDrawing = false;

  interactionCtx.clearRect(
    0,
    0,
    interactionCtx.canvas.width,
    interactionCtx.canvas.height
  );

  positions.end = ipoint(() => Math.round(ipoint(event.x, event.y)));

  onDraw();
}

function cancelDrawing() {
  if (isDrawing && interactionCtx) {
    isDrawing = false;
    interactionCtx.clearRect(
      0,
      0,
      interactionCtx.canvas.width,
      interactionCtx.canvas.height
    );
  }
}
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
</style> -->
