<template>
  <div class="wb-components-window-wrapper">
    <slot />
    <template v-if="wrapper && ready">
      <wb-env-window
        v-for="window in sortedWindows"
        :key="window.id"
        v-bind="window"
        @ready="onReadyWindow"
        @focused="onFocusedWindow"
        @close="onCloseWindow"
        @up="onUpWindow"
        @down="onDownWindow"
      />
    </template>
  </div>
</template>

<story
  name="WindowWrapper"
  group="Environments"
  knobs="{}">
  <WindowWrapper />
</story>

<script>
import { ipoint } from '@js-basics/vector';
import domEvents from '../../web-workbench/services/domEvents';
import WbEnvWindow from '@/components/environments/Window';
import webWorkbench from '@/web-workbench';
import WindowWrapper from '@/web-workbench/classes/WindowWrapper';

export default {
  components: { WbEnvWindow },
  props: {
    core: {
      type: Object,
      default () {
        return webWorkbench;
      }
    },
    wrapper: {
      type: WindowWrapper,
      default () {
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
  data () {
    return {
      ready: false,
      screenModul: this.core.modules.screen
    };
  },
  computed: {
    contentLayoutSize () {
      return this.screenModul.contentLayout.size;
    },
    sortedWindows () {
      const models = this.wrapper.models;
      return models.sort((a, b) => {
        if (a.layout.zIndex > b.layout.zIndex) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  },
  watch: {
    contentLayoutSize (size) {
      this.wrapper.layout.size = size;
    },
    wrapper () {
      this.onResize();
    }
  },
  mounted () {
    this.subscribtions = [
      domEvents.resize.subscribe(this.onResize)
    ];
    this.onResize();
    this.ready = true;
  },
  destroyed () {
    this.subscribtions.forEach(subscribtion => subscribtion.unsubscribe());
  },

  methods: {
    onResize () {
      const { x, y, width, height } = this.$el.getBoundingClientRect();
      this.wrapper.layout.position = ipoint(x, y);
      this.wrapper.layout.size = ipoint(width, height);
    },

    onReadyWindow (window) {
      this.wrapper.get(window.id).ready();
    },

    onFocusedWindow (window, focused) {
      if (focused) {
        this.wrapper.get(window.id).focus();
      }
    },

    onUpWindow (window) {
      this.wrapper.setWindowUpDown(window.id, false);
    },

    onDownWindow (window) {
      this.wrapper.setWindowUpDown(window.id, true);
    },

    onCloseWindow (window, arg) {
      this.wrapper.get(window.id).close(arg);
    }

  }
};
</script>

<style lang="postcss">

.wb-components-window-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>
