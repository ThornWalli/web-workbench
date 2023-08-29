<template>
  <component
    :is="tag"
    class="wb-env-atom-context-menu-item"
    :class="styleClasses"
    @mouseover="onMouseOver"
    @touchstart="onMouseOver"
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
        'context-ready': this.contextReady,
        'context-halign-left': this.contextAlign.x === CONTEXT_ALIGN.LEFT,
        'context-halign-right': this.contextAlign.x !== CONTEXT_ALIGN.LEFT,
        'context-valign-top': this.contextAlign.y === CONTEXT_ALIGN.TOP,
        'context-valign-bottom': this.contextAlign.y !== CONTEXT_ALIGN.TOP,
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
      this.model[this.name] = isNaN(value) ? value : Number(value);

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

    onMouseOver() {
      if (!this.contextReady) {
        this.contextReady = true;
        this.$nextTick(() => {
          window.setTimeout(() => {
            if (this.$refs.contextMenu) {
              const rect = this.$refs.contextMenu.$el.getBoundingClientRect();
              const { size } = this.parentLayout;

              const position = calc(
                () =>
                  ipoint(rect.left, rect.top) + ipoint(rect.width, rect.height)
              );
              this.contextAlign = ipoint(
                size.x < position.x ? CONTEXT_ALIGN.LEFT : CONTEXT_ALIGN.RIGHT,
                size.y - 2 <= position.y // subtract 2 px for borders
                  ? CONTEXT_ALIGN.TOP
                  : CONTEXT_ALIGN.BOTTOM
              );
            }
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
  --color-label: var(--color-context-menu-item-label, #05a);
  --color-indicator-context: var(
    --color-context-menu-item-indicator-context,
    #05a
  );
  --color-hotkey: var(--color-context-menu-item-hotkey, #05a);

  position: relative;
  display: block;
  float: left;
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
    &:not(.disabled):hover > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }

    &:not(.disabled):hover > .inner + .wb-atom-context-menu {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-top: -1px;
      visibility: hidden;
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
    text-decoration: none;
    white-space: nowrap;
    appearance: none;
    background: var(--color-background);
    border: none;
    outline: none;

    & > .title {
      display: block;
      flex: 1;
      text-align: left;
    }

    & > .indicator-context {
      display: none;
      float: right;
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
      display: none;
      float: left;
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
      display: inline-block;

      /* float: right; */
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
