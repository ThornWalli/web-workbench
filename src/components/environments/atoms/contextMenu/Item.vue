<template>
  <component
    :is="tag"
    class="wb-env-atom-context-menu-item"
    :class="styleClasses"
    @mouseover="onMouseOver"
    @touchstart="onMouseOver"
    @click="onClick"
  >
    <component
      :is="clickTag"
      ref="click"
      v-bind="clickData"
    >
      <input
        v-if="hasInput"
        ref="input"
        v-model="model[name]"
        :type="inputType"
        :name="name"
        :value="value"
        @change="onInput"
      >
      <span
        v-if="hasInput"
        class="checkbox"
      >
        <svg-control-input-checkbox />
      </span>
      <span class="title">{{ title }}</span>

      <span
        v-if="hotKey"
        class="hotkey"
      >
        <svg-control-context-input-hotkey /> {{ hotKey }}
      </span>

      <span
        v-if="items.length > 0"
        class="indicator-context"
      >
        <svg-control-context-menu-item-indicator-context />
      </span>
    </component>
    <wb-env-molecule-context-menu
      v-if="items.length > 0"
      ref="contextMenu"
      :items="items"
      :content-size="contentSize"
      @input="onInputContextMenu"
    />
  </component>
</template>

<script>
import { ipoint, calc } from '@js-basics/vector';
import { MENU_ITEM_TYPE, generateMenuItems } from '../../../../web-workbench/classes/MenuItem';
import WbEnvMoleculeContextMenu from '@/components/environments/molecules/ContextMenu';
import SvgControlInputCheckbox from '@/assets/svg/control/input_checkbox.svg?component';
import SvgControlContextInputHotkey from '@/assets/svg/control/context_item_hotkey.svg?component';
import SvgControlContextMenuItemIndicatorContext from '@/assets/svg/control/context_menu_item_indicator_context.svg?component';

import viewport from '@/web-workbench/services/viewport';

import domEvents from '@/web-workbench/services/domEvents';

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
      default () {
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

    contentSize: {
      type: Object,
      default () {
        return viewport.screenSize;
      }
    },

    title: { type: String, default: 'Item Title' },
    hotKey: { type: String, default: null },

    command: { type: String, default: null },
    action: { type: Function, default: null },
    url: { type: String, default: null },

    name: { type: String, default: null },

    value: {
      type: [
        String, Number
      ],
      default: null
    },
    type: { type: Number, default: MENU_ITEM_TYPE.DEFAULT },

    items: {
      type: Array,
      default () {
        return generateMenuItems([
          {
            title: 'Sub Item 1',
            hotKey: 'S',
            keyCode: 73
          },
          {
            separator: true
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
  emits: [
    'click', 'update:modelValue'
  ],

  data () {
    return {
      contextReady: false,
      contextAlign: ipoint(CONTEXT_ALIGN.RIGHT, CONTEXT_ALIGN.BOTTOM),

      subscriptions: [],
      optionsWrapper: { disabled: false, checked: false }
    };
  },

  computed: {
    inputType () {
      return this.isInputRadio ? 'radio' : 'checkbox';
    },
    hasInput () {
      return (this.type === MENU_ITEM_TYPE.CHECKBOX) || (this.type === MENU_ITEM_TYPE.RADIO);
    },
    isInputRadio () {
      return this.type === MENU_ITEM_TYPE.RADIO;
    },

    clickTag () {
      if (this.hasInput) {
        return 'label';
      } else if (this.url) {
        return 'a';
      }
      return 'button';
    },
    clickData () {
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
    disabled () {
      return this.options.disabled;
    },
    styleClasses () {
      return {
        'context-ready': this.contextReady,
        'context-halign-left': (this.contextAlign.x === CONTEXT_ALIGN.LEFT),
        'context-halign-right': (this.contextAlign.x !== CONTEXT_ALIGN.LEFT),
        'context-halign-top': (this.contextAlign.y === CONTEXT_ALIGN.TOP),
        'context-valign-bottom': (this.contextAlign.y !== CONTEXT_ALIGN.TOP),
        disabled: this.optionsWrapper.disabled
      };
    }
  },
  watch: {
    options (options) {
      this.optionsWrapper = options;
    }
  },
  mounted () {
    this.optionsWrapper = this.options;
    if (this.hotKey) {
      this.subscriptions.push(domEvents.keyDown.subscribe((e) => {
        if (domEvents.cmdActive && this.hotKey.charCodeAt(0) === e.keyCode) {
          e.preventDefault();
          this.executeAction();
        }
      }));
    }
  },
  unmounted () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
  methods: {

    onInputContextMenu (...args) {
      this.$emit('update:modelValue', ...args);
    },

    executeAction () {
      if (this.action) {
        this.action();
      } else {
        this.$refs.click.click();
      }
    },

    onInput (e) {
      const value = this.model[this.name]; // this.$refs.input.checked;
      this.$emit('update:modelValue', this.name, value);
      if (typeof this.action === 'function') {
        Promise.resolve(this.action(value)).catch((err) => {
          throw err;
        });
      }
    },

    onClick (e) {
      e.stopPropagation();
      if (!this.hasInput && typeof this.action === 'function') {
        Promise.resolve(this.action()).catch((err) => {
          throw err;
        });
      } else {
        this.$emit('click', e);
      }
    },

    onMouseOver () {
      if (!this.contextReady) {
        this.contextReady = true;
        this.$nextTick(() => {
          window.setTimeout(() => {
            if (this.$refs.contextMenu) {
              const rect = this.$refs.contextMenu.$el.getBoundingClientRect();
              const contentSize = this.contentSize;

              const position = calc(() => ipoint(rect.left, rect.top) + ipoint(rect.width, rect.height));

              this.contextAlign = ipoint(
                contentSize.x < position.x ? CONTEXT_ALIGN.LEFT : CONTEXT_ALIGN.RIGHT,
                contentSize.y < position.y ? CONTEXT_ALIGN.TOP : CONTEXT_ALIGN.BOTTOM
              );
            }
          }, 500);
        });
      }
    }

  }
};

</script>

<style lang="postcss" scoped>
.wb-env-atom-context-menu-item {
  --color__background: var(--color__contextMenuItem__background, #fff);
  --color__label: var(--color__contextMenuItem__label, #05a);
  --color__indicatorContext: var(--color__contextMenuItem__indicatorContext, #05a);
  --color__hotkey: var(--color__contextMenuItem__hotkey, #05a);

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
      filter: var(--filter__default);
    }

    &:not(.disabled):hover > .inner + .wb-atom-context-menu {
      display: block;
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
    background: var(--color__background);
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
        & :deep(.svg__primary) {
          fill: var(--color__indicatorContext);
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
        & :deep(.svg__primary) {
          fill: currentColor !important;
        }

        & :deep(.svg__secondary) {
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

        & :deep(.svg__primary) {
          fill: var(--color__hotkey);
        }
      }
    }

    & > input:checked + .checkbox {
      & svg {
        & :deep(.svg__secondary) {
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
      content: "";
      background-color: var(--color__background);
      mask-image: url("@/assets/img/font-stroke.png");
    }

  }
}
</style>
