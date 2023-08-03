<template>
  <div
    class="wb-env-scroll-content"
    :class="styleClasses"
    :style="scrollContentStyle"
  >
    <div
      ref="scrollWrapper"
      class="wrapper"
    >
      <div class="sidebar-left">
        <slot name="sidebarLeft" />
      </div>
      <div
        ref="scrollContent"
        class="content"
        @scroll="onScroll"
      >
        <div
          ref="scrollInner"
          class="inner"
        >
          <div>
            <slot>
              <div style="width: 680px; height: 100px; margin: 20px; background: red;" />
              <div style="width: 250px; height: 240px; margin: 20px; background: red;" />
              <div style="width: 500px; height: 240px; margin: 20px; background: green;" />
              <div style="width: 800px; height: 240px; margin: 20px; background: yellow;" />
              <div style="width: 250px; height: 240px; margin: 20px; background: red;" />
              <div style="width: 500px; height: 3000px; margin: 20px; background: green;" />
              <div style="width: 800px; height: 240px; margin: 20px; background: yellow;" />
            </slot>
          </div>
        </div>
      </div>
    </div>

    <div v-if="active && options.scrollY" class="scrollbar scrollbar-right">
      <span
        ref="scrollbarArrowTop"
        class="helper-top"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowTop"
        @pointerup="onPointerUpScrollBarArrow"
      >
        <svg-scrollbar-arrow-top />
      </span>
      <span class="range">
        <span
          ref="scrollRightHelper"
          class="helper"
        ><span
          ref="scrollRightSpacer"
          class="spacer"
          touch-action="none"
          @pointerdown="onPointerDownRightSpacer"
        /></span>
      </span>
      <span
        ref="scrollbarArrowBottom"
        class="helper-bottom"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowBottom"
        @pointerup="onPointerUpScrollBarArrow"
      >
        <svg-scrollbar-arrow-bottom />
      </span>
    </div>

    <span v-if="showCorner" class="scrollbar-corner">
      <slot name="corner" />
    </span>

    <div v-if="active && options.scrollX" class="scrollbar scrollbar-bottom">
      <span
        ref="scrollbarArrowLeft"
        class="helper-left"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowLeft"
        @pointerup="onPointerUpScrollBarArrow"
      >
        <svg-scrollbar-arrow-left />
      </span>
      <span class="range">
        <span
          ref="scrollBottomHelper"
          class="helper"
        ><span
          ref="scrollBottomSpacer"
          class="spacer"
          touch-action="none"
          @pointerdown="onPointerDownBottomSpacer"
        /></span>
      </span>
      <span
        ref="scrollbarArrowRight"
        class="helper-right"
        touch-action="none"
        @pointerdown="onPointerDownScrollBarArrowRight"
        @pointerup="onPointerUpScrollBarArrow"
      >
        <svg-scrollbar-arrow-right />
      </span>
    </div>
  </div>
</template>

<script>

import { ipoint, calc, point } from '@js-basics/vector';
import { first } from 'rxjs';
import scrollBar, { touchEvent } from '../services/dom';
import domEvents from '../services/domEvents';
import SvgScrollbarArrowTop from '../assets/svg/control/scrollbar_arrow_top.svg?component';
import SvgScrollbarArrowBottom from '../assets/svg/control/scrollbar_arrow_bottom.svg?component';
import SvgScrollbarArrowLeft from '../assets/svg/control/scrollbar_arrow_left.svg?component';
import SvgScrollbarArrowRight from '../assets/svg/control/scrollbar_arrow_right.svg?component';

const DIRECTIONS = {
  LEFT: 0, TOP: 1, RIGHT: 2, BOTTOM: 3
};

