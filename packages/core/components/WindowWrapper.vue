<template>
  <div class="wb-components-window-wrapper">
    <slot />
    <template v-if="wrapper && ready">
      <wb-env-window
        v-for="window in sortedWindows"
        :key="window.id"
        v-bind="getWindowProps(window)"
        @ready="onReadyWindow"
        @focused="onFocusedWindow"
        @close="onCloseWindow"
        @up="onUpWindow"
        @down="onDownWindow" />
    </template>
  </div>
</template>

<script>
import { Subscription } from 'rxjs';
import { markRaw } from 'vue';
import { ipoint } from '@js-basics/vector';
import webWorkbench from '@web-workbench/core';
import domEvents from '../services/domEvents';

import WindowWrapper from '../classes/WindowWrapper';
import WbEnvWindow from './Window';

export default {
  components: { WbEnvWindow },
  props: {
    parentLayout: {
      type: Object,
      default() {
        return {
          size: ipoint(window.innerWidth, window.innerHeight)
        };
      }
    },

    core: {
      type: Object,
      default() {
        return webWorkbench;
      }
    },
    wrapper: {
      type: WindowWrapper,
      default() {
        return new WindowWrapper(webWorkbench, [
          {
            title: 'Test',
            layout: {
              position: ipoint(400, 400),
              size: ipoint(640, 400)
            },
            scrollX: false
          }
        ]);
      }
    }
  },

  data() {
    return {
      subscription: new Subscription(),
      ready: false,
      screenModul: markRaw(this.core.modules.screen)
    };
  },
  computed: {
    contentLayoutSize() {
      return this.screenModul.contentLayout.size;
    },
    sortedWindows() {
      return Array.from(this.wrapper.models.value).sort(
        (a, b) => a.layout.zIndex - b.layout.zIndex
      );
    }
  },

  watch: {
    parentLayout: {
      deep: true,
      handler() {
        this.refresh();
      }
    },
    contentLayoutSize(size) {
      this.wrapper.layout.size = size;
    },
    wrapper() {
      this.refresh();
    }
  },

  async mounted() {
    this.subscription.add(domEvents.resize.subscribe(this.onRefresh));
    await this.refresh(true);
    this.ready = true;
  },

  unmounted() {
    this.subscription.unsubscribe();
  },

  methods: {
    getWindowProps(window) {
      const {
        id,
        layout,
        sidebarComponent,
        sidebarComponentData,
        component,
        componentData,
        symbolWrapper
      } = window;
      return {
        window,
        id,
        wrapper: this.wrapper,
        layout,
        sidebarComponent,
        sidebarComponentData,
        component,
        componentData,
        symbolWrapper
      };
    },

    refresh(force) {
      if (force) {
        this.onRefresh();
        return Promise.resolve();
      }
      return new Promise(resolve => {
        this.$nextTick(() => {
          window.setTimeout(() => {
            this.onRefresh();
            resolve();
          }, 500);
        });
      });
    },
    onRefresh() {
      const { x, y, width, height } = this.$el.getBoundingClientRect();
      this.wrapper.layout.position = ipoint(x, y);
      this.wrapper.layout.size = ipoint(width, height);
    },

    onReadyWindow(window) {
      this.wrapper.get(window.id).ready();
    },

    onFocusedWindow(window, focused) {
      if (focused) {
        this.wrapper.get(window.id).focus();
      }
    },

    onUpWindow(window) {
      this.wrapper.setWindowUpDown(window.id, false);
    },

    onDownWindow(window) {
      this.wrapper.setWindowUpDown(window.id, true);
    },

    onCloseWindow(window, arg) {
      this.wrapper.get(window.id).close(arg);
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-components-window-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
