<template>
  <div class="wb-disks-extras13-web-painting-display" :style="style">
    <div ref="displayWrapper" class="display__wrapper">
      <canvas ref="canvas" class="display__canvas" v-bind="canvasAttrs" />
    </div>
    <div v-if="true || showDisplayOffset" class="display__offset" v-html="formattedOffset" />
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
  data () {
    return {

      showDisplayOffset: false
    };
  },
  computed: {
    canvasSize () {
      return ipoint(() => this.model.app.canvas.size * this.model.zoomFactor);
    },
    size () {
      return this.model.size;
    },

    zoomFactor () {
      return this.model.zoomFactor;
    },

    style () {
      return Object.assign({
        '--display-foreground': this.model.app.options.display.foreground,
        '--display-background': this.model.app.options.display.background
      },
      this.model.size.toCSSVars('size'),
      this.model.canvasLayout.position.toCSSVars('canvas-position'),
      this.model.canvasLayout.size.toCSSVars('canvas-size'),
      this.model.canvasLayout.naturalSize.toCSSVars('canvas-natural-size')
      );
    },
    canvasAttrs () {
      return {
        width: this.model.canvasLayout.size.x,
        height: this.model.canvasLayout.size.y
      };
    },

    displayOffset () {
      return this.model.offset;
    },

    formattedOffset () {
      let { x, y } = this.displayOffset;
      x = [
        -this.model.zoomBounds.min.x,
        x,
        this.model.canvasLayout.naturalSize.x - this.model.zoomBounds.max.x
      ].join(' / ');
      y = [
        -this.model.zoomBounds.min.y,
        y,
        this.model.canvasLayout.naturalSize.y - this.model.zoomBounds.max.y
      ].join(' / ');
      return `${x} X&nbsp;<br />${y} Y&nbsp;`;
    }

  },
  watch: {
    size () {
      this.$nextTick(() => {
        this.model.refresh();
      });
    },
    displayOffset: {
      deep: true,
      handler (offset) {
        global.clearTimeout(this.test);
        this.showDisplayOffset = true;
        this.test = global.setTimeout(() => {
          this.showDisplayOffset = false;
        }, 500);
      }
    }
    // zoomFactor () {
    //   this.model.refresh();
    // }
  },
  mounted () {
    this.model.setElement(this.$el);
    this.model.setCanvas(this.$refs.canvas);
  },
  destroyed () {
    return this.model.destroy();
  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting-display {
  --display-background: #000;
  --display-foreground: #fff;

  width: calc(var(--size-x) * 1px);
  height: calc(var(--size-y) * 1px);
  background: var(--display-background);

  & .display__wrapper {
    position: relative;
    top: calc(var(--canvas-position-y) * 1px);
    left: calc(var(--canvas-position-x) * 1px);
    width: calc(var(--canvas-size-x) * 1px);
    height: calc(var(--canvas-size-y) * 1px);
  }

  & .display__canvas {
    width: 100%;
    height: 100%;

    /* cursor: '~assets/img/cursor/crosshair-brush.png' 11 11, auto !important; */

    cursor: none;
    user-select: none;
    background: var(--display-foreground);
  }

  & .display__offset {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    text-align: right;
    mix-blend-mode: difference;
  }
}
</style>