export default {
  components: {
    SvgScrollbarArrowTop,
    SvgScrollbarArrowBottom,
    SvgScrollbarArrowLeft,
    SvgScrollbarArrowRight
  },
  props: {
    options: {
      type: Object,
      default () {
        return {
          scrollX: true,
          scrollY: true,
          clampLeft: false,
          clampBottom: false
        };
      }
    },
    setTriggerReset: {
      type: Boolean,
      default: false
    },
    setTriggerRefresh: {
      type: Object,
      default () {
        return null;
      }
    },
    embed: {
      type: Boolean,
      default: false
    },
    rootLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(0, 0)
        };
      }
    },
    parentLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(0, 0)
        };
      }
    },
    parentLayoutSizeOffset: {
      type: Object,
      default () {
        return ipoint(0, 0);
      }
    }
  },

  emits: [
    'click',
    'refresh'
  ],
  data () {
    return {
      active: true,
      showStorageSize: true,

      helperStyle: {},

      sizes: {
        spacer: ipoint(0, 0),
        helper: ipoint(0, 0),
        content: ipoint(0, 0),
        wrapper: ipoint(0, 0),
        inner: ipoint(0, 0)
      },

      scroll: {
        startScroll: null,
        current: point(0, 0),
        start: null,
        move: null
      }

    };
  },

  computed: {

    showCorner () {
      return this.options.scrollX || this.options.scrollY || !!this.$slots.corner;
    },

    scrollContentStyle () {
      return Object.assign({
        '--scroll-bar-size': `${scrollBar.size}`
      }, this.helperStyle);
    },
    styleClasses () {
      return {
        active: this.active,
        'axis-x': this.options.scrollX,
        'axis-y': this.options.scrollY,
        embed: this.embed
      };
    },

    parentSize () {
      return this.parentLayout.size;
    }
  },

  watch: {
    parentSize () {
      this.refresh();
    },

    setTriggerReset () {
      this.refresh();
    },

    setTriggerRefresh (options) {
      if (options && options.reset) {
        this.resetTest();
      } else if (options && options.scroll) {
        this.refresh();
      }
    }
  },

  mounted () {
    window.requestAnimationFrame(() => {
      this.setParentSize();
    });
  },

  methods: {
    setParentSize () {
      const innerSize = this.getScrollInnerSize();
      const scrollBarSize = ipoint(this.options.scrollY ? 20 : 0, this.options.scrollX ? 20 : 0);
      if (this.parentLayout) {
        // ipoint(this.options.scrollX ? scrollBar.size : 0, this.options.scrollY ? scrollBar.size : 0)
        const layoutOffset = ipoint(() => scrollBarSize + this.parentLayoutSizeOffset);

        if (!(this.options.scrollX && this.options.scrollY)) {
          this.parentLayout.size = ipoint(
            Math.min(innerSize.x + layoutOffset.x, this.rootLayout.size.x),
            Math.min(innerSize.y + layoutOffset.y, this.rootLayout.size.y)
          );
        }
      }
    },
    resetTest () {
      this.parentLayout.size = ipoint(0, 0);
      this.$nextTick(() => {
        this.setParentSize();
      });
    },

    getScrollContentSize () {
      return ipoint(this.$refs.scrollContent.offsetWidth, this.$refs.scrollContent.offsetHeight);
    },
    getScrollInnerSize () {
      return ipoint(this.$refs.scrollInner.offsetWidth, this.$refs.scrollInner.offsetHeight);
    },

    onScroll () {
      window.requestAnimationFrame(() => {
        this.refreshScrollbar();
        this.updateEl();
      });
      this.parentLayout.scrollOffset = this.getScrollValue();
      this.$emit('refresh');
    },

    refresh () {
      this.sizes.content = this.getScrollContentSize();
      this.sizes.wrapper = ipoint(this.$refs.scrollWrapper.offsetWidth, this.$refs.scrollWrapper.offsetHeight);
      this.sizes.inner = this.getScrollInnerSize();

      this.sizes.helper = ipoint(this.$refs.scrollBottomHelper ? this.$refs.scrollBottomHelper.offsetWidth : 0, this.$refs.scrollRightHelper ? this.$refs.scrollRightHelper.offsetHeight : 0);

      this.sizes.spacer = ipoint(() => Math.min(this.sizes.wrapper / this.sizes.inner, 1) * this.sizes.helper);
      const scrollOffset = this.getScrollValue();
      this.parentLayout.scrollOffset = scrollOffset;
      this.refreshScrollbar();
      this.updateEl();
      this.$emit('refresh');
      this.$refs.scrollContent.scrollTo(this.options.clampLeft ? 0 : scrollOffset.x, this.options.clampBottom ? this.sizes.inner.y : scrollOffset.y);
    },

    updateEl () {
      const position = ipoint(() => this.scroll.current * (1 - this.sizes.spacer / this.sizes.helper));
      const size = ipoint(() => this.sizes.spacer / this.sizes.helper);
      this.helperStyle = Object.assign(position.toCSSVars('helper-position'), size.toCSSVars('helper-size'));
    },

    getScrollValue () {
      return ipoint(this.$refs.scrollContent.scrollLeft, this.$refs.scrollContent.scrollTop);
    },

    refreshScrollbar () {
      const scrollbarSize = ipoint(
        !this.options.scrollY ? 0 : scrollBar.size,
        !this.options.scrollX ? 0 : scrollBar.size
      );

      const scrollValues = this.getScrollValue();
      this.scroll.current = calc(() => scrollValues / (this.sizes.inner - this.sizes.content + scrollbarSize));
    },

    onPointerDownRightSpacer (e) {
      touchEvent(e);
      e.preventDefault();

      this.scroll.start = ipoint(e.clientX, e.clientY);
      this.scroll.startScroll = this.$refs.scrollContent.scrollTop;

      const subscibe = domEvents.pointerMove.subscribe((e) => {
        this.scroll.move = calc(() => ipoint(e.clientX, e.clientY) - this.scroll.start);
        this.$refs.scrollContent.scrollTop = this.scroll.startScroll + (this.sizes.inner.y * this.scroll.move.y) / this.sizes.helper.y;
      });
      domEvents.pointerUp.pipe(first()).subscribe(() => {
        subscibe.unsubscribe();
      });
    },
    onPointerDownBottomSpacer (e) {
      e.preventDefault();

      this.scroll.start = ipoint(e.clientX, e.clientY);
      this.scroll.startScroll = this.$refs.scrollContent.scrollLeft;

      const subscibe = domEvents.pointerMove.subscribe((e) => {
        this.scroll.move = calc(() => ipoint(e.clientX, e.clientY) - this.scroll.start);
        this.$refs.scrollContent.scrollLeft = this.scroll.startScroll + (this.sizes.inner.x * this.scroll.move.x) / this.sizes.helper.x;
      });
      domEvents.pointerUp.pipe(first()).subscribe(() => {
        subscibe.unsubscribe();
      });
    },
    onPointerDownScrollBarArrowTop () {
      this.setScrollByEvent(DIRECTIONS.TOP);
    },
    onPointerDownScrollBarArrowBottom () {
      this.setScrollByEvent(DIRECTIONS.BOTTOM);
    },
    onPointerDownScrollBarArrowLeft () {
      this.setScrollByEvent(DIRECTIONS.LEFT);
    },
    onPointerDownScrollBarArrowRight () {
      this.setScrollByEvent(DIRECTIONS.RIGHT);
    },
    onPointerUpScrollBarArrow () {
      window.clearInterval(this.scrollInterval);
    },

    setScrollByEvent (direction) {
      window.clearInterval(this.scrollInterval);
      this.scrollInterval = setInterval(() => {
        switch (direction) {
          case DIRECTIONS.LEFT:
            this.$refs.scrollContent.scrollLeft -= 16;
            break;
          case DIRECTIONS.TOP:
            this.$refs.scrollContent.scrollTop -= 16;
            break;
          case DIRECTIONS.RIGHT:
            this.$refs.scrollContent.scrollLeft += 16;
            break;
          case DIRECTIONS.BOTTOM:
            this.$refs.scrollContent.scrollTop += 16;
            break;
        }
      }, 125);
    }
  }
};

