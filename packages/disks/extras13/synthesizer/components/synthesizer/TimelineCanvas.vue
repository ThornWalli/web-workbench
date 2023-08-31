<template>
  <div>
    <canvas ref="canvas" width="0" height="0"></canvas>
    <button
      v-for="{ position, dimension: noteDimension, note } in buttons"
      :key="note.index"
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
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['note:click', 'refresh', 'ready'],

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

      renderTimeout: null,

      ready: false
    };
  },

  computed: {
    buttons() {
      return this.clickable ? this.renderResult?.notes || [] : [];
    },
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

  async mounted() {
    await this.createRenderer();
    this.$emit('ready');
    this.ready = true;
  },

  methods: {
    refresh() {
      return new Promise(resolve => {
        const render = resolve => {
          window.requestAnimationFrame(async () => {
            const { width, height } = this.$refs.canvas.getBoundingClientRect();
            this.dimension = this.timelineRenderer.getDimension(this.track);
            this.$refs.canvas.width = width || this.dimension.x;
            this.$refs.canvas.height = height || this.dimension.y;
            await this.render();
            this.$emit('refresh');
            resolve();
          });
        };
        if (this.ready) {
          window.clearTimeout(this.renderTimeout);
          this.renderTimeout = null;
          this.renderTimeout = window.setTimeout(
            async () => {
              await render(resolve);
              this.renderTimeout = null;
            },
            this.renderTimeout ? 50 : 0
          );
        } else {
          render(resolve);
        }
      });
    },

    async render() {
      this.renderResult = await this.timelineRenderer.render(this.track, {
        flipActive: this.flipActive
      });
    },

    async createRenderer() {
      this.timelineRenderer = new TimelineRenderer(this.$refs.canvas);
      await this.refresh();
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

button {
  --padding: 5;

  position: absolute;
  top: calc((var(--position-y) - var(--padding)) * 1px);
  left: calc((var(--position-x) - var(--padding)) * 1px);
  width: calc((var(--dimension-x) + var(--padding) * 2) * 1px);
  height: calc((var(--dimension-y) + var(--padding) * 2) * 1px);
  padding: 0;
  appearance: none;
  background: transparent;
  border: none;
  outline: none;

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
