<template>
  <component
    :is="tag"
    class="wb-env-atom-context-menu-item"
    :class="styleClasses"
    @mouseover="onMouseOver"
    @touchstart="onTouchstart"
    @click="onClick">
    <component :is="clickTag" ref="click" v-bind="clickData">
      <input
        v-if="hasInput"
        ref="input"
        :type="inputType"
        :name="name"
        :value="value"
        :checked="isInputRadio ? model[name] === value : model[name]"
        @input="onInput" />
      <span v-if="hasInput" class="checkbox">
        <svg-control-input-checkbox />
      </span>
      <span class="title">{{ title }}</span>

      <span v-if="hotKey" class="hotkey">
        <svg-control-context-input-hotkey /> {{ hotKey }}
      </span>

      <span v-if="items.length > 0" class="indicator-context">
        <svg-control-context-menu-item-indicator-context />
      </span>
    </component>
    <wb-env-molecule-context-menu
      v-if="items.length > 0"
      ref="contextMenu"
      :items="items"
      :parent-layout="parentLayout"
      @input="onInputContextMenu" />
  </component>
</template>

<script>
import { Subscription } from 'rxjs';
import { ipoint, calc } from '@js-basics/vector';
import { MENU_ITEM_TYPE, generateMenuItems } from '../../../classes/MenuItem';
import WbEnvMoleculeContextMenu from '../../molecules/ContextMenu';
import viewport from '../../../services/viewport';
import domEvents from '../../../services/domEvents';
import SvgControlInputCheckbox from '../../../assets/svg/control/input_checkbox.svg?component';
import SvgControlContextInputHotkey from '../../../assets/svg/control/context_item_hotkey.svg?component';
import SvgControlContextMenuItemIndicatorContext from '../../../assets/svg/control/context_menu_item_indicator_context.svg?component';

const CONTEXT_ALIGN = {
  LEFT: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3
};

