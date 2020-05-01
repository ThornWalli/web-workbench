<template>
  <div class="wb-disks-extras13-web-painting" :class="styleClasses" :style="style">
    <div ref="displays" class="web-painting__displays">
      <wb-display v-for="display in displays" :key="display.id" :model="display" />
    </div>
    <div class="web-painting__sidebar">
      <wb-brush-select class="web-painting__brush-select" :model="brushSelect" />
      <wb-tool-select class="web-painting__tool-select" :model="toolSelect" />
      <wb-color-select class="web-painting__color-select" :model="colorSelect" />
    </div>
    <wb-debug v-if="debug" class="web-painting__debug" :model="model.app" />
  </div>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import Color from '../../../web-workbench/classes/Color';
import scrollBar from '../../../web-workbench/services/dom';
import Bounds from '@/web-workbench/disks/extras13/webPainting/lib/Bounds';
import ContextMenuItems from '@/web-workbench/classes/ContextMenuItems';
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
      type: Object,
      default: null
    }
  },
  data () {
    if (!this.model) {
      const contentLayout = this.core.modules.screen.contentLayout;
      this.model = {
        app: new App(new Bounds(contentLayout.position, ipoint(() => contentLayout.position + contentLayout.size)))
      };
    }

    return {
      debug: false,
      ready: false,
      cursor: null
    };
  },

  computed: {
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    contentLayout () {
      return this.core.modules.screen.contentLayout;
    },
    app () {
      return this.model.app;
    },
    colorSelect () {
      return this.app.colorSelect;
    },
    colorSelectPrimaryColor () {
      return this.colorSelect.primaryColor;
    },
    colorSelectSecondaryColor () {
      return this.colorSelect.secondaryColor;
    },
    brushSelect () {
      return this.app.brushSelect;
    },
    brushSelectIndex () {
      return this.brushSelect.index;
    },
    brushSelectSize () {
      return this.brushSelect.size;
    },
    toolSelect () {
      return this.app.toolSelect;
    },
    toolSelectIndex () {
      return this.toolSelect.index;
    },
    displays () {
      return this.app.displays;
    },
    displaySplit () {
      return this.app.displaySplit;
    },
    style () {
      return {
        '--scroll-bar-size': `${scrollBar.size}`,
        '--cursor': `url(${this.cursor})`
      };
    },
    styleClasses () {
      return {
        'js--ready': this.ready,
        [`js--display-${this.app.displays.length}`]: true
      };
    }
  },

  watch: {
    toolSelectIndex () {
      this.app.setTool(this.toolSelect);
      this.renderCursor();
    },
    brushSelectIndex () {
      this.app.setBrush(this.brushSelect);
      this.renderCursor();
    },
    brushSelectSize (value) {
      this.app.setBrushSize(value);
      this.renderCursor();
    },
    colorSelectPrimaryColor (color) {
      this.app.primaryColor = color;
      this.renderCursor();
    },
    colorSelectSecondaryColor (color) {
      this.app.secondaryColor = color;
    },
    displaySplit (index) {
      this.createDisplays();
    }
  },

  mounted () {
    this.app.setDisplaysElement(this.$refs.displays);

    this.app.refresh();
    this.createDisplays();

    this.renderCursor();

    this.$nextTick(() => {
      this.ready = true;
    });

    console.log('APP', this.model);
  },
  methods: {
    renderCursor () {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 22;
      const ctx = canvas.getContext('2d');

      const position = ipoint(canvas.width / 2, canvas.height / 2);
      const cursorColor = new Color(0, 0, 0);

      ctx.globalCompositeOperation = 'source-over';

      ctx.fillStyle = cursorColor.toRGBA();
      ctx.fillRect(position.x - 11, position.y - 1, 8, 2);
      ctx.fillRect(position.x + 3, position.y - 1, 8, 2);
      ctx.fillRect(position.x - 1, position.y - 11, 2, 8);
      ctx.fillRect(position.x - 1, position.y + 3, 2, 8);

      let scale = 1;
      ctx.fillStyle = this.colorSelectPrimaryColor.toRGBA();
      scale = Math.min(this.brushSelectSize, 2);

      ctx.fillRect(position.x - 1, position.y - 1, scale, scale);

      this.cursor = canvas.toDataURL();
    },
    createDisplays () {
      this.app.clearDisplays();
      for (let i = 0; i <= this.app.displaySplit; i++) {
        this.app.addDisplay();
      }
      this.$nextTick(() => {
        this.app.refreshDisplayPositions();
        this.app.refreshDisplays();
      });
    }

  }
};
</script>

<style lang="postcss">
.wb-disks-extras13-web-painting {
  --color__webPainting__border: #fff;

  /* dynamic var */
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
    /* cursor: url("~assets/img/cursor/crosshair.png") 11 11, auto !important; */
    cursor: var(--cursor) 11 11, auto !important;
  }

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
      border: solid var(--color__webPainting__border) 0;
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
  }

  & .web-painting__color-select {
    position: absolute;
    top: 258px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;

    & > ul {
      width: calc(100% + var(--scroll-bar-size) * 1px);
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>

