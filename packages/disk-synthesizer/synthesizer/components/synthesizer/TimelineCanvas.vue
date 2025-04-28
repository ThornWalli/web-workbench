<template>
  <div class="synthesizer-timeline-canvas">
    <canvas ref="canvasEl" width="0" height="0" />
    <button
      v-for="{ position, dimension: noteDimension, note } in buttons"
      :key="note.index"
      :data-note="note.note.toString()"
      :data-time="note.time.toString()"
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

<script setup>
import { ipoint } from '@js-basics/vector';

import Track from '../../classes/Track';
import TimelineRenderer from '../../classes/TimelineRenderer';
import { getResizedCanvas } from '@web-workbench/core/utils/canvas';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const canvasEl = ref(null);

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

const $emit = defineEmits(['note:click', 'refresh', 'ready']);

const renderResult = ref(null);
const timelineRenderer = ref(null);
const dimension = ref(ipoint(0, 0));
const renderTimeout = ref(null);
const renderTimeoutB = ref(null);
const ready = ref(false);
const renderCanvas = ref(null);

watch(
  () => $props.track,
  () => {
    if ($props.static) {
      return;
    }
    window.clearTimeout(renderTimeoutB.value);
    renderTimeoutB.value = window.setTimeout(async () => {
      await render();
      renderTimeoutB.value = null;
    }, 250);
  },
  { deep: true }
);

const buttons = computed(() => {
  return $props.clickable ? renderResult.value?.notes || [] : [];
});

const refresh = () => {
  const subRender = resolve => {
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
      window.clearTimeout(renderTimeout.value);
      renderTimeout.value = window.setTimeout(async () => {
        await subRender(resolve);
        renderTimeout.value = null;
      }, 100);
    } else {
      subRender(resolve);
    }
  });
};

const render = async () => {
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
    .drawImage(
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
};

onMounted(() => {
  renderCanvas.value = renderCanvas.value || document.createElement('canvas');

  createRenderer();
  $emit('ready');
  ready.value = true;
});

const createRenderer = async () => {
  timelineRenderer.value = new TimelineRenderer(renderCanvas.value);
  await refresh();
};

const onClickNote = note => {
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

//   computed: {
//     buttons() {
//       return this.clickable ? this.renderResult?.notes || [] : [];
//     },
//     notes() {
//       return this.track.notes;
//     }
//   },

//   watch: {
//     track: {
//       handler() {
//         if (this.static) {
//           return;
//         }
//         window.clearTimeout(this.renderTimeoutB);
//         this.renderTimeoutB = window.setTimeout(async () => {
//           await this.render();
//           this.renderTimeoutB = null;
//         }, 250);
//       },
//       deep: true
//     }
//   },

//   async mounted() {
//     this.renderCanvas = this.renderCanvas || document.createElement('canvas');

//     await this.createRenderer();
//     this.$emit('ready');
//     this.ready = true;
//   },

//   methods: {
//     refresh() {
//       return new Promise(resolve => {
//         const render = resolve => {
//           window.requestAnimationFrame(() => {
//             this.$nextTick(async () => {
//               await this.render();
//               this.$emit('refresh');
//               resolve();
//             });
//           });
//         };
//         if (this.ready) {
//           window.clearTimeout(this.renderTimeout);
//           this.renderTimeout = window.setTimeout(async () => {
//             await render(resolve);
//             this.renderTimeout = null;
//           }, 100);
//         } else {
//           render(resolve);
//         }
//       });
//     },

//     async render() {
//       this.dimension = this.timelineRenderer.getDimension(this.track);
//       this.canvasEl.value.width = this.canvasEl.value.offsetWidth * this.density;
//       this.canvasEl.value.height = this.dimension.y * this.density;

//       this.renderCanvas.width = this.canvasEl.value.offsetWidth;
//       this.renderCanvas.height = this.dimension.y;

//       this.renderResult = await this.timelineRenderer.render(this.track, {
//         flipActive: this.flipActive
//         // selectedNotes: this.selectedNotes
//       });

//       const resizedCanvas = getResizedCanvas(
//         this.renderCanvas,
//         this.canvasEl.value.width
//       );

//       this.canvasEl.value
//         .getContext('2d')
//         .drawImage(
//           resizedCanvas,
//           0,
//           0,
//           resizedCanvas.width,
//           resizedCanvas.height,
//           0,
//           0,
//           this.canvasEl.value.width,
//           this.canvasEl.value.height
//         );
//     },

//     async createRenderer() {
//       this.timelineRenderer = new TimelineRenderer(this.renderCanvas);
//       await this.refresh();
//     },

//     onClickNote(note) {
//       if (this.track.selectedIndex === note.index) {
//         this.track.selectedIndex = -1;
//       } else {
//         this.track.selectedIndex = note.index;
//       }
//       this.$emit('note:click', {
//         note,
//         selected: this.track.selectedIndex === note.index
//       });
//     }
//   }
// };
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
