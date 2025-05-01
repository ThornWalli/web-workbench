<template>
  <div class="synthesizer-metronom">
    <div class="wrapper">
      <slot name="background" v-bind="{ onRefresh: () => onRefresh() }">
        <div class="spacer" />
      </slot>
      <canvas ref="canvasEl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPoint } from '@js-basics/vector';
import Metronom from '../../classes/Metronom';
import MetronomRenderer from '../../classes/MetronomRenderer';

import { onMounted, ref, watch } from 'vue';

export type EventValueReady = { render: () => void };

const canvasEl = ref<HTMLCanvasElement>();
const $props = defineProps({
  model: {
    type: Metronom,
    required: true
  }
});

const $emits = defineEmits<{
  (e: 'value', value: number): void;
  (
    e: 'render',
    ctx: CanvasRenderingContext2D,
    options: {
      position: IPoint & number;
      dimension: IPoint & number;
    }
  ): void;
  (e: 'ready', data: EventValueReady): void;
}>();

const metronomRenderer = ref<MetronomRenderer>();

watch(
  () => $props.model.value,
  value => {
    $emits('value', value);
    render();
  }
);
watch(
  () => $props.model.time,
  () => {
    render();
  }
);
watch(
  () => $props.model.speed,
  () => {
    render();
  }
);

onMounted(() => {
  if (!canvasEl.value) {
    throw new Error('Canvas element is not defined');
  }
  metronomRenderer.value = new MetronomRenderer(canvasEl.value, $props.model);
  onRefresh();
  $emits('ready', {
    render: () => render()
  });
});

function onRefresh() {
  if (!canvasEl.value) {
    return;
  }
  const { width, height } = canvasEl.value.getBoundingClientRect();
  canvasEl.value.width = width;
  canvasEl.value.height = height;
  render();
}

function render() {
  metronomRenderer.value?.render((ctx, options) => {
    $emits('render', ctx, options);
  });
}

// export default {
//   props: {
//     model: {
//       type: Metronom,
//       required: true
//     }
//   },

//   emits: ['value', 'speed', 'render', 'ready'],

//   async setup() {
//     return { ...(await useTone()) };
//   },

//   data() {
//     return {
//       metronomRenderer: null,
//       dimension: ipoint(0, 0)
//     };
//   },

//   computed: {
//     isPlaying() {
//       return this.model.state === 'playing';
//     }
//   },

//   watch: {
//     'model.value'(value) {
//       this.$emit('value', value);
//       this.render();
//     },
//     'model.time'() {
//       this.render();
//     },
//     'model.speed'() {
//       this.render();
//     }
//   },

//   mounted() {
//     this.metronomRenderer = new MetronomRenderer(this.$refs.canvas, this.model);
//     this.onRefresh();
//     this.$emit('ready', {
//       render: () => this.render()
//     });
//   },

//   methods: {
//     onRefresh() {
//       const { width, height } = this.$refs.canvas.getBoundingClientRect();
//       this.$refs.canvas.width = width;
//       this.$refs.canvas.height = height;
//       this.render();
//     },
//     render() {
//       this.metronomRenderer.render((...args) => {
//         this.$emit('render', ...args);
//       });
//     }
//   }
// };
</script>

<style lang="postcss" scoped>
.synthesizer-metronom {
  & .spacer {
    position: relative;
    aspect-ratio: 4 / 1;
  }

  & .wrapper {
    position: relative;

    /* width: calc(100% - (var(--default-element-margin) * 2) * 2);
    margin: calc(var(--default-element-margin) * 2); */
  }

  & canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
