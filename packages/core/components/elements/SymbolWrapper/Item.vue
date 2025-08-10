<template>
  <component
    :is="linkTag"
    v-bind="linkBind"
    ref="rootEl"
    :data-id="id"
    class="wb-env-element-symbol-wrapper-item"
    :class="styleClasses"
    :style="[
      layout.size.toCSSVars('item-size'),
      (globalPosition || layout.position).toCSSVars('item-position')
    ]"
    touch-action="none"
    @focus="focused = true"
    @blur="focused = false"
    @click="onClick"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp">
    <div>
      <i>
        <component :is="symbol" />
      </i>
      <span class="label" v-html="model.title" />
    </div>
  </component>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  watch,
  ref,
  reactive,
  toRaw
} from 'vue';

import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Subscription, first } from 'rxjs';

import domEvents from '../../../services/domEvents';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import type { NormalizedPointerEvent } from '../../../services/dom';
import { normalizePointerEvent } from '../../../services/dom';
import type { SymbolLayout } from '../../../types';
import type SymbolItem from '../../../classes/SymbolItem';
import { resolveCommand } from '../../../classes/SymbolItem';
import useCore from '../../../composables/useCore';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import type { ISymbolWrapper } from '@web-workbench/core/classes/SymbolWrapper';

const defaultScrollOffset = ipoint(0, 0);

const $props = defineProps<{
  parentLayout: SymbolLayout | null;
  clampGlobal?: boolean;
  container?: boolean;
  item: SymbolItem;
  scrollOffset?: IPoint;
  wrapper: ISymbolWrapper;
}>();

const symbol = computed(() => {
  const component =
    symbolsModule?.symbols.get(model.value.symbol || SYMBOL.DEFAULT)
      ?.component || symbolsModule?.symbols.get(SYMBOL.DEFAULT)?.component;
  return component ? toRaw(component) : undefined;
});

const { core } = useCore();

const $emit = defineEmits<{
  (e: 'click'): void;
}>();

const wrapperSelectedItems = ref($props.wrapper.selectedItems);

const focused = ref(false);

const globalPosition = ref<(IPoint & number) | null>(null);
const moving = ref(false);
const positions = reactive<{
  start: IPoint & number;
  move: IPoint & number;
  lastPosition: IPoint & number;
  offset: IPoint & number;
  scrollOffset: IPoint & number;
}>({
  start: ipoint(0, 0),
  move: ipoint(0, 0),
  lastPosition: ipoint(0, 0),
  offset: ipoint(0, 0),
  scrollOffset: ipoint(0, 0)
});
const subscription = new Subscription();

const rootEl = ref<HTMLElement | null | undefined>(null);
const parentEl = ref<HTMLElement | null | undefined>(null);
const screenModule = core.value?.modules.screen;
const symbolsModule = core.value?.modules.symbols;

const command = computed(() => {
  return $props.item.command;
});
const id = computed(() => {
  return $props.item.id;
});
const model = computed(() => {
  return $props.item.model;
});
const layout = computed(() => {
  return $props.item.layout;
});
const linkTag = computed(() => {
  return model.value.url ? 'a' : 'button';
});
const linkBind = computed(() => {
  if (!model.value.url) {
    return {};
  }
  return {
    href: model.value.url,
    target: model.value.url ? '_blank' : null,
    title: model.value.title
  };
});
const contentLayout = computed(() => {
  return (
    screenModule?.contentLayout || {
      position: ipoint(0, 0),
      size: ipoint(0, 0)
    }
  );
});
const selected = computed(() => {
  return wrapperSelectedItems.value.includes(id.value);
});
const styleClasses = computed(() => {
  return {
    moving: moving.value,
    selected: selected.value || focused.value,
    'symbol-used': model.value.used
  };
});
watch(
  () => model.value,
  () => {
    onRefresh();
  },
  {
    deep: true
  }
);

onMounted(() => {
  parentEl.value = rootEl.value?.parentElement;
  onRefresh();
});
onUnmounted(() => {
  subscription.unsubscribe();
  $props.wrapper.unselectItem(id.value);
});

function setLayout(layout: Partial<SymbolLayout>) {
  $props.item?.setLayout(layout);
}

let refreshFrame: number;
function onRefresh() {
  setLayout({
    size: ipoint(200, 200)
  });
  window.cancelAnimationFrame(refreshFrame);
  refreshFrame = window.requestAnimationFrame(() => {
    const el = rootEl.value?.children[0];
    if (el && el instanceof HTMLElement) {
      setLayout({
        size: ipoint(el.offsetWidth || 0, el.offsetHeight || 0)
      });
    }
  });
}
function getBounds(el: HTMLElement): SymbolLayout {
  const { width, height, left, top } = el.getBoundingClientRect();
  return { position: ipoint(left, top), size: ipoint(width, height) };
}

