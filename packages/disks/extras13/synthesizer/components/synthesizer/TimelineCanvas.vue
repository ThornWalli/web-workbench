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
      :style="{
        ...position.toCSSVars('position'),
        ...noteDimension.toCSSVars('dimension')
      }"
      @click="onClickNote(note)"></i>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';

import NoteDescription from '../../classes/NoteDescription';
import TimelineRenderer from '../../classes/TimelineRenderer';
import NoteSheet from '../../classes/NoteSheet';
export default {
  props: {
    noteSheet: {
      type: NoteSheet,
      required: true
    }
  },
  emits: ['note:click'],
  data() {
    return {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        highlight: '#ffaa55'
      },
      options: {
        beatCount: 2
      },

      renderResult: null,
      gridRenderer: null,

      dimension: ipoint(0, 0)
    };
  },
  computed: {
    notes() {
      return this.noteSheet.track.notes;
    }
  },
  watch: {
    notes: {
      handler() {
        this.render();
      }
    },
    noteSheet: {
      handler() {
        this.render();
      }
    },
    async dimension({ x, y }) {
      this.$refs.canvas.width = this.timelineRenderer.dimension.x || x;
      this.$refs.canvas.height = this.timelineRenderer.dimension.y || y;
      this.renderResult = await this.timelineRenderer.render();
    }
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.timelineRenderer = new TimelineRenderer(
        this.$refs.canvas,
        this.noteSheet,
        {
          notes: this.noteSheet.track.notes.map(v => new NoteDescription(v)),
          ...this.options
        }
      );
      const { width, height } = this.$refs.canvas.getBoundingClientRect();
      this.dimension = ipoint(width, height);
    },
    onClickNote(note) {
      this.$emit('note:click', note);
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
  position: absolute;
  top: calc(var(--position-y) * 1px);
  left: calc(var(--position-x) * 1px);
  width: calc(var(--dimension-x) * 1px);
  height: calc(var(--dimension-y) * 1px);

  /* border: solid #fa5 1px; */
}

div {
  position: relative;

  /* height: 100%; */

  /* overflow: hidden; */
}
</style>
