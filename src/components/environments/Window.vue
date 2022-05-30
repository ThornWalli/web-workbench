<template>
  <aside
    class="wb-components-window"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown"
  >
    <div>
      <div
        ref="header"
      >
        <wb-fragments-window-header
          v-if="!options.embed"
          v-bind="header"
          @click="onClickHeader"
          @up="onClickUp"
          @down="onClickDown"
          @close="onClickClose"
        />
      </div>
      <wb-components-scroll-content
        :options="options"
        class="window__content"
        embed
        :parent-layout="layout"
        :parent-layout-size-offset="layoutSizeOffset"
        :root-layout="wrapperLayout"
        :set-trigger-refresh="triggerRefresh"
        :set-trigger-reset="triggerResetScrollContent"
        @refresh="onRefreshScrollContent"
      >
        <template #sidebarLeft>
          <component
            :is="sidebarComponent"
            v-bind="sidebarComponentData"
            class="window__content__sidebar-left"
          />
        </template>
        <template>
          <slot>
            <component
              :is="component"
              v-bind="componentData"
              :root-element="$el"
              :parent-focused="options.focused"
              :options="componentOptions"
              :parent-layout="layout"
              :set-trigger-refresh="triggerRefresh"
              :window-options="options"
              @refresh="onRefreshComponent"
              @close="onCloseComponent"
              @freeze="onFreeze"
              @unfreeze="onUnfreeze"
              @ready="onComponentReady"
            />
          </slot>
        </template>
        <template v-if="options.scale" #corner>
          <span
            class="window__helper-scale"
            touch-action="none"
            @pointerdown="onPointerDownHelperScale"
          >
            <svg-scrollbar-scale />
          </span>
        </template>
      </wb-components-scroll-content>
    </div>
  </aside>
</template>

<script>
import { filter, first } from 'rxjs/operators';
import { ipoint, calc } from '@js-basics/vector';
import domEvents from '@/web-workbench/services/domEvents';
import { closestEl, touchEvent } from '@/web-workbench/services/dom';

import WbComponentsScrollContent from '@/components/environments/ScrollContent';
import WbFragmentsWindowHeader from '@/components/environments/molecules/WindowHeader';
import SvgScrollbarScale from '@/assets/svg/control/scrollbar_scale.svg?vue-template';

const HEADER_HEIGHT = 20;
const WINDOW_BORDER_SIZE = 2;

