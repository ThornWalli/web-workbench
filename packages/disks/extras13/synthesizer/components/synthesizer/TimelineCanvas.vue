<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';

import NoteDescription from '../../classes/NoteDescription';
import TimelineRenderer from '../../classes/TimelineRenderer';
import NoteSheet from '../../classes/NoteSheet';
import Track from '../../classes/Track';
export default {
  props: {
    track: {
      type: Track,
      required: true
    }
  },
  data() {
    return {
      noteSheet: null,
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        highlight: '#ffaa55'
      },
      options: {
        beatCount: 2
      },

      gridRenderer: null,

      dimension: ipoint(0, 0)
    };
  },
  watch: {
    dimension({ x, y }) {
      this.$refs.canvas.width = this.timelineRenderer.dimension.x || x;
      this.$refs.canvas.height = this.timelineRenderer.dimension.y || y;
      this.timelineRenderer.render();
    }
  },
  mounted() {
    this.noteSheet = new NoteSheet(this.track, {
      noteIndex: 1
    });
    this.timelineRenderer = new TimelineRenderer(
      this.$refs.canvas,
      this.noteSheet,
      {
        notes: this.track.notes.map(v => new NoteDescription(v)),
        ...this.options
      }
    );
    const { width, height } = this.$refs.canvas.getBoundingClientRect();
    this.dimension = ipoint(width, height);
  }
};
</script>

<style lang="postcss" scoped>
div {
  /* background: #fff; */
}

canvas {
  display: block;
  width: 100%;

  /* background: #fff; */
}
</style>