</script>

<style lang="postcss" scoped>
.wb-env-scroll-content {
  --color-scrollbar-corner: var(--color-scroll-content-scrollbar-corner, #fff);
  --color-scrollbar-spacer: var(--color-scroll-content-scrollbar-spacer, #fff);
  --color-scrollbar-background: var(--color-scroll-content-scrollbar-background, #05a);
  --color-scrollbar-helper-background: var(--color-scroll-content-scrollbar-helper-background, #fff);
  --color-scrollbar-helper: var(--color-scroll-content-scrollbar-helper, #05a);
  --color-scrollbar-helper-active: var(--color-scroll-content-scrollbar-helper-active, #000);
  --color-scrollbar-range: var(--color-scroll-content-scrollbar-range, #fff);

  /* dynamic var */
  --scroll-bar-size: 0;
  --helper-position-x: var(--helper-position-x, 1);
  --helper-position-y: var(--helper-position-y, 1);
  --helper-size-x: var(--helper-size-x, 1);
  --helper-size-y: var(--helper-size-y, 1);

  position: relative;
  overflow: hidden;

  &:not(.embed) {
    border: solid white 1px;
    border-width: 0 2px 2px 0;
  }

  #root > & {
    position: absolute;
    top: 0;
    left: 50%;
    width: 640px;
    height: 100%;
    margin-left: -320px;

    @media (height >= 480px) {
      top: 50%;
      height: 480px;
      margin-top: -240px;
    }
  }

  & svg {
    display: block;
  }

  & .inner {
    box-sizing: border-box;
    display: flex;
    min-width: 100%;

    &.active {
      float: left;
    }

    & > div {
      flex: 1;
      min-width: 100%;
      min-height: 100%;
    }
  }

  .wb-env-view > & {
    position: absolute;
    top: 20px;
    bottom: 0;
    width: 100%;
  }

  & .scrollbar-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 14px;
    height: 16px;
    background: var(--color-scrollbar-corner);
  }

  &.axis-x,
  &.axis-y {
    & .scrollbar-corner {
      width: 16px;
    }
  }

  &.active {
    & .content {
      position: relative;
      top: 0;
      left: 0;
      flex: 1;
      overflow: hidden;

      & > .inner {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 100%;
        min-height: 100%;
      }
    }

    .wb-env-view > & {
      bottom: 0;
      overflow: inherit;
    }

    & .wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      overflow: hidden;
    }

    &.axis-x,
    &.axis-y {
      & .wrapper {
        right: calc(var(--scroll-bar-size) * -1px);
        bottom: calc(var(--scroll-bar-size) * -1px);
      }
    }

    &.axis-x {
      & .content {
        overflow-x: scroll;
      }

      & .inner {
        padding-right: calc(var(--scroll-bar-size) * 1px);
      }

      & .sidebar-left {
        position: relative;
        height: calc(100% - var(--scroll-bar-size) * 1px - 16px);
      }
    }

    &.axis-y {
      & .content {
        overflow-y: scroll;
      }

      & .inner {
        padding-bottom: calc(var(--scroll-bar-size) * 1px);
      }
    }

    & .storage-size-active + .content {
      & .inner {
        padding-left: 12px;
      }
    }

    & .spacer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 14px;
      height: 16px;
      background: var(--color-scrollbar-spacer);
    }

    & .scrollbar {
      background: var(--color-scrollbar-background);
    }

    /* ###################### */

    /* & .helper-top,
    & .helper-left,
    & .helper-bottom,
    & .helper-right {
      & .svg-primary {
        fill: var(--color-scrollbar-helperPrimary);
      }

      &:active {
        & .svg-primary {
          fill: var(--color-scrollbar-helperPrimaryActive);
        }
      }
    } */

    & .scrollbar-right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      bottom: 16px;
      width: 16px;

      & > * {
        position: absolute;
        left: 0;
        width: 100%;

        & svg {
          display: block;
          margin: 0 auto;
        }
      }

      & .helper-top,
      & .helper-bottom {
        display: block;
        width: 16px;
        background-color: var(--color-scrollbar-helper-background);

        & svg {
          position: relative;
          left: 1px;
          fill: var(--color-scrollbar-helper);
        }
      }

      & .helper-top {
        top: 0;
        padding-bottom: 2px;
      }

      & .range {
        top: 14px;
        bottom: 16px;
        box-sizing: border-box;
        border:
          solid var(--color-scrollbar-range)
          2px;
        border-width: 0 0 0 2px;

        & .helper {
          position: absolute;
          inset: 2px;
        }

        & .spacer {
          position: absolute;
          top: calc(var(--helper-position-y) * 100%);
          left: 0;
          display: block;
          width: 100%;
          height: calc(var(--helper-size-y) * 100%);
          background: var(--color-scrollbar-spacer);

          .wb-env-view.scaling & {
            visibility: hidden;
          }
        }
      }

      & .helper-bottom {
        bottom: 0;
        padding-top: 2px;
        padding-bottom: 2px;
      }
    }

    & .scrollbar-bottom {
      position: absolute;
      right: 16px;
      bottom: 0;
      left: 0;
      height: 16px;

      & > * {
        position: absolute;
        bottom: 0;
      }

      & .helper-left,
      & .helper-right {
        display: inline-block;
        height: 16px;
        background: var(--color-scrollbar-helper-background);

        & svg {
          position: relative;
          top: 1px;
          fill: var(--color-scrollbar-helper);
        }
      }

      & .helper-left {
        left: 0;
        padding: 1px 2px 0 0;
      }

      & .range {
        right: 12px;
        bottom: 0;
        left: 13px;
        box-sizing: border-box;
        height: 100%;
        border: solid var(--color-scrollbar-range) 2px;
        border-width: 2px 1px 0 0;

        & .helper {
          position: absolute;
          inset: 2px;
        }

        & .spacer {
          position: absolute;
          top: 0;
          left: calc(var(--helper-position-x) * 100%);
          display: block;
          width: calc(var(--helper-size-x) * 100%);
          height: 100%;
          background: var(--color-scrollbar-spacer);

          .wb-env-view.scaling & {
            visibility: hidden;
          }
        }
      }

      & .helper-right {
        right: 0;
        padding: 1px 0 0 2px;
      }
    }
  }
}
</style>