export default {
  components: {
    SvgScrollbarScale,
    WbFragmentsWindowHeader,
    WbComponentsScrollContent
  },

  props: {

    id: {
      type: String,
      default () {
        return null;
      }
    },

    options: {
      type: Object,
      default () {
        return {
          title: 'Window Title',
          scale: true,
          scrollX: true,
          scrollY: true,
          clampX: false,
          clampY: false,
          freeze: false,
          focused: false,
          center: true,
          embed: false
        };
      }
    },

    wrapper: { type: Object, default () { return null; } },

    layout: {
      type: Object,
      default () {
        return {
          rootSize: ipoint(),
          position: ipoint(),
          size: ipoint(600, 400)
        };
      }
    },

    sidebarComponent: { type: Object, default () { return null; } },
    sidebarComponentData: { type: Object, default () { return null; } },

    component: { type: Object, default () { return null; } },
    componentData: { type: Object, default () { return null; } }
  },

  data () {
    return {
      layoutSizeOffset: ipoint(4, HEADER_HEIGHT + WINDOW_BORDER_SIZE),

      visible: true,

      sizes: {
        start: null,
        move: null
      },
      positions: {
        start: null,
        move: null
      },

      focusedSubscriptions: [],

      moving: false,
      scaling: false,

      triggerResetScrollContent: false,
      triggerRefresh: null,
      firstLayout: true,

      headerHeight: 0
    };
  },

  computed: {
    wrapperLayout () {
      if (this.wrapper) {
        return this.wrapper.layout;
      }
      return {
        size: ipoint(global.innerWidth, global.innerHeight)
      };
    },
    componentOptions () {
      return {
        focused: this.options.focused
      };
    },
    header () {
      return {
        close: this.options.close,
        overlay: this.options.overlay,
        title: this.options.title,
        focused: this.options.focused
      };
    },

    style () {
      return Object.assign({
        '--header-height': this.headerHeight
      },
      this.layout.size.toCSSVars('size'),
      this.layout.position.toCSSVars('position'));
    },
    styleClasses () {
      return {
        'js--moving': this.moving,
        'js--scaling': this.scaling,
        'js--scale': this.options.scale,
        'js--scroll-x': this.options.scrollX,
        'js--scroll-y': this.options.scrollY,
        'js--freeze': this.options.freeze,
        'js--visible': this.visible,
        'js--embed': this.options.embed,
        'js--focused': this.options.focused,
        'js--borderless': this.options.borderless
      };
    },
    wrapperSize () {
      return this.wrapperLayout.size;
    },
    size () { return this.layout.size; },
    focused () {
      return this.options.focused;
    }
  },

  watch: {
    size (e) {
      if (!this.scaling) {
        this.positions.start = this.layout.position;
        this.positions.offset = 0;
        this.setPosition(this.layout.position, this.getRootSize());
      }
    },
    focused (value) {
      this.$nextTick(() => {
        this.$emit('focused', this, value);
      });
      if (value) {
        this.focusedSubscriptions.push(
          domEvents.get('click').pipe(filter(({ target }) => !closestEl(target, this.$el)), first()).subscribe(() => {
            this.options.focused = false;
          }));
      } else {
        this.focusedSubscriptions.forEach(subscription => subscription.unsubscribe());
        this.focusedSubscriptions = [];
      }
    }
  },

  mounted () {
    if (this.$refs.header) {
      this.headerHeight = this.$refs.header.offsetHeight;
    }
    if (this.wrapper && this.firstLayout) {
      this.firstLayout = false;
      this.refresh({ scroll: true });

      if (this.options.center) {
        global.requestAnimationFrame(() => {
          this.wrapper.centerWindow(this.id);
        });
      }
    }
    if (this.focused) {
      global.setTimeout(() => {
        this.focusedSubscriptions.push(
          domEvents.get('click').pipe(filter(({ target }) => !closestEl(target, this.$el)), first()).subscribe(() => {
            this.options.focused = false;
          }));
      }, 300);
    }
  },

  destroyed () {
    this.focusedSubscriptions.forEach(subscription => subscription.unsubscribe());
  },

  methods: {
    onFreeze () {
      this.options.focused = false;
      this.options.freeze = true;
    },
    onUnfreeze () {
      this.$nextTick(() => {
        this.options.freeze = false;
        this.options.focused = true;
      });
    },

    onComponentReady () {
      this.$emit('ready', this);
    },

    getRootSize () {
      return calc(() => this.wrapperSize - this.layout.size);
    },

    onRefreshScrollContent (options) {
      this.triggerRefresh = options;
      this.$nextTick(() => (this.triggerRefresh = null));
    },

    onCloseComponent (arg) {
      this.close(arg);
    },

    onRefreshComponent (options) {
      this.refresh(options);
    },

    refresh (options) {
      this.triggerRefresh = Object.assign({ scroll: true, resize: true, reset: false }, options);
      this.$nextTick(() => (this.triggerRefresh = null));
    },
    onPointerDown () {
      if (!this.options.freeze) {
        this.options.focused = true;
      }
    },
    onClickHeader (e) {
      if (!this.options.freeze) {
        this.positions.start = ipoint(e);
        this.positions.offset = ipoint(() => this.positions.start - this.layout.position);
        const rootSize = this.getRootSize();
        this.moving = true;
        const subscibe = domEvents.pointerMove.subscribe(e => this.setPosition(ipoint(e), rootSize));
        domEvents.pointerUp.pipe(first()).subscribe(() => {
          subscibe.unsubscribe();
          this.moving = false;
          this.refresh();
          this.wrapper.savePosition(this.id, this.layout.position);
        });
      }
    },
    setPosition (position, rootSize) {
      position = ipoint(() => Math.min(position, this.wrapper.layout.position + this.wrapperSize));

      this.positions.move = calc(() => position - this.positions.start);
      const current = calc(() => Math.round(this.positions.start + this.positions.move - this.positions.offset));

      this.layout.position = ipoint(
        // Math.max(this.options.clampX ? Math.min(current.x, rootSize.x) : current.x, 0),
        // Math.max(this.options.clampY ? Math.min(current.y, rootSize.y) : current.y, 0)
        Math.max(this.options.clampX ? Math.min(current.x, rootSize.x) : current.x, 0),
        Math.max(this.options.clampY ? Math.min(current.y, rootSize.y) : Math.min(current.y, rootSize.y + this.layout.size.y - HEADER_HEIGHT), 0)
      );
    },
    onClickUp () {
      this.$emit('up', this);
    },
    onClickDown () {
      this.$emit('down', this);
    },
    close (arg) {
      this.$nextTick(() => {
        this.$emit('close', this, arg);
      });
    },
    onClickClose () {
      this.close();
    },

    onPointerDownHelperScale (e) {
      touchEvent(e);
      this.sizes.start = ipoint(e);
      this.sizes.offset = ipoint(() => this.sizes.start - this.layout.size);
      const rootSize = this.wrapperSize;

      const subscibe = domEvents.pointerMove.subscribe((e) => {
        this.sizes.move = calc(() => ipoint(e.clientX, e.clientY) - this.sizes.start);
        const current = calc(() => Math.round(this.sizes.start + this.sizes.move - this.sizes.offset));

        if (current.x < rootSize.x - this.layout.position.x && current.y < rootSize.y - this.layout.position.y) {
          this.layout.size = current;
        }
      });
      this.scaling = true;
      domEvents.pointerUp.pipe(first()).subscribe(() => {
        subscibe.unsubscribe();
        this.scaling = false;
        this.refresh();
        this.wrapper.saveSize(this.id, this.layout.size);
      });
    }

  }
};

