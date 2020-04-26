<template>
  <aside
    class="wb-components-window"
    :class="styleClasses"
    :style="[layout.size.toCSSVars('size'), layout.position.toCSSVars('position')]"
    @touchstart="onClick"
    @mousedown="onClick"
  >
    <div>
      <wb-fragments-window-header
        v-bind="header"
        @click="onClickHeader"
        @up="onClickUp"
        @down="onClickDown"
        @close="onClickClose"
      />
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
        <template v-slot:sidebarLeft>
          <component
            :is="sidebarComponent"
            v-bind="sidebarComponentData"
          />
        </template>
        <template>
          <slot>
            <component
              :is="component"
              v-bind="componentData"
              :root-element="$el"
              :parent-focused="focused"
              :options="componentOptions"
              :parent-layout="layout"
              :set-trigger-refresh="triggerRefresh"
              @refresh="onRefreshComponent"
              @close="onCloseComponent"
              @freeze="onFreeze"
              @unfreeze="onUnfreeze"
              @ready="onComponentReady"
            />
          </slot>
        </template>
        <template v-if="options.scale" v-slot:corner>
          <span
            class="window__helper-scale"
            touch-action="none"
            @touchstart="onClickHelperScale"
            @mousedown="onClickHelperScale"
          >
            <svg-scrollbar-scale />
          </span>
        </template>
      </wb-components-scroll-content>
    </div>
  </aside>
</template>

<story
  name="Window"
  group="Environments"
  knobs="{}">
  <Window />
</story>

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
          scale: true,
          scrollX: true,
          scrollY: true,
          clampX: false,
          clampY: false,
          freeze: false,
          focused: false
        };
      }
    },

    title: {
      type: String,
      default () {
        return 'Window Title';
      }
    },

    wrapper: { type: Object, default () { return null; } },

    layout: {
      type: Object,
      default () {
        return {
          rootSize: ipoint(0, 0),
          position: ipoint(50, 50),
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

      focusedSubscribtions: [],

      moving: false,
      scaling: false,

      triggerResetScrollContent: false,
      triggerRefresh: null,
      firstLayout: true
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
        title: this.title,
        focused: this.options.focused
      };
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
        'js--focused': this.options.focused
      };
    },
    wrapperSize () {
      return this.wrapperLayout.size;
      // if (this.wrapper) {
      //   return this.wrapper.layout.size;
      // }
      // return ipoint(global.innerWidth, global.innerHeight);
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
      this.$emit('focused', this, value);
      if (value) {
        this.focusedSubscribtions.push(
          domEvents.get('click').pipe(filter(({ target }) => !closestEl(target, this.$el)), first()).subscribe(() => {
            this.options.focused = false;
          }));
      } else {
        this.focusedSubscribtions.forEach(subscription => subscription.unsubscribe());
        this.focusedSubscribtions = [];
      }
    }
  },

  mounted () {
    if (this.wrapper && this.firstLayout) {
      this.wrapper.centerWindow(this.id);
      this.firstLayout = false;
      this.refresh({ scroll: true });
    }
    if (this.focused) {
      global.setTimeout(() => {
        this.focusedSubscribtions.push(
          domEvents.get('click').pipe(filter(({ target }) => !closestEl(target, this.$el)), first()).subscribe(() => {
            this.options.focused = false;
          }));
      }, 300);
    }
  },

  destroyed () {
    this.focusedSubscribtions.forEach(subscription => subscription.unsubscribe());
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
    onClick () {
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
        });
      }
    },
    setPosition (position, rootSize) {
      position = ipoint(() => Math.min(position, this.wrapper.layout.position + this.wrapperSize));

      this.positions.move = calc(() => position - this.positions.start);
      const current = calc(() => this.positions.start + this.positions.move - this.positions.offset);

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
      this.$emit('close', this, arg);
    },
    onClickClose () {
      this.close();
    },

    onClickHelperScale (e) {
      touchEvent(e);
      this.sizes.start = ipoint(e);
      this.sizes.offset = ipoint(() => this.sizes.start - this.layout.size);
      const rootSize = this.wrapperSize;

      const subscibe = domEvents.pointerMove.subscribe((e) => {
        this.sizes.move = calc(() => ipoint(e.clientX, e.clientY) - this.sizes.start);
        const current = calc(() => this.sizes.start + this.sizes.move - this.sizes.offset);

        if (current.x < rootSize.x - this.layout.position.x && current.y < rootSize.y - this.layout.position.y) {
          this.layout.size = current;
        }
      });
      this.scaling = true;
      domEvents.pointerUp.pipe(first()).subscribe(() => {
        subscibe.unsubscribe();
        this.scaling = false;
        this.refresh();
      });
    }

  }
};

