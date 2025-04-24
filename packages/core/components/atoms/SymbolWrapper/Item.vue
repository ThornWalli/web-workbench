<template>
  <figure
    ref="rootEl"
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
      <i><component :is="symbolsModule?.symbols.get(model.symbol)" /></i>
      <figcaption v-html="model.title" />
    </component>
  </figure>
</template>

<script lang="ts" setup>
import {
  computed,
  markRaw,
  onMounted,
  onUnmounted,
  watch,
  ref,
  reactive
} from 'vue';

import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Subscription, first } from 'rxjs';
import webWorkbench from '@web-workbench/core';
import domEvents from '../../../services/domEvents';
import SymbolWrapper from '../../../classes/SymbolWrapper';
import ItemContainer from '../../../classes/FileSystem/ItemContainer';
import type { NormalizedPointerEvent } from '../../../services/dom';
import { normalizePointerEvent } from '../../../services/dom';
import SvgSymbolDisk1 from '../../../assets/svg/symbols/disk_1.svg?component';
import type { Layout } from '@web-workbench/core/types';
import SymbolItem from '@web-workbench/core/classes/SymbolItem';

const $props = defineProps({
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

  item: {
    type: SymbolItem,
    default() {
      return {
        id: null,
        command: null,
        model: {
          title: 'Item Title',
          url: null,
          symbol: SvgSymbolDisk1,
          used: false,
          visible: true
        },
        layout: {
          position: ipoint(0, 0),
          size: ipoint(50, 50)
        }
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
      return markRaw(new SymbolWrapper(webWorkbench));
    }
  }
});

const $emit = defineEmits(['click']);

const wrapperSelectedItems = ref($props.wrapper.selectedItems);

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
const screenModule = webWorkbench.modules.screen;
const symbolsModule = webWorkbench.modules.symbols;

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
  return model.value.url ? 'a' : 'span';
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
    selected: selected.value,
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
  $props.wrapper.unselectItem(id);
});

function setLayout(layout: Partial<Layout>) {
  $props.item.setLayout(layout);
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
function getBounds(el: HTMLElement): Layout {
  const { width, height, left, top } = el.getBoundingClientRect();
  return { position: ipoint(left, top), size: ipoint(width, height) };
}

function onPointerDown(e: PointerEvent | NormalizedPointerEvent) {
  e = normalizePointerEvent(e);

  const itemId = id.value;

  if (model.value.url && selected.value) {
    // $props.wrapper.unselectItem(id);
    return;
  }

  e.preventDefault();

  if (model.value.used) {
    return;
  }

  if (command.value && selected.value) {
    const executeOptions = {
      showCommand: false,
      show: true
    };
    $props.wrapper.unselectItem(itemId);
    model.value.used = true;
    return webWorkbench
      .executeCommand(command.value, executeOptions)
      .then(() => (model.value.used = false));
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

  startMove(ipoint(e.x, e.y));
  $emit('click');
}

function onPointerUp() {
  if (symbolsModule) {
    const selectedItems = symbolsModule
      .getSelectedItems()
      .filter(item => item.id !== id.value);
    const destItem = $props.wrapper.get(id.value);

    if (selectedItems.length > 0 && destItem.fsItem instanceof ItemContainer) {
      selectedItems.forEach(item =>
        $props.wrapper.moveItemToItem(item.fsItem, destItem.fsItem)
      );
    }
  }
}

function startMove(position: IPoint & number) {
  if (parentEl.value) {
    const rootBounds = getBounds(parentEl.value);
    positions.lastPosition = ipoint(
      layout.value.position.x,
      layout.value.position.y
    );
    positions.scrollOffset = ipoint(
      $props.scrollOffset.x,
      $props.scrollOffset.y
    );
    positions.start = position;
    positions.offset = ipoint(() => positions.start - layout.value.position);

    setPosition(position, rootBounds, true);
    moving.value = true;

    let lastPosition = position;
    const subscibe = domEvents.pointerMove.subscribe(e => {
      lastPosition = ipoint(e.x, e.y);
      setPosition(ipoint(e.x, e.y), rootBounds, true);
    });

    subscription.add(
      domEvents.pointerUp.pipe(first()).subscribe(() => {
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
  rootBounds: Layout,
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
