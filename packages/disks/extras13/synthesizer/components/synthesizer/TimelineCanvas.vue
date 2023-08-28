<template>
  <canvas></canvas>
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

      gridRenderer: null,

      dimension: ipoint(0, 0)
    };
  },
  watch: {
    noteSheet: {
      handler() {
        this.render();
      }
    },
    dimension({ x, y }) {
      this.$el.width = this.timelineRenderer.dimension.x || x;
      this.$el.height = this.timelineRenderer.dimension.y || y;
      this.timelineRenderer.render();
    }
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.timelineRenderer = new TimelineRenderer(this.$el, this.noteSheet, {
        notes: this.noteSheet.track.notes.map(v => new NoteDescription(v)),
        ...this.options
      });
      const { x, y, width, height } = this.$el.getBoundingClientRect();
      console.log(x, y, width, height);
      this.dimension = ipoint(width, height);
    }
  }
};
</script>

<style lang="postcss" scoped>
canvas {
  display: block;
  width: 100%;
}

div {
  /* height: 100%; */

  /* overflow: hidden; */
}
</style>