</script>

<style lang="postcss">

body > #root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wb-components-window {
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

    /* min-height: 50px; */
    background: var(--workbenchColor_3);
    border: solid var(--workbenchColor_1) 2px;
    border-top-width: 0;
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
    min-height: calc(100% - 20px);

    /* min-height: calc(100% - 20px + 5px + 1 * var(--border-width)); */

    /* padding: 3px; */
    line-height: 18px;

    & strong,
    & b {
      font-weight: normal;
      color: var(--workbenchColor_4);

      & em {
        color: var(--workbenchColor_1);
      }
    }

    & .ignore {
      & table:not(.no-style) {
        box-sizing: content-box;
        padding: 0;
        margin: 0;

        /* Fix Table width, with margin (Chrome) */
        margin-right: 4px;
        margin-bottom: 2px;
        border-collapse: collapse;
        border-width: 0;

        & th {
          font-weight: normal;
        }

        & th,
        & td {
          position: relative;
          box-sizing: content-box;
          padding: 2px 4px;
          padding-bottom: 1px;
          margin: 0;
          border-collapse: collapse;
          border: solid var(--workbenchColor_1) 2px;
          border-right-width: 2px;
          border-bottom-width: 2px;
        }
      }

      & :not(.wb-atom-markdown) {
        & fieldset {
          padding: 5px 10px;
          border: solid var(--workbenchColor_4) 2px;

          & legend {
            padding: 0 10px;
            line-height: 1;

            /* background: $workbenchColor_4; */

            /* color: white; */
          }
        }

        & hr {
          display: block;
          height: 4px;
          margin: 15px -1px;
          background: var(--workbenchColor_1);
          border: none;
          border: solid var(--workbenchColor_1);
          border-width: 2px 0 0 0;
          appearance: none;
        }

        & h2 {
          font-size: 32px;
          font-weight: normal;
          line-height: 1;
        }

        & p {
          margin: 5px 0;
          overflow: hidden;
          line-height: calc(20 / var(--global_fontSize));
        }

        & strong {
          font-weight: normal;
          color: var(--workbenchColor_4);

          & em {
            color: var(--workbenchColor_1);
          }
        }

        /* blinking {
        animation-name: text-blinking;
        animation-duration: 2s;
        animation-iteration-count: infinite;
      } */

        & pre {
          overflow: visible;
        }

        & ul.bullets {
          padding: 0.5em 0;

          li {
            position: relative;
            padding-left: 0.75em;

            &::before {
              position: absolute;
              top: 0;
              left: 0;
              display: block;
              content: "•";
            }
          }
        }
      }
    }
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
    background-color: var(--workbenchColor_1);

    & > * {
      display: block;
      visibility: hidden;
    }

    & svg {
      display: block;
    }

    & .svg__primary {
      fill: var(--workbenchColor_3);
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
        fill: var(--workbenchColor_2);
      }
    }
  }

  &.js--moving,
  &.js--scaling {
    & > div {
      background: transparent;
      border-color: var(--workbenchColor_4);
      border-width: 2px;

      /* mix-blend-mode: difference; */

      & *,
      & ::after,
      & ::before {
        /* visibility: hidden !important; */
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

  & .markdown-style {
    /* @mixin markdown-style; */

    padding: 10px;
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
    color: var(--workbenchColor_4);
  }

  100% {
    color: var(--workbenchColor_4);
  }
}
</style>