export default {
  components: {
    WbEnvMoleculeContextMenu,
    SvgControlInputCheckbox,
    SvgControlContextInputHotkey,
    SvgControlContextMenuItemIndicatorContext
  },
  props: {
    direction: {
      type: String,
      default: 'bottom',
      validator: value => ['top', 'bottom'].includes(value)
    },

    id: { type: String, default: null },
    tag: { type: String, default: 'div' },

    options: {
      type: Object,
      default() {
        return {
          checked: false,
          disabled: false
        };
      }
    },

    model: {
      type: Object,
      default: null
    },

    parentLayout: {
      type: Object,
      default() {
        return {
          size: viewport.screenSize
        };
      }
    },

    title: { type: String, default: 'Item Title' },
    hotKey: { type: String, default: null },

    command: { type: String, default: null },
    action: { type: Function, default: null },
    url: { type: String, default: null },

    name: { type: String, default: null },

    value: {
      type: [String, Number],
      default: null
    },
    type: { type: Number, default: MENU_ITEM_TYPE.DEFAULT },

    items: {
      type: Array,
      default() {
        return generateMenuItems([
          {
            title: 'Sub Item 1',
            hotKey: 'S',
            keyCode: 73
          },
          {
            type: MENU_ITEM_TYPE.SEPARATOR
          },
          {
            title: 'Sub Item 2',
            items: [
              {
                title: 'Sub Item 2.1'
              },
              {
                title: 'Sub Item 2.2'
              }
            ]
          },
          {
            title: 'Sub Item 3'
          }
        ]);
      }
    }
  },
  emits: ['click', 'update:modelValue'],

  data() {
    return {
      forceVisible: false,
      contextReady: false,
      contextAlign: ipoint(CONTEXT_ALIGN.RIGHT, CONTEXT_ALIGN.BOTTOM),

      subscription: new Subscription(),
      optionsWrapper: { disabled: false, checked: false }
    };
  },

  computed: {
    inputType() {
      return this.isInputRadio ? 'radio' : 'checkbox';
    },
    hasInput() {
      return [MENU_ITEM_TYPE.CHECKBOX, MENU_ITEM_TYPE.RADIO].includes(
        this.type
      );
    },
    isInputRadio() {
      return this.type === MENU_ITEM_TYPE.RADIO;
    },

    clickTag() {
      if (this.hasInput) {
        return 'label';
      } else if (this.url) {
        return 'a';
      }
      return 'button';
    },
    clickData() {
      const attrs = {
        class: 'inner'
      };
      if (this.hasInput) {
        attrs.is = 'label';
      } else if (this.url) {
        attrs.is = 'a';
        attrs.href = this.url;
      }
      return attrs;
    },
    disabled() {
      return this.options.disabled;
    },
    styleClasses() {
      return {
        'force-visible': this.forceVisible,
        'context-ready': this.contextReady,
        'context-halign-left': this.contextAlign.x === CONTEXT_ALIGN.LEFT,
        'context-halign-right': this.contextAlign.x === CONTEXT_ALIGN.RIGHT,
        'context-valign-top': this.contextAlign.y === CONTEXT_ALIGN.TOP,
        'context-valign-bottom': this.contextAlign.y === CONTEXT_ALIGN.BOTTOM,
        disabled: this.optionsWrapper.disabled
      };
    }
  },
  watch: {
    options(options) {
      this.optionsWrapper = options;
    }
  },
  mounted() {
    this.optionsWrapper = this.options;
    this.$nextTick(() => {
      if (this.hotKey) {
        this.subscription.add(
          domEvents.keyDown.subscribe(e => {
            if (
              domEvents.cmdActive &&
              this.hotKey?.charCodeAt(0) === e.keyCode
            ) {
              this.executeAction();
            }
          })
        );
      }
    });
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    onInputContextMenu(...args) {
      this.$emit('update:modelValue', ...args);
    },

    executeAction() {
      if (this.action) {
        this.action();
      } else {
        this.$refs.click.click();
      }
    },

    onInput(e) {
      let value;
      if (this.isInputRadio) {
        value = e.target.value;
      } else {
        value = e.target.checked;
      }

      if (typeof value === 'boolean' || isNaN(value)) {
        this.model[this.name] = value;
      } else {
        this.model[this.name] = Number(value);
      }

      this.$emit('update:modelValue', this.name, value);
      if (typeof this.action === 'function') {
        Promise.resolve(this.action(value)).catch(err => {
          throw err;
        });
      }
    },

    onClick(e) {
      e.stopPropagation();
      if (!this.hasInput && typeof this.action === 'function') {
        Promise.resolve(this.action()).catch(err => {
          throw err;
        });
      } else {
        this.$emit('click', e);
      }
    },

    onTouchstart() {
      if (!this.contextReady) {
        this.forceVisible = true;
      }
      this.onMouseOver();
    },

    onMouseOver() {
      if (!this.contextReady) {
        this.contextReady = true;
        this.$nextTick(() => {
          window.setTimeout(() => {
            if (this.$refs.contextMenu) {
              const rect = this.$refs.contextMenu.$el.getBoundingClientRect();
              const { size, position: parentPosition } = this.parentLayout;

              const position = calc(
                () =>
                  ipoint(rect.left, rect.top) -
                  (parentPosition.x > 0 ? parentPosition : 0) +
                  ipoint(rect.width, rect.height)
              );
              const directionInvert = this.direction === 'bottom';

              this.contextAlign = ipoint(
                size.x < position.x ? CONTEXT_ALIGN.LEFT : CONTEXT_ALIGN.RIGHT,
                size.y - 2 <= position.y // subtract 2 px for borders
                  ? directionInvert
                    ? CONTEXT_ALIGN.TOP
                    : CONTEXT_ALIGN.BOTTOM
                  : directionInvert
                    ? CONTEXT_ALIGN.BOTTOM
                    : CONTEXT_ALIGN.TOP
              );
            }

            this.forceVisible = false;
          }, 0);
        });
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-item {
  --color-background: var(--color-context-menu-item-background, #fff);
  --color-title: var(--color-context-menu-item-label, #05a);
  --color-indicator-context: var(
    --color-context-menu-item-indicator-context,
    #05a
  );
  --color-hotkey: var(--color-context-menu-item-hotkey, #05a);

  position: relative;
  float: left;
  display: block;
  user-select: none;

  .wb-env-atom-context-menu-item & {
    float: none;
    line-height: 18px;
  }

  .wb-atom-context-menu .wb-env-atom-context-menu-item & {
    & .inner {
      height: 22px;
      padding: 4px;
      padding-bottom: 1px;
    }
  }

  .wb-atom-context-menu & {
    &:not(.disabled):hover > .inner,
    &:not(.disabled):active > .inner,
    &:not(.disabled).force-visible > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }

    &:not(.disabled):hover > .inner + .wb-atom-context-menu,
    &:not(.disabled):active > .inner + .wb-atom-context-menu,
    &:not(.disabled).force-visible > .inner + .wb-atom-context-menu {
      display: flex;
      visibility: hidden;
      flex-direction: column;
      gap: 0;
      margin-top: -1px;
    }

    &:not(.disabled).context-ready:hover > .inner + .wb-atom-context-menu {
      visibility: visible;
    }
  }

  & > .inner {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    justify-content: flex-end;
    width: 100%;
    height: 20px;
    padding: 3px 4px;
    padding-bottom: 0;
    line-height: 16px;
    color: var(--label);
    white-space: nowrap;
    text-decoration: none;
    appearance: none;
    outline: none;
    background: var(--color-background);
    border: none;

    & > .title {
      display: block;
      flex: 1;
      color: var(--color-title);
      text-align: left;
    }

    & > .indicator-context {
      float: right;
      display: none;
      padding-top: 2px;
      margin-left: 10px;
      line-height: 1;

      & span,
      & svg {
        display: block;
      }

      & svg {
        & :deep(.svg-primary) {
          fill: var(--color-indicator-context);
        }
      }

      .wb-env-atom-context-menu-item .wb-atom-context-menu & {
        display: inline-block;
      }
    }

    & > .checkbox {
      float: left;
      display: none;
      margin-top: -1px;
      margin-right: 4px;

      & svg {
        & :deep(.svg-primary) {
          fill: currentColor !important;
        }

        & :deep(.svg-secondary) {
          visibility: hidden;
          fill: currentColor !important;
        }
      }
    }

    & > input {
      display: none;
    }

    & > input + .checkbox {
      display: inline-block;
    }

    & > .hotkey {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: flex-end;
      padding-left: 10px;

      & svg {
        position: relative;
        top: -1px;
        display: inline-block;

        & :deep(.svg-primary) {
          fill: var(--color-hotkey);
        }
      }
    }

    & > input:checked + .checkbox {
      & svg {
        & :deep(.svg-secondary) {
          visibility: visible !important;
          fill: currentColor !important;
        }
      }
    }
  }

  &.disabled {
    pointer-events: none;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background-color: var(--color-background);
      mask-image: url('../../../assets/img/font-stroke.png');
    }
  }
}
</style>
