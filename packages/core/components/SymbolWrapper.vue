<template>
  <div
    class="wb-env-symbol-wrapper"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
  >
    <div ref="helper" class="helper" />
    <div ref="items" class="items">
      <wb-env-atom-symbol-wrapper-item
        v-for="(item, index) in visibleItems"
        :key="index"
        :clamp-global="clampSymbols"
        v-bind="item"
        :wrapper="wrapper"
        :parent-layout="layout"
        :scroll-offset="scrollOffset"
      />
    </div>
  </div>
</template>

<script>

import { markRaw } from 'vue';
import { ipoint, point } from '@js-basics/vector';
import webWorkbench from '@web-workbench/core';
import { CONFIG_NAMES as SYMBOLS_CONFIG_NAMES } from '../classes/modules/Symbols/utils';
import { SYMBOL } from '../utils/symbols';
import SymbolWrapper from '../classes/SymbolWrapper';

import WbEnvAtomSymbolWrapperItem from './atoms/SymbolWrapper/Item';

export default {
  components: { WbEnvAtomSymbolWrapperItem },
  props: {

    parentLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(window.innerWidth, window.innerHeight)
        };
      }
    },

    parentScrollable: {
      type: Boolean,
      default: true
    },

    parentFocused: {
      type: Boolean,
      default: false
    },

    clampSymbols: {
      type: Boolean,
      default: false
    },

    wrapper: {
      type: SymbolWrapper,
      default () {
        return markRaw(new SymbolWrapper(webWorkbench, [
          {
            layout: {
              position: ipoint(100, 0)
            },
            model: {
              title: 'Item 1',
              symbol: SYMBOL.DIRECTORY
            }
          },
          {
            layout: {
              position: ipoint(0, 0)
            },
            model: {
              title: 'Item 2',
              symbol: SYMBOL.DEFAULT
            }
          },
          {
            layout: {
              position: ipoint(0, 0)
            },
            model: {
              title: 'Item 3',
              symbol: SYMBOL.DEFAULT
            }
          }
        ]));
      }
    }

  },

  emits: [
    'ready', 'refresh'
  ],

  setup (props) {
    return {
      wrapperItems: props.wrapper.items,
      wrapperSelectedItems: props.wrapper.selectedItems
    };
  },

  data () {
    const core = webWorkbench;
    return {
      core: markRaw(core),
      webWorkbenchConfig: markRaw(core.config.observable),
      symbolsModule: markRaw(core.modules.symbols),
      selectedItems: [],
      layout: {
        size: ipoint(0, 0),
        position: ipoint(0, 0)
      }

    };
  },

  computed: {
    styleClasses () {
      return {
        'parent-scrollable': this.parentScrollable,
        active: (this.core.modules.symbols.primaryWrapper || {}).id === this.wrapper.id
      };
    },
    scrollOffset () {
      if (this.parentLayout && 'scrollOffset' in this.parentLayout) {
        return this.parentLayout.scrollOffset;
      }
      return ipoint(0, 0);
    },
    style () {
      const vars = [
        this.scrollOffset.toCSSVars('symbol-wrapper-scroll-offset')
      ];
      if (this.parentScrollable) {
        vars.push(this.size.toCSSVars('symbol-wrapper-size'));
      } else {
        // debugger;
        vars.push(this.layout.size.toCSSVars('symbol-wrapper-size'));
      }
      return vars;
    },
    size () {
      return this.visibleItems.map((item) => {
        return { item, index: this.wrapperSelectedItems.indexOf(item.id) + 1 };
      }).sort((a, b) => {
        if (a.index > b.index) { return 1; } else if (a.index < b.index) { return -1; } else { return 0; }
      }).reduce((result, { item }) => {
        const x = item.layout.position.x + item.layout.size.x;
        const y = item.layout.position.y + item.layout.size.y;
        result.x = result.x < x ? x : result.x;
        result.y = result.y < y ? y : result.y;
        return result;
      }, point(0, 0));
    },
    showInvisibleItems () {
      return this.webWorkbenchConfig[SYMBOLS_CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS];
    },
    visibleItems () {
      return this.wrapperItems.filter(this.isItemVisible);
    },
    parentLayoutSize () {
      return (this.parentLayout || {}).size;
    }
  },

  watch: {
    parentFocused (focused) {
      this.setFocused(focused);
    },
    wrapper () {
      this.onResize();
    },
    parentLayoutSize (size) {
      this.onResize();
    },
    size () {
      this.$nextTick(() => {
        this.$emit('refresh', {
          scroll: true
        });
      });
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.onResize();
      this.setFocused(this.parentFocused);
      this.$emit('ready');
    });
  },

  unmounted () {
    if (this.core.modules.symbols.getPrimaryWrapper() && this.core.modules.symbols.getPrimaryWrapper().id === this.wrapper.id) {
      this.core.modules.symbols.setPrimaryWrapper(null);
    }
    if (this.core.modules.symbols.getSecondaryWrapper() && this.core.modules.symbols.getSecondaryWrapper().id === this.wrapper.id) {
      this.core.modules.symbols.setSecondaryWrapper(null);
    }
  },
  methods: {
    setFocused (focused) {
      if (focused) {
        this.symbolsModule.setPrimaryWrapper(this.wrapper);
      } else if (this.symbolsModule.getPrimaryWrapper() && this.symbolsModule.getPrimaryWrapper().id === this.wrapper.id) {
        this.symbolsModule.setPrimaryWrapper(null);
      }
    },
    onResize () {
      const { width, height, left, top } = this.$el.getBoundingClientRect();
      this.wrapper.layout = this.layout = { position: ipoint(left, top), size: ipoint(width, height) };
      this.wrapper.size = ipoint(this.$el.offsetWidth, this.$el.offsetHeight);
      this.wrapper.parentSize = this.parentLayout.size;
    },
    isItemVisible (item) {
      return this.showInvisibleItems || (!this.showInvisibleItems && item.model.visible);
    },
    onPointerMove () {
      this.core.modules.symbols.setSecondaryWrapper(this.wrapper);
    },
    onPointerDown (e) {
      if (e.target === this.$refs.helper || e.target === this.$refs.items) {
        this.wrapper.clearSelectedItems();
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-symbol-wrapper {
  position: static;

  &:not(.parent-scrollable) {
    height: 100%;

    & .items {
      height: 100%;
    }
  }

  & .items {
    position: relative;
    top: 0;
    left: 0;
    width: calc(var(--symbol-wrapper-size-x) * 1px);
    height: calc(var(--symbol-wrapper-size-y) * 1px);
  }

  & .helper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
  }

  #root > & {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    background: orange;
  }
}
</style>
