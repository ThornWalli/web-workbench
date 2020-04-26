<template>
  <div class="wb-disks-extras13-web-painting" :class="styleClasses">
    <div ref="displays" class="web-painting__displays">
      <wb-display v-for="display in displays" :key="display.id" :model="display" />
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

import { ipoint } from '@js-basics/vector';
import Bounds from '@/web-workbench/disks/extras13/webPainting/lib/Bounds';
import contextMenu from '@/web-workbench/disks/extras13/webPainting/contextMenu';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

import WbDisplay from '@/components/disks/extras13/webPainting/Display';
import WbBrushSelect from '@/components/disks/extras13/webPainting/BrushSelect';
import WbToolSelect from '@/components/disks/extras13/webPainting/ToolSelect';
import WbColorSelect from '@/components/disks/extras13/webPainting/ColorSelect';
import WbDebug from '@/components/disks/extras13/webPainting/Debug';

import App from '@/web-workbench/disks/extras13/webPainting/lib/App';

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
    },
    model: {
      type: App,
      default: null
    }
  },
  data () {
    if (!this.model) {
      const contentLayout = this.core.modules.screen.contentLayout;
      this.model = new App(new Bounds(contentLayout.position, ipoint(() => contentLayout.position + contentLayout.size)));
    }

    return {
      debug: false,
      ready: false
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
    }
  },

  mounted () {
    this.model.setDisplaysElement(this.$refs.displays);

    this.model.refresh();
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
        this.model.refreshDisplayPositions();
        this.model.refreshDisplays();
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

  &.js--display-2 {
    & div:nth-child(1) {
      border-right-width: 1px;
    }

    & div:nth-child(2) {
      border-left-width: 1px;
    }
  }

  & .web-painting__displays {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 50px);
    height: 100%;
    clear: fix;
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