</script>

<style lang="postcss">
:root {
  --color__window__text: #fff;
  --color__window__background: #05a;
  --color__window__border: #fff;
  --color__window__borderScaling: #fa5;
  --color__window__helper__scaleBackground: #fff;
  --color__window__helper__scaleIcon: #05a;
  --color__window__helper__scaleIconActive: #000;
}

body > #root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wb-components-window {
  --header-height: 20;

  position: absolute;
  top: 0;
  top: calc(var(--position-y) * 1px);
  left: 0;
  left: calc(var(--position-x) * 1px);

  /* z-index: 10; */
  width: calc(var(--size-x) * 1px);
  min-width: 120px;

  /* Woher kommt die 5px? */

  /* height: calc(var(--size-y) * 1px + 5px + 1 * var(--border-width)); */
  height: calc(var(--size-y) * 1px);
  opacity: 0;

  --border-width: 2px;

  & > div {
    width: calc(var(--size-x) * 1px);
    min-width: 120px;
    height: calc(var(--size-y) * 1px);
    color: var(--color__window__text);

    /* min-height: 50px; */
    background: var(--color__window__background);
    border: solid var(--color__window__border) 2px;
    border-top-width: 0;
  }

  &.js--borderless {
    & > div {
      /* border-top-width: 2px; */
      border: none;
    }
  }

  &.js--freeze {
    & > * {
      pointer-events: none;
    }
  }

  &.js--visible {
    opacity: 1;
  }

  & .window__content {
    /* width: calc(100% + 2px); */
    width: calc(100%);
    min-width: 146px;
    min-height: calc(100% - var(--header-height) * 1px);

    /* min-height: calc(100% - 20px + 5px + 1 * var(--border-width)); */

    /* padding: 3px; */
    line-height: 18px;

    /* & strong,
    & b {
      font-weight: normal;
      color: var(--workbenchColor_4);

      & em {
        color: var(--workbenchColor_1);
      }
    } */

  }

  & .window__content__sidebar-left {
    border-right: solid var(--color__window__border) 2px;
  }

  & .window__helper-scale {
    position: absolute;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: none;
    width: 12px;
    height: 14px;
    margin-top: auto;
    margin-left: auto;

    /* padding-top: 2px;
    padding-left: 2px; */
    pointer-events: none;
    user-select: none;
    background-color: var(--color__window__helper__scaleBackground);

    & > * {
      display: block;
      visibility: hidden;
    }

    & svg {
      display: block;
    }

    & .svg__primary {
      fill: var(--color__window__helper__scaleIcon);
    }
  }

  &.js--scroll-y {
    & > div > .inner {
      height: 100%;
    }
  }

  &.js--scaling {
    & .window__helper-scale {
      & .svg__primary {
        fill: var(--color__window__helper__scaleIconActive);
      }
    }
  }

  &.js--moving,
  &.js--scaling {
    & > div {
      background: transparent;
      border-color: var(--color__window__borderScaling);
      border-width: 2px;

      & *,
      & ::after,
      & ::before {
        opacity: 0;
      }
    }
  }

  &.js--scale {
    & .window__helper-scale {
      & > * {
        pointer-events: auto;
        visibility: visible;
      }
    }
  }

  &.js--scale,
  &.js--scroll-x.js--scroll-y {
    & .window__helper-scale {
      display: block;
    }
  }

}

@keyframes text-blinking {
  0% {
    color: transparent;
  }

  19% {
    color: transparent;
  }

  20% {
    color: currentColor;
  }

  100% {
    color: currentColor;
  }
}
</style>
