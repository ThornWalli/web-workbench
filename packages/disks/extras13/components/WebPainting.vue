<template>
  <div class="wb-disks-extras13-web-painting" :class="styleClasses" :style="style">
    <div ref="displays" class="displays">
      <wb-display v-for="display in appDisplays" :key="display.id" :model="display" />
    </div>
    <div class="sidebar">
      <wb-brush-select class="brush-select" :model="brushSelect" />
      <wb-tool-select class="tool-select" :model="toolSelect" />
      <wb-color-select class="color-select" :model="colorSelect" />
    </div>
    <wb-debug v-if="debug" class="debug" :model="model.app" />
  </div>
</template>

<script>

import { Subscription } from 'rxjs';
import { toRaw, toRef } from 'vue';
import { ipoint } from '@js-basics/vector';
import scrollBar from '@web-workbench/core/services/dom';
import { getLayoutFromElement } from '@web-workbench/core/utils/layout';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import App from '../webPainting/lib/App';
import Bounds from '../webPainting/lib/Bounds';

import contextMenu from '../webPainting/contextMenu';

import WbDebug from './webPainting/Debug';
import WbColorSelect from './webPainting/ColorSelect';
import WbToolSelect from './webPainting/ToolSelect';
import WbBrushSelect from './webPainting/BrushSelect';
import WbDisplay from './webPainting/Display';

export default {
  components: {
    WbDisplay,
    WbBrushSelect,
    WbToolSelect,
    WbColorSelect,
    WbDebug
  },

  props: {
    ...windowProps,
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
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return {
      ...windowContext,
      appDisplays: props.model.app.displays
    };
  },

  data () {
    if (!this.model) {
      this.model = {
        app: new App()
      };
    }

    return {
      brushSelect: this.model.app.brushSelect,
      toolSelect: this.model.app.toolSelect,
      subscription: new Subscription(),
      debug: false,
      ready: false,
      cursor: null
    };
  },

  computed: {
    contentLayout () {
      return this.core.modules.screen.contentLayout;
    },
    app () {
      return toRaw(this.model.app);
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
    brushSelectIndex () {
      return this.brushSelect.index;
    },
    brushSelectSize () {
      return this.brushSelect.size;
    },
    toolSelectIndex () {
      return this.toolSelect.index;
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
        ready: this.ready,
        [`display-${this.appDisplays.length}`]: true
      };
    }
  },

  watch: {
    parentFocused (focused) {
      this.setCursor(focused);
    },
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
    displaySplit () {
      this.createDisplays();
    }
  },

  mounted () {
    this.app.setDisplaysElement(this.$refs.displays);

    this.app.refresh();
    this.createDisplays();

    this.renderCursor();

    this.$nextTick(() => {
      const layout = getLayoutFromElement(this.$el.parentElement);
      this.app.updateGlobalBounds(new Bounds(layout.position, ipoint(() => (layout.position + layout.size))));
      this.setCursor(this.parentFocused);
      this.ready = true;
    });
  },

  unmounted () {
    this.core.modules.screen.cursor.setCurrent(null);
    this.subscription.unsubscribe();
  },

  methods: {
    setCursor (active) {
      this.core.modules.screen.cursor.setCurrent(active ? CURSOR_TYPES.CROSSHAIR : null);
    },
    renderCursor () {
      this.core.modules.screen.cursor.current.focusColor = this.colorSelectPrimaryColor.toRGBA();
      this.core.modules.screen.cursor.current.focusSize = Math.min(this.brushSelectSize, 2);
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

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting {
  --color-web-painting-border: #fff;

  /* dynamic var */
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
    /* cursor: url("@/assets/img/cursor/crosshair.png") 11 11, auto !important; */

    /* cursor: var(--cursor) 11 11, auto !important; */

    cursor: none;
  }

  &.display-2 {
    & div:nth-child(1) {
      border-right-width: 1px;
    }

    & div:nth-child(2) {
      border-left-width: 1px;
    }
  }

  & .displays {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 50px);
    height: 100%;
    clear: fix;
    border-right-width: 0;

    & > div {
      float: left;
      border: solid var(--color-web-painting-border) 0;
    }
  }

  &.display-3 {
    & .displays {
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

  &.display-4 {
    & .displays {
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

  & .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
  }

  & .color-select {
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

