<template>
  <figure
    :data-id="id"
    class="wb-env-atom-symbol-wrapper-item"
    :class="styleClasses"
    :style="[
      layout.size.toCSSVars('item-size'),
      (globalPosition || layout.position).toCSSVars('item-position')
    ]"
    touch-action="none"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp">
    <component :is="linkTag" v-bind="linkBind">
      <i><component :is="symbolsModule.symbols.get(model.symbol)" /></i>
      <figcaption v-html="model.title" />
    </component>
  </figure>
</template>

<script>
import { markRaw } from 'vue';

import { ipoint, calc } from '@js-basics/vector';
import { Subscription, first } from 'rxjs';
import webWorkbench from '@web-workbench/core';
import domEvents from '../../../services/domEvents';
import SymbolWrapper from '../../../classes/SymbolWrapper';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import { touchEvent } from '../../../services/dom';
import SvgSymbolDisk1 from '../../../assets/svg/symbols/disk_1.svg?component';

export default {
  props: {
    parentLayout: {
      type: Object,
      default() {
        return null;
      }
    },

    clampGlobal: {
      type: Boolean,
      default: false
    },

    container: {
      type: Boolean,
      default() {
        return false;
      }
    },

    command: {
      type: String,
      default: null
    },

    // ###################################
    // ###################################

    id: { type: String, default: null },

    model: {
      type: Object,
      default() {
        return {
          title: 'Item Title',
          url: null,
          symbol: SvgSymbolDisk1,
          used: false,
          visible: true
        };
      }
    },
    layout: {
      type: Object,
      default() {
        return {
          position: ipoint(0, 0),
          size: ipoint(50, 50)
        };
      }
    },
    scrollOffset: {
      type: Object,
      default() {
        return ipoint(0, 0);
      }
    },
    wrapper: {
      type: Object,
      default() {
        return markRaw(new SymbolWrapper());
      }
    }
  },

  emits: ['click'],

  setup(props) {
    return {
      wrapperItems: props.wrapper.items,
      wrapperSelectedItems: props.wrapper.selectedItems
    };
  },

  data() {
    return {
      globalPosition: null,
      moving: false,
      positions: {
        start: null,
        move: null
      },

      subscription: new Subscription(),

      parentEl: null,
      screenModul: webWorkbench.modules.screen
    };
  },
  computed: {
    linkTag() {
      return this.model.url ? 'a' : 'span';
    },
    linkBind() {
      if (!this.model.url) {
        return {};
      }
      return {
        href: this.model.url,
        target: this.model.url ? '_blank' : null,
        title: this.model.title
      };
    },
    contentLayout() {
      return this.screenModul.contentLayout;
    },
    selected() {
      return this.wrapperSelectedItems.includes(this.id);
    },
    styleClasses() {
      return {
        moving: this.moving,
        selected: this.selected,
        'symbol-used': this.model.used
      };
    },
    symbolsModule() {
      return webWorkbench.modules.symbols;
    }
  },

  watch: {
    model: {
      deep: true,
      handler() {
        this.onRefresh();
      }
    }
  },

  mounted() {
    this.parentEl = this.$el.parentElement;
    this.onRefresh();
  },
  unmounted() {
    this.subscription.unsubscribe();
    this.wrapper.unselectItem(this.id);
  },

  methods: {
    onRefresh() {
      this.layout.size = ipoint(200, 200);
      window.requestAnimationFrame(() => {
        this.layout.size = ipoint(
          this.$el.children[0].offsetWidth,
          this.$el.children[0].offsetHeight
        );
      });
    },
    getRootBounds() {
      const { width, height, left, top } =
        this.parentEl.getBoundingClientRect();
      return { position: ipoint(left, top), size: ipoint(width, height) };
    },

    onPointerDown(e) {
      touchEvent(e);

      const id = this.id;

      if (this.model.url && this.selected) {
        // this.wrapper.unselectItem(id);
        return;
      }

      e.preventDefault();

      if (this.model.used) {
        return;
      }

      if (this.command && this.selected) {
        const executeOptions = {
          showCommand: false,
          show: true
        };
        this.wrapper.unselectItem(id);
        this.model.used = true;
        return webWorkbench
          .executeCommand(this.command, executeOptions)
          .then(() => (this.model.used = false));
      }

      if (domEvents.shiftActive) {
        if (this.wrapper.isSelectedItem(id)) {
          this.wrapper.unselectItem(id);
        } else {
          this.wrapper.selectItem(id);
        }
      } else {
        if (this.symbolsModule.getSelectedItems().length > 0) {
          this.symbolsModule.clearSelectedItems();
        }
        this.wrapper.selectItem(id);
      }

      this.startMove(ipoint(e));
      this.$emit('click', this);
    },

    onPointerUp() {
      const selectedItems = this.symbolsModule
        .getSelectedItems()
        .filter(item => item.id !== this.id);
      const destItem = this.wrapper.get(this.id);

      if (
        selectedItems.length > 0 &&
        destItem.fsItem instanceof ItemContainer
      ) {
        selectedItems.forEach(item =>
          this.wrapper.moveItemToItem(item.fsItem, destItem.fsItem)
        );
      }
    },

    startMove(position) {
      const rootBounds = this.getRootBounds();
      this.positions.lastPosition = ipoint(this.layout.position);
      this.positions.scrollOffset = ipoint(this.scrollOffset);
      this.positions.start = position;
      this.positions.offset = ipoint(
        () => this.positions.start - this.layout.position
      );

      this.setPosition(position, rootBounds, true);
      this.moving = true;

      let lastPosition = position;
      const subscibe = domEvents.pointerMove.subscribe(e => {
        lastPosition = ipoint(e);
        this.setPosition(ipoint(e), rootBounds, true);
      });

      this.subscription.add(
        domEvents.pointerUp.pipe(first()).subscribe(() => {
          subscibe.unsubscribe();
          if (this.symbolsModule.getSecondaryWrapper().id !== this.wrapper.id) {
            return this.wrapper
              .moveItem(this.id, this.symbolsModule.getSecondaryWrapper())
              .then(success => {
                if (!success) {
                  this.layout.position = ipoint(this.positions.lastPosition);
                }
                this.globalPosition = null;
                this.moving = false;
                return success;
              });
          } else {
            this.moving = false;
            this.setPosition(lastPosition, rootBounds);
            if (
              !this.layout.position.equals(
                calc(() => this.positions.start - this.positions.offset)
              )
            ) {
              return this.wrapper.savePosition(this.id, this.layout.position);
            }
          }
        })
      );
    },

    setPosition(position, rootBounds, globalBounds = false) {
      const rootMinMax = {
        min: ipoint(0, 0),
        max: calc(() => rootBounds.size - this.layout.size)
      };

      this.positions.move = calc(() => position - this.positions.start);
      let current = calc(() =>
        Math.round(
          this.positions.start + this.positions.move - this.positions.offset
        )
      );

      if (globalBounds) {
        rootMinMax.min = rootBounds.position;
        rootMinMax.max = calc(
          () => rootMinMax.max + this.contentLayout.position
        );
        current = calc(() => Math.round(current + rootMinMax.min));
        if (this.clampGlobal) {
          this.globalPosition = ipoint(() =>
            Math.max(
              Math.min(
                current,
                this.contentLayout.position +
                  this.wrapper.size -
                  this.layout.size
              ),
              rootMinMax.min
            )
          );
        } else {
          this.globalPosition = current;
        }
      } else {
        if (this.wrapper.root) {
          // Beim root wrapper wird geklemmt. Der Rand des Bildschirms…
          this.layout.position = calc(() =>
            Math.max(Math.min(current, this.wrapper.size - this.layout.size), 0)
          );
        } else {
          this.layout.position = calc(() => Math.max(current, 0));
        }

        this.globalPosition = null;
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-symbol-wrapper-item {
  --color-text: var(--color-symbol-wrapper-item-text, #fff);

  position: absolute;
  top: calc(var(--item-position-y) * 1px);
  left: calc(var(--item-position-x) * 1px);
  margin: 0;
  touch-action: none;
  user-select: none;

  & > span,
  & > a {
    display: inline-block;
  }

  &.moving {
    position: fixed;
    z-index: 100;
    pointer-events: none;
  }

  & a {
    color: var(--color-text);
    text-decoration: none;
  }

  & i {
    display: block;

    & > * {
      display: block;
      margin: 0 auto;
    }
  }

  &:active,
  &.selected {
    filter: var(--filter-default);
  }

  & figcaption {
    display: block;
    width: auto;
    min-width: 80px;
    max-width: 140px;
    padding: 0 1px;
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    text-align: center;

    /* word-break: normal;
    white-space: pre-line; */
  }
}
</style>
