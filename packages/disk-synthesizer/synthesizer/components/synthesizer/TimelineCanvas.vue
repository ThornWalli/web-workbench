<template>
  <div class="synthesizer-timeline-canvas">
    <canvas ref="canvasEl" width="0" height="0" />
    <button
      v-for="{ position, dimension: noteDimension, note } in buttons"
      :key="note.index"
      :data-note="note.note?.toString()"
      :data-time="note.time?.toString()"
      :class="{ selected: note.index === track.selectedIndex }"
      :style="{
        ...position.toCSSVars('position'),
        ...noteDimension.toCSSVars('dimension')
      }"
      @click="onClickNote(note)">
      <span>Note {{ note.index }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';

import Track from '../../classes/Track';
import TimelineRenderer from '../../classes/TimelineRenderer';
import { getResizedCanvas } from '@web-workbench/core/utils/canvas';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type NoteDescription from '../../classes/NoteDescription';

const canvasEl = ref<HTMLCanvasElement>();

const $props = defineProps({
  flipActive: {
    type: Boolean,
    default: false
  },
  track: {
    type: Track,
    required: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  static: {
    type: Boolean,
    default: false
  },
  selectedNotes: {
    type: Array,
    default: () => []
  },
  density: {
    type: Number,
    default() {
      return window.devicePixelRatio || 1;
    }
  }
});

const $emit = defineEmits<{
  (e: 'refresh' | 'ready'): void;
  (
    e: 'note:click',
    payload: { note: NoteDescription; selected: boolean }
  ): void;
}>();

const renderResult = ref<Awaited<ReturnType<TimelineRenderer['render']>>>();
const timelineRenderer = ref<TimelineRenderer>();
const dimension = ref(ipoint(0, 0));
let renderTimeout: number | undefined;
let renderTimeoutB: number | undefined;
const ready = ref(false);
const renderCanvas = ref<HTMLCanvasElement>();

watch(
  () => $props.track,
  () => {
    if ($props.static) {
      return;
    }
    window.clearTimeout(renderTimeoutB);
    renderTimeoutB = window.setTimeout(async () => {
      await render();
      renderTimeoutB = undefined;
    }, 250);
  },
  { deep: true }
);

const buttons = computed(() => {
  return $props.clickable ? renderResult.value?.notes || [] : [];
});

const refresh = () => {
  const subRender = (resolve: CallableFunction) => {
    window.requestAnimationFrame(() => {
      nextTick(async () => {
        await render();
        $emit('refresh');
        resolve();
      });
    });
  };
  return new Promise(resolve => {
    if (ready.value) {
      window.clearTimeout(renderTimeout);
      renderTimeout = window.setTimeout(async () => {
        await subRender(resolve);
        renderTimeout = undefined;
      }, 100);
    } else {
      subRender(resolve);
    }
  });
};

const render = async () => {
  if (timelineRenderer.value && canvasEl.value && renderCanvas.value) {
    dimension.value = timelineRenderer.value.getDimension($props.track);
    canvasEl.value.width = canvasEl.value.offsetWidth * $props.density;
    canvasEl.value.height = dimension.value.y * $props.density;

    renderCanvas.value.width = canvasEl.value.offsetWidth;
    renderCanvas.value.height = dimension.value.y;

    renderResult.value = await timelineRenderer.value.render($props.track, {
      flipActive: $props.flipActive
      // selectedNotes: selectedNotes
    });

    const resizedCanvas = getResizedCanvas(
      renderCanvas.value,
      canvasEl.value.width
    );

    canvasEl.value
      .getContext('2d')
      ?.drawImage(
        resizedCanvas,
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height,
        0,
        0,
        canvasEl.value.width,
        canvasEl.value.height
      );
  }
};

onMounted(() => {
  renderCanvas.value = renderCanvas.value || document.createElement('canvas');

  createRenderer();
  $emit('ready');
  ready.value = true;
});

const createRenderer = async () => {
  if (!renderCanvas.value) {
    throw new Error('Canvas not found');
  }
  timelineRenderer.value = new TimelineRenderer(renderCanvas.value);
  await refresh();
};

const onClickNote = (note: NoteDescription) => {
  if ($props.track.selectedIndex === note.index) {
    $props.track.setSelectedIndex(-1);
  } else {
    $props.track.setSelectedIndex(note.index);
  }
  $emit('note:click', {
    note,
    selected: $props.track.selectedIndex === note.index
  });
};
</script>

<style lang="postcss" scoped>
canvas {
  display: block;
  width: 100%;
}

button {
  --padding: 5;

  position: absolute;
  top: calc((var(--position-y) - var(--padding)) * 1px);
  left: calc((var(--position-x) - var(--padding)) * 1px);
  width: calc((var(--dimension-x) + var(--padding) * 2) * 1px);
  height: calc((var(--dimension-y) + var(--padding) * 2) * 1px);
  padding: 0;
  appearance: none;
  outline: none;
  background: transparent;
  border: none;

  & span {
    display: none;
  }

  &.selected {
    /* backdrop-filter: invert(1); */

    /* border: dashed #fa5 1px; */
  }
}

div {
  position: relative;
}
</style>
