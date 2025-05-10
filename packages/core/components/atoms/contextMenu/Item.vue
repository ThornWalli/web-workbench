<template>
  <component
    :is="tag"
    class="wb-env-atom-context-menu-item"
    :class="styleClasses"
    @mouseover="onMouseOver"
    @touchstart="onTouchstart"
    @click="onClick">
    <component :is="clickTag" ref="clickEl" v-bind="clickData">
      <input
        v-if="hasInput"
        ref="inputEl"
        :type="inputType"
        :name="item.name"
        :value="item.value"
        :checked="
          isInputRadio ? item.getValue() === item.value : !!item.getValue()
        "
        @input="onInput" />
      <span v-if="hasInput" class="checkbox">
        <svg-control-input-checkbox />
      </span>
      <span class="title">{{ item.title }}</span>

      <span v-if="item.hotKey" class="hotkey">
        <svg-control-context-input-hotkey v-if="item.hotKey.alt" />
        <svg-control-context-input-shift v-if="item.hotKey.shift" />
        <span>{{ item.hotKey.title }}</span>
      </span>

      <span v-if="item.items.length > 0" class="indicator-context">
        <svg-control-context-menu-item-indicator-context />
      </span>
    </component>
    <wb-env-molecule-context-menu
      v-if="item.items.length > 0"
      ref="contextMenuEl"
      :items="generateMenuItems(item.items)"
      :parent-layout="parentLayout"
      @input="onInputContextMenu" />
  </component>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { ipoint, calc } from '@js-basics/vector';
import type MenuItem from '../../../classes/MenuItem';
import { MENU_ITEM_TYPE, generateMenuItems } from '../../../classes/MenuItem';
import viewport from '../../../services/viewport';

import domEvents from '../../../services/domEvents';
import WbEnvMoleculeContextMenu from '../../molecules/ContextMenu.vue';
import SvgControlInputCheckbox from '../../../assets/svg/control/input_checkbox.svg?component';
import SvgControlContextInputHotkey from '../../../assets/svg/control/context_item_hotkey.svg?component';
import SvgControlContextInputShift from '../../../assets/svg/control/context_item_shift.svg?component';
import SvgControlContextMenuItemIndicatorContext from '../../../assets/svg/control/context_menu_item_indicator_context.svg?component';
import { isNumeric } from '../../../utils/helper';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Layout } from '@web-workbench/core/types';

enum CONTEXT_ALIGN {
  LEFT = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 3
}

enum DIRECTION {
  TOP = 'top',
  BOTTOM = 'bottom'
}

const defaultDirection = DIRECTION.BOTTOM;
const defaultParentLayout = {
  size: viewport.screenSize
};

const $props = defineProps<{
  item: MenuItem;
  parentLayout: Layout;
  tag: string;
  direction: DIRECTION;
}>();

const $emit = defineEmits<{
  (e: 'click', value: MouseEvent): void;
  (e: 'update:model-value', name: string, value: unknown): void;
}>();

const clickEl = ref();
const inputEl = ref();
const contextMenuEl = ref();

const forceVisible = ref(false);
const contextReady = ref(false);
const contextAlign = ref(ipoint(CONTEXT_ALIGN.RIGHT, CONTEXT_ALIGN.BOTTOM));
const subscription = new Subscription();

const inputType = computed(() => {
  return $props.item.type === MENU_ITEM_TYPE.RADIO ? 'radio' : 'checkbox';
});
const hasInput = computed(() => {
  return [MENU_ITEM_TYPE.CHECKBOX, MENU_ITEM_TYPE.RADIO].includes(
    $props.item.type
  );
});
const isInputRadio = computed(() => {
  return $props.item.type === MENU_ITEM_TYPE.RADIO;
});
const clickTag = computed(() => {
  if (hasInput.value) {
    return 'label';
  } else if ($props.item.url) {
    return 'a';
  }
  return 'button';
});
const clickData = computed(() => {
  const attrs: {
    class: string;
    is?: string;
    href?: string;
  } = {
    class: 'inner',
    is: undefined
  };
  if (hasInput.value) {
    attrs.is = 'label';
  } else if ($props.item.url) {
    attrs.is = 'a';
    attrs.href = $props.item.url;
  }
  return attrs;
});

const styleClasses = computed(() => {
  return {
    'force-visible': forceVisible.value,
    'context-ready': contextReady.value,
    'context-halign-left': contextAlign.value.x === CONTEXT_ALIGN.LEFT,
    'context-halign-right': contextAlign.value.x === CONTEXT_ALIGN.RIGHT,
    'context-valign-top': contextAlign.value.y === CONTEXT_ALIGN.TOP,
    'context-valign-bottom': contextAlign.value.y === CONTEXT_ALIGN.BOTTOM,
    disabled: optionsWrapper.value.disabled
  };
});
const optionsWrapper = computed(() => {
  return $props.item.options;
});

onMounted(() => {
  nextTick(() => {
    if ($props.item.hotKey) {
      subscription.add(
        domEvents.keyDown.subscribe(e => {
          if (
            $props.item.hotKey &&
            domEvents.resolveHotKey($props.item.hotKey, e)
          ) {
            executeAction();
          }
        })
      );
    }
  });
});
onUnmounted(() => {
  subscription.unsubscribe();
});

function onInputContextMenu(name: string, value: unknown) {
  $emit('update:model-value', name, value);
}

function executeAction() {
  if (typeof $props.item.action === 'function') {
    $props.item.action();
  } else {
    (clickEl.value as HTMLElement).click();
  }
}

function onInput(e: Event) {
  let value;
  const el = e.target as HTMLInputElement;
  if (isInputRadio.value) {
    value = el?.value;
  } else {
    value = el?.checked;
  }

  if (isNumeric(value)) {
    $props.item.setValue(Number(value));
  } else {
    $props.item.setValue(value);
  }

  $emit('update:model-value', $props.item.name || '', value);
  if (typeof $props.item.action === 'function') {
    Promise.resolve($props.item.action(value)).catch(err => {
      throw err;
    });
  }
}

function onClick(e: MouseEvent) {
  e.stopPropagation();
  if (!hasInput.value && typeof $props.item.action === 'function') {
    Promise.resolve($props.item.action()).catch(err => {
      throw err;
    });
  } else {
    $emit('click', e);
  }
}

function onTouchstart() {
  if (!contextReady.value) {
    forceVisible.value = true;
  }
  onMouseOver();
}

function onMouseOver() {
  if (!contextReady.value) {
    contextReady.value = true;
    nextTick(() => {
      window.setTimeout(() => {
        if (contextMenuEl.value) {
          const rect = (
            contextMenuEl.value as { $el: HTMLElement }
          ).$el.getBoundingClientRect();
          const { size, position: parentPosition } =
            $props.parentLayout || defaultParentLayout;

          const position = calc(
            () =>
              ipoint(rect.left, rect.top) -
              (parentPosition.x > 0 ? parentPosition : 0) +
              ipoint(rect.width, rect.height)
          );
          const directionInvert =
            ($props.direction || defaultDirection) === 'bottom';

          contextAlign.value = ipoint(
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

        forceVisible.value = false;
      }, 0);
    });
  }
}
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
      gap: 5px;
      align-items: center;
      justify-content: flex-end;
      padding-left: 10px;

      /* & svg + span {
        margin-left: 5px;
      } */

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
