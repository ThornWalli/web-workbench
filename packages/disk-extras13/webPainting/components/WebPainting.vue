<template>
  <div
    class="wb-disks-extras13-web-painting"
    :class="styleClasses"
    :style="style">
    <div ref="displays" class="displays">
      <wb-display
        v-for="display in model.app.displays"
        :key="display.id"
        :model="display" />
    </div>
    <div class="sidebar">
      <wb-brush-select v-model="brushSelect" class="brush-select" />
      <wb-tool-select v-model="toolSelect" class="tool-select" />
      <wb-color-select v-model="colorSelect" class="color-select" />
    </div>
    <wb-debug v-if="debug" :model-value="model.app" class="debug" />
  </div>
</template>

<script>
import { Subscription } from 'rxjs';
import { toRef } from 'vue';
import { ipoint } from '@js-basics/vector';
import scrollBar from '@web-workbench/core/services/dom';
import { getLayoutFromElement } from '@web-workbench/core/utils/layout';
import { CURSOR_TYPES } from '@web-workbench/core/classes/Cursor';

import App from '../lib/App';
import Bounds from '../lib/Bounds';

import contextMenu from '../contextMenu';

import WbDebug from './webPainting/Debug';
import WbColorSelect from './webPainting/ColorSelect';
import WbToolSelect from './webPainting/ToolSelect';
import WbBrushSelect from './webPainting/BrushSelect';
import WbDisplay from './webPainting/Display';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbDisplay,
    WbBrushSelect,
    WbToolSelect,
    WbColorSelect,
    WbDebug
  },

  props: {
    parentLayout: {
      type: Object,
      default() {
        return {
          size: ipoint(0, 0),
          position: ipoint(0, 0)
        };
      }
    },
    model: {
      type: Object,
      default() {
        return {
          app: new App()
        };
      }
    }
  },

  setup(props) {
    const model = toRef(props, 'model');
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return {
      ...windowContext
    };
  },

  data() {
    return {
      subscription: new Subscription(),
      debug: false,
      ready: false,
      cursor: null
    };
  },

  computed: {
    colorSelect: {
      get() {
        return this.model.app.colorSelect;
      },
      set(value) {
        this.model.app.setColorSelect(value);
      }
    },
    brushSelect: {
      get() {
        return this.model.app.brushSelect;
      },
      set(value) {
        this.model.app.setBrushSelect(value);
      }
    },
    toolSelect: {
      get() {
        return this.model.app.toolSelect;
      },
      set(value) {
        this.model.app.setToolSelect(value);
      }
    },
    contentLayout() {
      return this.core.modules.screen.contentLayout;
    },
    brushSelectIndex() {
      return this.brushSelect.index;
    },
    brushSelectSize() {
      return this.brushSelect.size;
    },
    toolSelectIndex() {
      return this.toolSelect.index;
    },
    displaySplit() {
      return this.model.app.displaySplit;
    },
    style() {
      return {
        '--scroll-bar-size': `${scrollBar.size}`,
        '--cursor': `url(${this.cursor})`
      };
    },
    styleClasses() {
      return {
        ready: this.ready,
        [`display-${this.model.app.displays.length}`]: true
      };
    }
  },

  watch: {
    parentFocused(focused) {
      this.setCursor(focused);
    },
    toolSelectIndex() {
      this.model.app.setTool(this.toolSelect);
      this.renderCursor();
    },
    brushSelectIndex() {
      this.model.app.setBrush(this.brushSelect);
      this.renderCursor();
    },
    brushSelectSize(value) {
      this.model.app.setBrushSize(value);
      this.renderCursor();
    },
    ['colorSelect.primaryColor']() {
      this.renderCursor();
    },
    displaySplit() {
      this.createDisplays();
    }
  },

  mounted() {
    this.model.app.setDisplaysElement(this.$refs.displays);

    this.model.app.refresh();
    this.createDisplays();

    this.renderCursor();

    this.$nextTick(() => {
      const layout = getLayoutFromElement(this.$el.parentElement);
      this.model.app.updateGlobalBounds(
        new Bounds(
          layout.position,
          ipoint(() => layout.position + layout.size)
        )
      );
      this.setCursor(this.parentFocused);
      this.ready = true;
    });
  },

  unmounted() {
    this.core.modules.screen.cursor.setCurrent(null);
    this.subscription.unsubscribe();
  },

  methods: {
    setCursor(active) {
      this.core.modules.screen.cursor.setCurrent(
        active ? CURSOR_TYPES.CROSSHAIR : null
      );
    },
    renderCursor() {
      const currentCursor = this.core.modules.screen.cursor.current;
      currentCursor.color = this.colorSelect.primaryColor.toRGBA();
      currentCursor.size = Math.min(this.brushSelectSize, 2);
    },
    createDisplays() {
      this.model.app.clearDisplays();
      for (let i = 0; i <= this.model.app.displaySplit; i++) {
        this.model.app.addDisplay();
      }
      this.$nextTick(() => {
        this.model.app.refreshDisplayPositions();
        this.model.app.refreshDisplays();
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting {
  --color-web-painting-border: #fff;
  --scroll-bar-size: 0;

  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &,
  & * {
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
    clear: fix;
    width: calc(100% - 50px);
    height: 100%;
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
