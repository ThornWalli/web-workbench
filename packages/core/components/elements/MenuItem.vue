<template>
  <component
    :is="tag"
    class="wb-env-element-context-menu-item"
    :class="styleClasses">
    <component
      :is="clickTag"
      ref="clickEl"
      :disabled="disabled"
      v-bind="clickData"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClick"
      @pointerover.passive="onMouseOver"
      @touchstart.passive="onTouchstart">
      <input
        v-if="item instanceof MenuItemInteraction && hasInput"
        ref="inputEl"
        :type="inputType"
        :name="item.name || id"
        :value="item.value"
        :checked="currentChecked"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClickInput"
        @input="onInput" />
      <span v-if="hasInput" class="checkbox">
        <svg-control-input-checkbox />
      </span>
      <span class="title">{{ title }}</span>

      <span v-if="hotKey" class="hotkey">
        <svg-control-context-input-shift v-if="hotKey.shift" />
        <svg-control-context-input-command-osx v-if="isMac && hotKey.meta" />
        <svg-control-context-input-command v-else-if="hotKey.meta" />
        <svg-control-context-input-option v-if="isMac && hotKey.alt" />
        <svg-control-context-input-alt v-else-if="hotKey.alt" />
        <svg-control-context-input-control-osx v-if="isMac && hotKey.ctrl" />
        <svg-control-context-input-control v-else-if="hotKey.ctrl" />
        <span>{{ hotKey.title }}</span>
      </span>

      <span v-if="item.items.length > 0" class="indicator-context">
        <svg-control-context-menu-item-indicator-context />
      </span>
    </component>
    <wb-env-fragment-context-menu
      v-if="item.items.length > 0"
      ref="contextMenuEl"
      :core="core"
      :items="generateMenuItems(item.items)"
      :parent-layout="parentLayout"
      @input="onInputContextMenu" />
  </component>
</template>

<script lang="ts" setup>
import { filter, Subscription } from 'rxjs';
import { ipoint, calc } from '@js-basics/vector';
import viewport from '../../services/viewport';

import domEvents from '../../services/domEvents';
import WbEnvFragmentContextMenu from '../fragments/ContextMenu.vue';
import SvgControlInputCheckbox from '../../assets/svg/control/input_checkbox.svg?component';
// import SvgControlContextInputHotkey from '../../assets/svg/control/context_item_hotkey.svg?component';
import SvgControlContextInputShift from '../../assets/svg/control/context_item_shift.svg?component';
import SvgControlContextInputAlt from '../../assets/svg/control/context_item_alt.svg?component';
import SvgControlContextInputCommand from '../../assets/svg/control/context_item_command.svg?component';
import SvgControlContextInputCommandOsx from '../../assets/svg/control/context_item_command_osx.svg?component';
import SvgControlContextInputControl from '../../assets/svg/control/context_item_control.svg?component';
import SvgControlContextInputControlOsx from '../../assets/svg/control/context_item_control_osx.svg?component';
import SvgControlContextInputOption from '../../assets/svg/control/context_item_option.svg?component';
import SvgControlContextMenuItemIndicatorContext from '../../assets/svg/control/context_menu_item_indicator_context.svg?component';
import { isNumeric } from '../../utils/helper';
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch
} from 'vue';
import type { Ref } from 'vue';
import type { SymbolWrapperLayout } from '@web-workbench/core/classes/SymbolWrapper/types';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';

import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemSpacer
} from '@web-workbench/core/classes/MenuItem';
import type { MenuItems } from '@web-workbench/core/classes/MenuItem/types';
import { generateMenuItems } from '@web-workbench/core/utils/menuItems';
import type Core from '@web-workbench/core/classes/Core';
import { isMacOS } from '@web-workbench/core/services/dom';

const isMac = ref(isMacOS());

const id = useId();

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

const closeContextMenu = inject('closeContextMenu', () => void 0);
defineExpose({ closeContextMenu });

const defaultDirection = DIRECTION.BOTTOM;
const defaultParentLayout = {
  size: viewport.screenSize,
  position: ipoint(0, 0)
};
function getComputedValue<T>(value: unknown) {
  if (value && typeof value === 'object' && 'value' in value) {
    return value as T;
  }
  return value as T;
}
const currentChecked = computed(() => {
  const item = $props.item as MenuItemInteraction;
  if (item.type === INTERACTION_TYPE.CUSTOM) {
    // is computed?
    return getComputedValue<boolean>(item.options.checked);
  } else {
    return isInputRadio.value
      ? item.getValue() === item.value
      : !!item.getValue();
  }
});

