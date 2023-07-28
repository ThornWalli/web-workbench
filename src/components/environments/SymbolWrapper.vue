<template>
  <div
    class="wb-env-symbol-wrapper"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
  >
    <div ref="helper" class="symbol-wrapper__helper" />
    <div ref="items" class="symbol-wrapper__items">
      <wb-env-atom-svg-wrapper-item
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

import { ipoint, point } from '@js-basics/vector';
import { CONFIG_NAMES as SYMBOLS_CONFIG_NAMES } from '../../web-workbench/classes/modules/Symbols/utils';
import { SYMBOL } from '../../web-workbench/utils/symbols';
import WbEnvAtomSvgWrapperItem from '@/components/environments/atoms/SymbolWrapper/Item';
import SymbolWrapper from '@/web-workbench/classes/SymbolWrapper';

import webWorkbench from '@/web-workbench';

export default {
  components: { WbEnvAtomSvgWrapperItem },
  props: {

    parentLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(window.innerWidth, window.innerHeight)
        };
      }
    },

    parentScrollAble: {
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
        return new SymbolWrapper(webWorkbench, [
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
        ]);
      }
    }

  },
  data () {
    const core = webWorkbench;
    return {
      core,
      webWorkbenchConfig: core.config.observable,
      symbolsModule: core.modules.symbols,
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
        'js--active': (this.core.modules.symbols.primaryWrapper || {}).id === this.wrapper.id
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
      if (this.parentScrollAble) {
        vars.push(this.size.toCSSVars('symbol-wrapper-size'));
      }
      return vars;
    },
    size () {
      return this.visibleItems.map((item) => {
        return { item, index: this.wrapper.selectedItems.indexOf(item.id) + 1 };
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
      return this.wrapper.items.filter(this.isItemVisible);
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
    this.onResize();

    this.$nextTick(() => {
      this.setFocused(this.parentFocused);
      this.$emit('ready');
    });
  },
  destroyed () {
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

  & .symbol-wrapper__items {
    position: relative;
    top: 0;
    left: 0;
    width: calc(var(--symbol-wrapper-size-x) * 1px);
    height: calc(var(--symbol-wrapper-size-y) * 1px);
  }

  & .symbol-wrapper__helper {
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