let pointerClick = false;
// eslint-disable-next-line complexity
function onClick(e: PointerEvent | NormalizedPointerEvent) {
  if (!pointerClick) {
    const itemId = id.value;

    if (model.value.url && selected.value) {
      return true;
    }

    e.preventDefault();

    if (model.value.used) {
      return true;
    }

    if (command.value && selected.value) {
      const resolvedCommand = resolveCommand(command.value);
      if (resolvedCommand) {
        const executeOptions = {
          showCommand: false,
          show: true
        };
        $props.wrapper.unselectItem(itemId);
        model.value.used = true;
        return core.value
          ?.executeCommand(resolvedCommand, executeOptions)
          .then(() => (model.value.used = false));
      }
    }

    if (domEvents.shiftActive) {
      if ($props.wrapper.isSelectedItem(itemId)) {
        $props.wrapper.unselectItem(itemId);
      } else {
        $props.wrapper.selectItem(itemId);
      }
    } else {
      if (symbolsModule && symbolsModule.getSelectedItems().length > 0) {
        symbolsModule.clearSelectedItems();
      }
      $props.wrapper.selectItem(itemId);
    }

    $emit('click');
  }
  pointerClick = false;
}

function onPointerDown(e: PointerEvent | NormalizedPointerEvent) {
  e = normalizePointerEvent(e);

  pointerClick = false;
  if (onClick(e)) {
    pointerClick = true;
    return;
  }
  pointerClick = true;
  startMove(ipoint(e.x, e.y));
}

function onPointerUp() {
  if (symbolsModule) {
    const selectedItems = symbolsModule
      .getSelectedItems()
      .filter(item => item.id !== id.value);
    const destItem = $props.wrapper.get(id.value);

    if (
      destItem &&
      selectedItems.length > 0 &&
      destItem.fsItem instanceof ItemContainer
    ) {
      selectedItems.forEach(item =>
        $props.wrapper.moveItemToItem(item.fsItem, destItem.fsItem)
      );
    }
  }
}

const currentScrollOffset = computed(() => {
  return $props.scrollOffset || defaultScrollOffset;
});

function startMove(position: IPoint & number) {
  if (parentEl.value) {
    const rootBounds = getBounds(parentEl.value);
    positions.lastPosition = ipoint(
      layout.value.position.x,
      layout.value.position.y
    );
    positions.scrollOffset = ipoint(
      currentScrollOffset.value.x,
      currentScrollOffset.value.y
    );
    positions.start = position;
    positions.offset = ipoint(() => positions.start - layout.value.position);

    setPosition(position, rootBounds, true);
    moving.value = true;

    let lastPosition = position;
    const subscibe = domEvents.pointerMove$.subscribe(e => {
      lastPosition = ipoint(e.x, e.y);
      setPosition(ipoint(e.x, e.y), rootBounds, true);
    });

    subscription.add(
      domEvents.pointerUp$.pipe(first()).subscribe(() => {
        subscibe.unsubscribe();
        if (
          symbolsModule &&
          symbolsModule.getSecondaryWrapper().id !== $props.wrapper.id
        ) {
          return $props.wrapper
            .moveItem(id.value, symbolsModule.getSecondaryWrapper())
            .then((success: boolean) => {
              if (!success) {
                setLayout({
                  position: ipoint(
                    positions.lastPosition?.x,
                    positions.lastPosition?.y
                  )
                });
              }
              globalPosition.value = null;
              moving.value = false;
              return success;
            });
        } else {
          moving.value = false;
          setPosition(lastPosition, rootBounds);
          if (
            !layout.value.position.equals(
              ipoint(() => positions.start - positions.offset)
            )
          ) {
            return $props.wrapper.savePosition(id.value, layout.value.position);
          }
        }
      })
    );
  }
}

function setPosition(
  position: IPoint & number,
  rootBounds: SymbolLayout,
  globalBounds = false
) {
  const rootMinMax = {
    min: ipoint(0, 0),
    max: ipoint(() => rootBounds.size - layout.value.size)
  };

  positions.move = ipoint(() => position - positions.start);
  let current = ipoint(() =>
    Math.round(positions.start + positions.move - positions.offset)
  );

  if (globalBounds) {
    rootMinMax.min = rootBounds.position;
    rootMinMax.max = ipoint(
      () => rootMinMax.max + contentLayout.value.position
    );
    current = ipoint(() => Math.round(current + rootMinMax.min));
    if ($props.clampGlobal) {
      globalPosition.value = ipoint(() =>
        Math.max(
          Math.min(
            current,
            contentLayout.value.position +
              $props.wrapper.size -
              layout.value.size
          ),
          rootMinMax.min
        )
      );
    } else {
      globalPosition.value = current;
    }
  } else {
    if ($props.wrapper.root) {
      // Beim root wrapper wird geklemmt. Der Rand des Bildschirms…
      setLayout({
        position: ipoint(() =>
          Math.max(
            Math.min(current, $props.wrapper.size - layout.value.size),
            0
          )
        )
      });
    } else {
      setLayout({
        position: ipoint(() => Math.max(current, 0))
      });
    }

    globalPosition.value = null;
  }
}
</script>

<style lang="postcss" scoped>
.wb-env-element-symbol-wrapper-item {
  --outline-offset-x: 4px;
  --outline-offset-y: 4px;
  --color-text: var(--color-symbol-wrapper-item-text, #fff);

  position: absolute;
  top: calc(var(--item-position-y) * 1px);
  left: calc(var(--item-position-x) * 1px);
  width: calc(var(--item-size-x) * 1px);
  height: calc(var(--item-size-y) * 1px);
  padding: 0;
  margin: 0;
  appearance: none;
  touch-action: none;
  user-select: none;
  background: transparent;
  border: none;

  &:focus {
    outline: none;
  }

  & div {
    display: inline-block;
  }

  &.moving {
    position: fixed;
    z-index: 100;
    pointer-events: none;
  }

  &a {
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

  & .label {
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
