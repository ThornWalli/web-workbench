<template>
  <div class="wb-disks-extras13-web-painting-display" :style="style">
    <div ref="displayWrapper" class="wrapper">
      <canvas ref="canvas" class="canvas" v-bind="canvasAttrs" />
    </div>
    <div v-if="true || showDisplayInfo" class="info" v-html="info" />
  </div>
</template>

<script>
import { Subscription, filter } from 'rxjs';
import { markRaw } from 'vue';
import { ipoint } from '@js-basics/vector';
import Display from '../../../../web-workbench/disks/extras13/webPainting/lib/Display';

export default {
  props: {
    model: {
      type: Display,
      default () {
        return markRaw(new Display());
      }
    }
  },
  data () {
    return {
      zoomFactor: this.model.zoomFactor,
      maxZoomFactor: this.model.maxZoomFactor,
      size: ipoint(),
      subscription: new Subscription(),
      showDisplayInfo: false
    };
  },
  computed: {
    canvasSize () {
      return ipoint(() => this.model.app.canvas.size * this.zoomFactor);
    },

    style () {
      return Object.assign({
        '--display-foreground': this.model.app.options.display.foreground,
        '--display-background': this.model.app.options.display.background
      },
      this.size.toCSSVars('size'),
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

    info () {
      let { x, y } = this.displayOffset;
      x = [
        -this.model.zoomBounds.min.x,
        x,
        this.model.canvasLayout.naturalSize.x - this.model.zoomBounds.max.x
      ].join('/');
      y = [
        -this.model.zoomBounds.min.y,
        y,
        this.model.canvasLayout.naturalSize.y - this.model.zoomBounds.max.y
      ].join('/');

      return `${this.zoomFactor}/${this.maxZoomFactor} Z&nbsp;<br />${x} X&nbsp;<br />${y} Y&nbsp;`;
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
        window.clearTimeout(this.test);
        this.showDisplayOffset = true;
        this.test = window.setTimeout(() => {
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

    this.subscription.add(
      this.model.events.pipe(filter(({ name }) => name === 'change:size')).subscribe(() => {
        this.size = this.model.size;
      }),
      this.model.events.pipe(filter(({ name }) => name === 'change:zoomFactor')).subscribe(() => {
        this.zoomFactor = this.model.zoomFactor;
        this.maxZoomFactor = this.model.maxZoomFactor;
      })

    );
  },

  unmounted () {
    return this.model.destroy();
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-display {
  --display-background: #000;
  --display-foreground: #fff;

  position: relative;
  width: calc(var(--size-x) * 1px);
  height: calc(var(--size-y) * 1px);
  background: var(--display-background);

  & .wrapper {
    position: relative;
    top: calc(var(--canvas-position-y) * 1px);
    left: calc(var(--canvas-position-x) * 1px);
    width: calc(var(--canvas-size-x) * 1px);
    height: calc(var(--canvas-size-y) * 1px);
  }

  & .canvas {
    width: 100%;
    height: 100%;
    cursor: none;
    user-select: none;
    background: var(--display-foreground);
  }

  & .info {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    text-align: right;
  }
}
</style>
