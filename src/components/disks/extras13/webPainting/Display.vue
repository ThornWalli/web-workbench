<template>
  <div class="wb-disks-extras13-web-painting-display" :style="style">
    <div ref="displayWrapper" class="display__wrapper">
      {{ this.model.zoomFactor }}
      <canvas ref="canvas" class="display__canvas" v-bind="canvasAttrs" />
    </div>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import Display from '../../../../web-workbench/disks/extras13/webPainting/lib/Display';

export default {
  props: {
    model: {
      type: Display,
      default () {
        return new Display();
      }
    }
  },

  computed: {
    canvasSize () {
      return ipoint(() => this.model.app.canvas.size * (this.model.zoomFactor + 1));
    },
    style () {
      return Object.assign(this.canvasSize.toCSSVars('size'));
    },
    canvasAttrs () {
      // if (!this.model.app.canvas) {
      //   return {
      //     width: null,
      //     height: null
      //   };
      // }
      return {
        width: this.canvasSize.x,
        height: this.canvasSize.y
      };
    },
    size () {
      return this.model.size;
    },
    zoomFactor () {
      return this.model.zoomFactor;
    }
  },
  watch: {
    size () {
      this.model.refresh();
    }
    // zoomFactor () {
    //   this.model.refresh();
    // }
  },
  mounted () {
    this.model.setCanvas(this.$refs.canvas);
  },
  destroyed () {
    return this.model.destroy();
  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting-display {
  --window-background: #fff;

  & .display__wrapper {
    width: calc(var(--size-x) * 1px);
    height: calc(var(--size-y) * 1px);
  }

  & .display__canvas {
    width: 100%;
    height: 100%;

    /* cursor: '~assets/img/cursor/crosshair-brush.png' 11 11, auto !important; */

    cursor: none;
    user-select: none;
    background: var(--window-background);
  }
}
</style>
