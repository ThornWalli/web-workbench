<template>
  <div class="tool-placement" :class="{ ready, move }" :style="style">
    <slot />
    <div v-if="currentTool.resizeable" class="edges">
      <button
        class="top-left"
        @pointerdown="onPointerDownEdge($event, EDGE.TOP_LEFT)">
        <svg-top-left />
      </button>
      <button
        class="top-right"
        @pointerdown="onPointerDownEdge($event, EDGE.TOP_RIGHT)">
        <svg-top-right />
      </button>
      <button
        class="bottom-left"
        @pointerdown="onPointerDownEdge($event, EDGE.BOTTOM_LEFT)">
        <svg-bottom-left />
      </button>
      <button
        class="bottom-right"
        @pointerdown="onPointerDownEdge($event, EDGE.BOTTOM_RIGHT)">
        <svg-bottom-right />
      </button>
    </div>
    <div class="navigation">
      <div>
        <button @click="onClickAbort">
          <svg-abort />
        </button>
        <slot name="navigation" />
        <button @click="onClickApply">
          <svg-apply />
        </button>
      </div>
    </div>
  </div>
  <div v-if="info" class="info font-bit-font">
    <div v-for="line in info" :key="line">{{ line }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type Crop from '../../lib/classes/tool/interaction/Crop';
import type Tool from '../../lib/classes/Tool';
import SvgApply from '../../assets/svg/crop/apply.svg?component';
import SvgAbort from '../../assets/svg/crop/abort.svg?component';
import SvgTopLeft from '../../assets/svg/image_edge/top_left.svg?component';
import SvgTopRight from '../../assets/svg/image_edge/top_right.svg?component';
import SvgBottomLeft from '../../assets/svg/image_edge/bottom_left.svg?component';
import SvgBottomRight from '../../assets/svg/image_edge/bottom_right.svg?component';
import { EDGE } from '../../lib/classes/tool/PlacementTool';
import { NormalizedPointerEvent } from '@web-workbench/core/services/dom';
import domEvents from '@web-workbench/core/services/domEvents';
import { Subscription } from 'rxjs';
import type ToolPointerEvent from '../../lib/classes/ToolPointerEvent';
import { ipoint } from '@js-basics/vector';

const move = ref(false);
const $props = defineProps<{
  currentTool?: Tool;
  getToolPointerEvent?: (e: NormalizedPointerEvent) => ToolPointerEvent;
}>();

const currentTool = computed(() => $props.currentTool as Crop);

const currentEvent = computed(() => {
  return currentTool.value?.currentEvent;
});
const style = computed(() => {
  const tool = currentTool.value;
  if (!tool?.bounds) {
    return {};
  }

  const position = tool.bounds.position;
  const dimension = tool.bounds.dimension;

  return {
    ...position.toCSSVars('position'),
    ...dimension.toCSSVars('dimension')
  };
});

const ready = ref(false);

watch(
  () => currentTool.value.startEvent,
  (startEvent, lastEvent) => {
    if (startEvent && !lastEvent) {
      ready.value = true;
      // start
      startMove();
    }
  }
);
watch(
  () => currentTool.value.isMove,
  (isMove, lastIsMove) => {
    if (isMove && !lastIsMove) {
      // start
      startMove();
    }
  }
);

const info = computed(() => {
  const bounds = currentTool.value.bounds;
  if (!bounds) {
    return null;
  }
  const e = currentEvent.value;
  const realPosition = e.positionToRealPosition(
    e.normalizePosition(bounds!.position)
  );
  const realDimension = e.dimensionToRealDimension(
    e.normalizeDimension(bounds!.dimension)
  );

  return [
    `Pos.: ${Math.round(realPosition.x)},${Math.round(realPosition.y)}`,
    `Dim.: ${Math.round(realDimension.x)},${Math.round(realDimension.y)}`
  ];
});

const $emit = defineEmits<{
  (e: 'click', value: NormalizedPointerEvent): void;
}>();
let subscription = new Subscription();

function onPointerDownEdge(e: PointerEvent, edge: EDGE) {
  currentTool.value.onClickEdge(currentEvent.value, edge);
  startMove();
  $emit('click', new NormalizedPointerEvent(e));
}

function startMove() {
  subscription?.unsubscribe();
  subscription = new Subscription();
  subscription.add(domEvents.pointerMove.subscribe(onPointerMove));
  subscription.add(domEvents.pointerUp.subscribe(onPointerUp));
  move.value = true;
}

function onPointerUp() {
  move.value = false;
  subscription.unsubscribe();
  currentTool.value.pointerUp(currentEvent.value);
}

function onPointerMove() {
  const value = currentEvent.value;
  positionDebounce('onMove', value, (event: ToolPointerEvent) => {
    currentTool.value.pointerMove(event);
  });
}

function onClickAbort() {
  currentTool.value.onClickAbort(currentEvent.value);
}
function onClickApply() {
  currentTool.value.onClickApply(currentEvent.value);
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
.tool-placement {
  /* empty */
  position: absolute;
  top: calc(var(--position-y) * 1px);
  left: calc(var(--position-x) * 1px);
  display: none;
  width: calc(var(--dimension-x) * 1px);
  height: calc(var(--dimension-y) * 1px);
  pointer-events: none;

  &.ready {
    display: block;
  }

  &.move {
    & button {
      pointer-events: none;
    }
  }

  & button,
  & :deep(button) {
    appearance: none;
    pointer-events: auto;
    background: none;
    border: none;
  }

  & .edges {
    & button {
      position: absolute;
      padding: 0;
      pointer-events: auto;

      &.top-left {
        top: -3px;
        left: -3px;
      }

      &.top-right {
        top: -3px;
        right: -3px;
      }

      &.bottom-left {
        bottom: -3px;
        left: -3px;
      }

      &.bottom-right {
        right: -3px;
        bottom: -3px;
      }
    }
  }

  & .navigation {
    position: absolute;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: row;
    gap: var(--default-element-margin);
    justify-content: center;
    width: 100%;
    padding: calc(var(--default-element-margin) * 2);

    & > div {
      display: flex;
      flex-direction: row;
      gap: var(--default-element-margin);
      padding: 4px;
      color: #fff;
      background-color: #000;

      & svg,
      & :deep(svg) {
        fill: currentColor;
      }
    }
  }
}

.info {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  color: #fff;
  background: #000;
}
</style>
