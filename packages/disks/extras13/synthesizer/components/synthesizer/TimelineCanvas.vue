<template>
  <div>
    <canvas ref="canvas"></canvas>
    <i
      v-for="{
        position,
        dimension: noteDimension,
        note
      } in renderResult?.notes || []"
      :key="note.index"
      :class="{ selected: note.index === track.selectedIndex }"
      :style="{
        ...position.toCSSVars('position'),
        ...noteDimension.toCSSVars('dimension')
      }"
      @click="onClickNote(note)"></i>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';

import Track from '../../classes/Track';
import TimelineRenderer from '../../classes/TimelineRenderer';

export default {
  props: {
    flipActive: {
      type: Boolean,
      default: false
    },
    track: {
      type: Track,
      required: true
    }
  },
  emits: ['note:click', 'refresh'],

  data() {
    return {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        highlight: '#ffaa55'
      },

      renderResult: null,
      gridRenderer: null,

      dimension: ipoint(0, 0),

      renderTimeout: null
    };
  },

  computed: {
    notes() {
      return this.track.notes;
    }
  },

  watch: {
    track: {
      async handler() {
        await this.refresh();
      },
      deep: true
    }
  },
  mounted() {
    this.createRenderer();
  },

  methods: {
    refresh() {
      return new Promise(resolve => {
        window.clearTimeout(this.timeout);
        this.renderTimeout = window.setTimeout(() => {
          window.requestAnimationFrame(async () => {
            const { width, height } = this.$refs.canvas.getBoundingClientRect();
            this.dimension = ipoint(width, height);
            this.$refs.canvas.width =
              this.timelineRenderer.dimension.x || this.dimension.x;
            this.$refs.canvas.height =
              this.timelineRenderer.dimension.y || this.dimension.y;
            await this.render();
            this.$emit('refresh');
            resolve();
          });
        }, 50);
      });
    },

    async render() {
      this.renderResult = await this.timelineRenderer.render({
        flipActive: this.flipActive
      });
    },

    createRenderer() {
      this.timelineRenderer = new TimelineRenderer(
        this.$refs.canvas,
        this.track,
        { flipActive: this.flipActive }
      );
      this.refresh();
    },

    onClickNote(note) {
      if (this.track.selectedIndex === note.index) {
        this.track.selectedIndex = -1;
      } else {
        this.track.selectedIndex = note.index;
      }
      this.$emit('note:click', {
        note,
        selected: this.track.selectedIndex === note.index
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
canvas {
  display: block;
  width: 100%;
}

i {
  --padding: 5;

  position: absolute;
  top: calc((var(--position-y) - var(--padding)) * 1px);
  left: calc((var(--position-x) - var(--padding)) * 1px);
  width: calc((var(--dimension-x) + var(--padding) * 2) * 1px);
  height: calc((var(--dimension-y) + var(--padding) * 2) * 1px);

  &.selected {
    /* backdrop-filter: invert(1); */

    /* border: dashed #fa5 1px; */
  }
}

div {
  position: relative;
}
</style>