const hasActiveItems = computed(
  () =>
    $props.item.items.filter(
      item =>
        !(
          item instanceof MenuItemSeparator || item instanceof MenuItemSpacer
        ) && !item.options.disabled
    ).length > 0
);

const $props = defineProps<{
  item: MenuItems;
  parentLayout: SymbolWrapperLayout;
  tag: string;
  direction: DIRECTION;
  core?: Core;
}>();

const $emit = defineEmits<{
  (e: 'click', value: MouseEvent): void;
  (e: 'update:model-value', name: string, value: unknown): void;
}>();

const clickEl = ref();
const inputEl = ref();
const contextMenuEl = ref<{
  $el: Ref<HTMLElement | undefined>;
  hasFocusedItem: boolean;
}>();

const focused = ref(false);
const forceVisible = ref(false);
const contextReady = ref(false);
const contextAlign = ref(ipoint(CONTEXT_ALIGN.RIGHT, CONTEXT_ALIGN.BOTTOM));
const subscription = new Subscription();

const inputType = computed(() => {
  return $props.item instanceof MenuItemInteraction &&
    $props.item.type === INTERACTION_TYPE.RADIO
    ? 'radio'
    : 'checkbox';
});
const hasInput = computed(() => {
  if ($props.item instanceof MenuItemInteraction) {
    const type = $props.item.type;
    return (
      type !== undefined &&
      [
        INTERACTION_TYPE.CUSTOM,
        INTERACTION_TYPE.CHECKBOX,
        INTERACTION_TYPE.RADIO
      ].includes(type)
      // $props.item.options.checked !== undefined
    );
  }
  return false;
});

const hasModelValue = computed(() => {
  return (
    $props.item instanceof MenuItemInteraction &&
    $props.item.name !== undefined &&
    $props.item.name.length > 0
  );
});

const title = computed(() => {
  if ($props.item instanceof MenuItemInteraction) {
    return $props.item.title || '';
  }
  return undefined;
});
const hotKey = computed(() => {
  if ($props.item instanceof MenuItemInteraction) {
    return $props.item.hotKey;
  }
  return undefined;
});

