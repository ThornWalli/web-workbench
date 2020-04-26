<template>
  <div class="wb-disks-extras13-web-painting" :class="styleClasses" :style="style">
    <div ref="displays" class="web-painting__displays">
      <wb-display v-for="display in displays" :key="display.id" :model="display" />

      <div v-if="true || showDisplayOffset" class="web-painting__displays__offset" v-html="formattedOffset" />
    </div>
    <div class="web-painting__sidebar">
      <wb-brush-select class="web-painting__brush-select" :model="brushSelect" />
      <wb-tool-select class="web-painting__tool-select" :model="toolSelect" />
      <wb-color-select class="web-painting__color-select" :model="colorSelect" />
    </div>
    <wb-debug v-if="debug" class="web-painting__debug" :model="model" />
  </div>
</template>

<script>

import { ipoint, point } from '@js-basics/vector';
import Bounds from '@/web-workbench/disks/extras13/webPainting/lib/Bounds';
import contextMenu from '@/web-workbench/disks/extras13/webPainting/contextMenu';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

import WbDisplay from '@/components/disks/extras13/webPainting/Display';
import WbBrushSelect from '@/components/disks/extras13/webPainting/BrushSelect';
import WbToolSelect from '@/components/disks/extras13/webPainting/ToolSelect';
import WbColorSelect from '@/components/disks/extras13/webPainting/ColorSelect';
import WbDebug from '@/components/disks/extras13/webPainting/Debug';

import App from '@/web-workbench/disks/extras13/webPainting/lib/App';

const MAX_DISPLAYS = 4;

export default {
  components: {
    WbDisplay,
    WbBrushSelect,
    WbToolSelect,
    WbColorSelect,
    WbDebug
  },
  mixins: [
    MixinWindowComponent
  ],

  props: {
    parentLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(0, 0),
          position: ipoint(0, 0)
        };
      }
    }
  },
  data () {
    const contentLayout = this.core.modules.screen.contentLayout;
    const model = new App(new Bounds(contentLayout.position, ipoint(() => contentLayout.position + contentLayout.size)));

    return {
      model,
      debug: true,

      ready: false,

      displayCount: 0,
      displayWrapperSize: ipoint(),

      showDisplayOffset: false

    };
  },

  computed: {
    contextMenu () {
      return contextMenu({ core: this.core, model: this.model });
    },
    contentLayout () {
      return this.core.modules.screen.contentLayout;
    },
    colorSelect () {
      return this.model.colorSelect;
    },
    colorSelectPrimaryColor () {
      return this.colorSelect.primaryColor;
    },
    colorSelectSecondaryColor () {
      return this.colorSelect.secondaryColor;
    },
    brushSelect () {
      return this.model.brushSelect;
    },
    brushSelectIndex () {
      return this.model.brushSelect.index;
    },
    brushSelectSize () {
      return this.model.brushSelect.size;
    },
    toolSelect () {
      return this.model.toolSelect;
    },
    toolSelectIndex () {
      return this.toolSelect.index;
    },
    displays () {
      return this.model.displays;
    },
    displaySplit () {
      return this.model.displaySplit;
    },

    displayOffset () {
      if (this.model.display) {
        return this.model.display.offset;
      }
      return null;
    },
    formattedOffset () {
      if (this.model.display) {
        const { x, y } = this.displayOffset;
        return `X: ${x} / ${this.model.canvas.size.x}<br />Y: ${y} / ${this.model.canvas.size.y}`;
      }
      return null;
    },

    style () {
      return Object.assign({
        '--window-background': this.model.options.windowBackground
      });
    },
    styleClasses () {
      return {
        'js--ready': this.ready,
        [`js--display-${this.model.displays.length}`]: true
      };
    }
  },

  watch: {
    toolSelectIndex () {
      this.model.setTool(this.toolSelect);
    },
    brushSelectIndex () {
      this.model.setBrush(this.brushSelect);
    },
    brushSelectSize (value) {
      this.model.setBrushSize(value);
    },
    colorSelectPrimaryColor (color) {
      this.model.primaryColor = color;
    },
    colorSelectSecondaryColor (color) {
      this.model.secondaryColor = color;
    },
    displaySplit (index) {
      this.createDisplays();
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
  },

  mounted () {
    this.displayWrapperSize = ipoint(this.$refs.displays.offsetWidth, this.$refs.displays.offsetHeight);

    this.createDisplays();

    this.$nextTick(() => {
      this.ready = true;
    });

    console.log('APP', this.model);
  },
  methods: {
    createDisplays () {
      this.model.clearDisplays();
      for (let i = 0; i <= this.model.displaySplit; i++) {
        this.model.addDisplay();
      }
      this.$nextTick(() => {
        this.refreshDisplayPositions();
        this.model.refreshDisplays();
      });
    },

    refreshDisplayPositions () {
      const width = this.$refs.displays.offsetWidth;
      const height = this.$refs.displays.offsetHeight;
      let positions = [
        [
          [
            1, 1
          ]
        ], [
          [
            0.5, 1
          ], [
            0.5, 1
          ]
        ], [
          [
            1, 0.5
          ], [
            1, 0.5
          ]
        ], [
          [
            1, 0.5
          ], [
            0.5, 0.5
          ], [
            0.5, 0.5
          ]
        ], [
          [
            0.5, 0.5
          ], [
            0.5, 0.5
          ], [
            1, 0.5
          ]
        ], [
          [
            0.5, 0.5
          ], [
            0.5, 0.5
          ], [
            0.5, 0.5
          ], [
            0.5, 0.5
          ]
        ]
      ].filter((position) => {
        if (position.length === this.displays.length) {
          return position;
        }
      });
      positions = positions[0];
      this.displays.forEach((display, i) => {
        display.size = point(width * positions[Number(i)][0], height * positions[Number(i)][1]);
        // border
        if (positions[Number(i)][0] < 1) {
          display.size.x--;
        }
        if (positions[Number(i)][1] < 1) {
          display.size.y--;
        }
      });
    }

  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting {
  --background-default: #000;
  --color-default: #fff;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background: var(--workbenchColor_3);

  &.js--display-2 {
    & div:nth-child(1) {
      border-right-width: 1px;
    }

    & div:nth-child(2) {
      border-left-width: 1px;
    }
  }

  & .web-painting__displays__offset {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px;
    text-align: right;
    mix-blend-mode: difference;
  }

  & .web-painting__displays {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 50px);
    height: 100%;
    clear: fix;
    background: var(--background-default);
    border-right-width: 0;

    & > div {
      float: left;
      border: solid var(--workbenchColor_1) 0;
    }
  }

  &.js--display-3 {
    & .web-painting__displays {
      & div:nth-child(1) {
        border-bottom-width: 1px;
      }

      & div:nth-child(2) {
        border-right-width: 1px;

        &,
        & + div {
          border-top-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }
    }
  }

  &.js--display-4 {
    & .web-painting__displays {
      /* div:nth-child(1) {
            border-bottom-width: 1px;
          } */
      & div:nth-child(1) {
        border-right-width: 1px;

        &,
        & + div {
          border-bottom-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }

      & div:nth-child(3) {
        border-right-width: 1px;

        &,
        & + div {
          border-top-width: 1px;
        }

        & + div {
          border-left-width: 1px;
        }
      }
    }
  }

  & .web-painting__sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;

    &,
    & * {
      cursor: url("~assets/img/cursor/crosshair.png") 11 11, auto !important;
    }
  }

  & .web-painting__color-select {
    position: absolute;
    top: 258px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    background: var(--workbenchColor_3);

    & > ul {
      width: calc(100% + 16px);
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>

