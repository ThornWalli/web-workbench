<template>
  <li
    :is="tag"
    class="wb-env-atom-context-menu-item"
    :class="styleClasses"
    @mouseover="onMouseOver"
    @touchstart="onMouseOver"
    @click="onClick"
  >
    <span
      ref="click"
      v-bind="clickTag"
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
        class="item__checkbox"
      >
        <svg-control-input-checkbox />
      </span>
      <span class="item__title">{{ title }}</span>

      <span
        v-if="hotKey"
        class="item__hotkey"
      >
        <svg-control-context-input-hotkey /> {{ hotKey }}
      </span>

      <span
        v-if="items.length > 0"
        class="item__indicator-context"
      >
        <svg-control-context-menu-item-indicator-context />
      </span>
    </span>
    <wb-env-molecule-context-menu
      v-if="items.length > 0"
      ref="contextMenu"
      :items="items"
      :content-size="contentSize"
      @input="onInputContextMenu"
    />
  </li>
</template>

<story
  name="Item"
  group="Environments/Atoms/ContextMenu"
  knobs="{}">

  <Item />
</story>

<script>
import { ipoint, calc } from '@js-basics/vector';
import { MENU_ITEM_TYPE, generateMenuItems } from '../../../../web-workbench/classes/MenuItem';
import WbEnvMoleculeContextMenu from '@/components/environments/molecules/ContextMenu';
import SvgControlInputCheckbox from '@/assets/svg/control/input_checkbox.svg?vue-template';
import SvgControlContextInputHotkey from '@/assets/svg/control/context_item_hotkey.svg?vue-template';
import SvgControlContextMenuItemIndicatorContext from '@/assets/svg/control/context_menu_item_indicator_context.svg?vue-template';

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
      default () {
        return {
          [this.name]: false
        };
      }
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

  data () {
    return {
      contextReady: false,
      contextAlign: ipoint(CONTEXT_ALIGN.RIGHT, CONTEXT_ALIGN.BOTTOM),

      subscribtions: [],
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
      const attrs = {
        is: 'button',
        class: 'item__inner'
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
        'js--checked': this.isInputRadio ? this.checked === this.value : this.checked,
        'js--context-ready': this.contextReady,
        'js--context-halign-left': (this.contextAlign.x === CONTEXT_ALIGN.LEFT),
        'js--context-halign-right': (this.contextAlign.x !== CONTEXT_ALIGN.LEFT),
        'js--context-halign-top': (this.contextAlign.y === CONTEXT_ALIGN.TOP),
        'js--context-valign-bottom': (this.contextAlign.y !== CONTEXT_ALIGN.TOP),
        'js--disabled': this.optionsWrapper.disabled
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
      this.subscribtions.push(domEvents.keyDown.subscribe((e) => {
        if (domEvents.cmdActive && this.hotKey.charCodeAt(0) === e.keyCode) {
          e.preventDefault();
          this.executeAction();
        }
      }));
    }
  },
  destroyed () {
    this.subscribtions.forEach(subscription => subscription.unsubscribe());
  },
  methods: {

    onInputContextMenu (...args) {
      this.$emit('input', ...args);
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
      this.$emit('input', this.name, value);
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
          global.setTimeout(() => {
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

<style lang="postcss">

:root {
  --color__contextMenuItem__background: #fff;
  --color__contextMenuItem__label: #05a;
  --color__contextMenuItem__indicatorContext: #05a;
  --color__contextMenuItem__hotkey: #05a;
}

.wb-env-atom-context-menu-item {
  position: relative;
  display: block;
  float: left;

  @nest .wb-env-atom-context-menu-item & {
    float: none;
    line-height: 18px;
  }

  @nest .wb-atom-context-menu .wb-env-atom-context-menu-item & {
    & .item__inner {
      padding: 4px;
      padding-bottom: 1px;
    }
  }

  @nest .wb-atom-context-menu & {
    &:not(.disabled):hover > .item__inner {
      /* padding-bottom: 1px; */
      filter: var(--filter__default);
    }

    &:not(.disabled):hover > .item__inner + .wb-atom-context-menu {
      display: block;
      margin-top: -1px;
      visibility: hidden;
    }

    &:not(.disabled).js--context-ready:hover > .item__inner + .wb-atom-context-menu {
      visibility: visible;
    }
  }

  & > .item__inner {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    justify-content: flex-end;
    width: 100%;
    padding: 2px 4px;
    padding-bottom: 0;
    color: var(--color__contextMenuItem__label);
    text-decoration: none;
    white-space: nowrap;
    background: var(--color__contextMenuItem__background);
    border: none;
    outline: none;
    -webkit-appearance: none;

    & > .item__title {
      display: block;
      flex: 1;
      text-align: left;
    }

    & > .item__indicator-context {
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
        /*
          margin-left: calc(4 / var(--global_fontSize))em; */
        & .svg__primary {
          fill: var(--color__contextMenuItem__indicatorContext);
        }
      }

      @nest .wb-env-atom-context-menu-item .wb-atom-context-menu & {
        display: inline-block;
      }
    }

    & > .item__checkbox {
      display: none;
      float: left;
      margin-top: -1px;
      margin-right: 4px;

      & svg {
        & .svg__primary {
          fill: currentColor !important;
        }

        & .svg__secondary {
          visibility: hidden;
          fill: currentColor !important;
        }
      }
    }

    & > input {
      display: none;
    }

    & > input + .item__checkbox {
      display: inline-block;
    }

    & > .item__hotkey {
      display: inline-block;

      /* float: right; */
      justify-content: flex-end;
      padding-left: 10px;

      & svg {
        position: relative;
        top: -1px;
        display: inline-block;

        & .svg__primary {
          fill: var(--color__contextMenuItem__hotkey);
        }
      }
    }

    & > input:checked + .item__checkbox {
      & svg {
        & .svg__secondary {
          visibility: visible !important;
          fill: currentColor !important;
        }
      }
    }
  }

  &.js--disabled {
    pointer-events: none;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: "";
      background-color: var(--color__contextMenuItem__background);
      mask-image: url("~assets/img/font-stroke.png");
    }
  }
}
</style>