const isInputRadio = computed(() => {
  return (
    $props.item instanceof MenuItemInteraction &&
    $props.item.type === INTERACTION_TYPE.RADIO
  );
});
const clickTag = computed(() => {
  if (hasModelValue.value) {
    return 'label';
  } else if ($props.item instanceof MenuItemInteraction && $props.item.url) {
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
  if (hasModelValue.value) {
    attrs.is = 'label';
  } else if ($props.item instanceof MenuItemInteraction && $props.item.url) {
    attrs.is = 'a';
    attrs.href = $props.item.url;
  }
  return attrs;
});

const styleClasses = computed(() => {
  return {
    focused: focused.value,
    'force-visible': forceVisible.value,
    'context-ready': contextReady.value,
    'context-halign-left': contextAlign.value.x === CONTEXT_ALIGN.LEFT,
    'context-halign-right': contextAlign.value.x === CONTEXT_ALIGN.RIGHT,
    'context-valign-top': contextAlign.value.y === CONTEXT_ALIGN.TOP,
    'context-valign-bottom': contextAlign.value.y === CONTEXT_ALIGN.BOTTOM,
    disabled: disabled.value
  };
});
const disabled = computed(() => {
  return (
    $props.item instanceof MenuItemInteraction &&
    ((!$props.item.action &&
      ((!hasActiveItems.value && contextMenuEl.value) ||
        optionsWrapper.value.disabled)) ||
      ($props.item.action && optionsWrapper.value.disabled))
  );
});
const optionsWrapper = computed(() => {
  return $props.item.options;
});

onMounted(() => {
  nextTick(() => {
    if ($props.item instanceof MenuItemInteraction && $props.item.hotKey) {
      subscription.add(
        domEvents.keyDown
          .pipe(
            filter(
              e =>
                !!(
                  $props.item instanceof MenuItemInteraction &&
                  $props.item.hotKey &&
                  domEvents.resolveHotKey($props.item.hotKey, e)
                )
            )
          )
          .subscribe(e => {
            e.preventDefault();
            executeAction();
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

async function executeAction() {
  if (
    $props.item instanceof MenuItemInteraction &&
    typeof $props.item.action === 'function'
  ) {
    try {
      await $props.item.action({ closeContextMenu });
    } catch (error) {
      console.error(error);
      $props.core?.errorObserver.next(error as Error);
    }
  } else {
    (clickEl.value as HTMLElement).click();
  }
}

function onInput(e: Event) {
  if (!($props.item instanceof MenuItemInteraction)) return;

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
    Promise.resolve($props.item.action({ closeContextMenu, value })).catch(
      err => {
        throw err;
      }
    );
  }
}

async function onClick(e: PointerEvent) {
  if (
    e.pointerType === '' &&
    contextMenuEl.value &&
    hasActiveItems.value &&
    !contextReady.value &&
    focused.value
  ) {
    onTouchstart();
  } else {
    if (
      $props.item instanceof MenuItemInteraction &&
      !hasModelValue.value &&
      typeof $props.item.action === 'function'
    ) {
      try {
        await $props.item.action({ closeContextMenu });
      } catch (error) {
        console.error(error);
        $props.core?.errorObserver.next(error as Error);
      }
    } else {
      $emit('click', e);
    }
  }
}

async function onClickInput(e: MouseEvent) {
  // e.preventDefault();
  // e.stopPropagation();
  // e.stopPropagation();
  if (
    $props.item instanceof MenuItemInteraction &&
    !hasInput.value &&
    typeof $props.item.action === 'function'
  ) {
    try {
      await $props.item.action({ closeContextMenu });
    } catch (error) {
      console.error(error);
      $props.core?.errorObserver.next(error as Error);
    }
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
        if (
          contextMenuEl.value &&
          contextMenuEl.value.$el instanceof HTMLElement
        ) {
          const rect = contextMenuEl.value.$el.getBoundingClientRect();
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
          if (!directionInvert && $props.direction === 'top') {
            // debugger;
          }
          contextAlign.value = ipoint(
            size.x < position.x ? CONTEXT_ALIGN.LEFT : CONTEXT_ALIGN.RIGHT,
            size.y - 2 <= position.y // subtract 2 px for borders
              ? directionInvert
                ? CONTEXT_ALIGN.BOTTOM
                : CONTEXT_ALIGN.TOP
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

const addItemFocus = inject<CallableFunction>('addItemFocus');
const removeItemFocus = inject<CallableFunction>('removeItemFocus');

const onFocus = () => {
  focused.value = true;
  if (addItemFocus) {
    addItemFocus($props.item.id);
  }
};

const contextMenuFocus = computed(() => {
  return contextMenuEl.value?.hasFocusedItem || false;
});

let timeout: number = -1;
watch(
  () => contextMenuFocus.value,
  value => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      if (!value) {
        onBlur();
        // contextReady.value = false;
      }
    }, 0);
  }
);

let blurTimeout: number = -1;
const onBlur = () => {
  window.clearTimeout(blurTimeout);
  blurTimeout = window.setTimeout(() => {
    if (!contextMenuFocus.value) {
      focused.value = false;
      if (removeItemFocus) {
        removeItemFocus($props.item.id);
      }
    }
  });
};
</script>

<style lang="postcss" scoped>
.wb-env-element-context-menu-item {
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

  .wb-env-element-context-menu-item & {
    float: none;
    line-height: 18px;
  }

  .wb-element-context-menu .wb-env-element-context-menu-item & {
    & .inner {
      height: 22px;
      padding: 4px;
      padding-bottom: 1px;
    }
  }

  .wb-element-context-menu:not(.ignore-hover) & {
    &:not(.disabled).focused > .inner,
    &:not(.disabled):hover > .inner,
    &:not(.disabled):active > .inner,
    &:not(.disabled).force-visible > .inner {
      /* padding-bottom: 1px; */
      filter: var(--filter-default);
    }

    &:not(.disabled).focused > .inner + .wb-element-context-menu,
    &:not(.disabled):hover > .inner + .wb-element-context-menu,
    &:not(.disabled):active > .inner + .wb-element-context-menu,
    &:not(.disabled).force-visible > .inner + .wb-element-context-menu {
      display: flex;
      visibility: hidden;
      flex-direction: column;
      gap: 0;
      margin-top: -1px;
    }

    &:not(.disabled).context-ready.focused > .inner + .wb-element-context-menu,
    &:not(.disabled).context-ready:hover > .inner + .wb-element-context-menu {
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

      .wb-env-element-context-menu-item .wb-element-context-menu & {
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
      position: absolute;
      opacity: 0;
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
      font-family: var(--font-family-workbench-topaz-block);

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
      mask-image: url('../../assets/img/font-stroke.png');
    }
  }
}
</style>
