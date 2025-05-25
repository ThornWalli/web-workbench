<template>
  <div
    ref="rootEl"
    class="wb-env-symbol-wrapper"
    :class="styleClasses"
    :style="style"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove">
    <div ref="helperEl" class="helper" />
    <div ref="itemsEl" class="items">
      <wb-env-element-symbol-wrapper-item
        v-for="(item, index) in visibleItems"
        :key="index"
        :item="item"
        :clamp-global="clampSymbols"
        :wrapper="wrapper"
        :parent-layout="layout"
        :scroll-offset="scrollOffset" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComputedRef,
  type Ref
} from 'vue';

import { ipoint, point } from '@js-basics/vector';
import { CONFIG_NAMES } from '../modules/Symbols/types';

import WbEnvElementSymbolWrapperItem from './elements/SymbolWrapper/Item.vue';
import type SymbolItem from '../classes/SymbolItem';
import type { TriggerRefresh } from '../types/component';

import { ISymbolWrapper } from '../classes/SymbolWrapper';
import type { WindowLayout } from '../types/window';
import type Core from '../classes/Core';
import type { InjectParentLayout } from '../types';

const rootEl = ref<HTMLElement | null>(null);
const helperEl = ref<HTMLElement | null>(null);
const itemsEl = ref<HTMLElement | null>(null);

const $props = defineProps<{
  clampSymbols?: boolean;
  wrapperId: string;
}>();

const windowInstance = inject<Window | undefined>('window', undefined);

const parentScrollable = computed(() => !!windowInstance);

const parentLayout = inject<InjectParentLayout<WindowLayout>>(
  'parentLayout',
  computed(() => {
    return {
      position: ipoint(0, 0),
      size: ipoint(window?.innerWidth, window?.innerHeight)
    };
  })
);
const parentFocused = inject<boolean>('parentFocused', false);

const core = inject<Core>('core');
if (!core) {
  throw new Error('Core not found');
}
const wrapper =
  (ref(
    core?.modules.symbols?.get($props.wrapperId)
  ) as unknown as Ref<ISymbolWrapper>) || ref(new ISymbolWrapper(core));

const $emit = defineEmits<{
  (e: 'ready'): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const wrapperItems: ComputedRef<SymbolItem[]> = computed(() => {
  return wrapper.value.items.value;
});
const wrapperSelectedItems = ref(wrapper.value.selectedItems);

const webWorkbenchConfig = markRaw(core.config.observable);

const layout = computed(() => {
  return wrapper.value.layout;
});

const styleClasses = computed(() => {
  return {
    'parent-scrollable': parentScrollable.value,
    active: (core.modules.symbols?.primaryWrapper || {}).id === wrapper.value.id
  };
});
const scrollOffset = computed(() => {
  if (parentLayout?.value && 'scrollOffset' in parentLayout.value) {
    return parentLayout?.value.scrollOffset;
  }
  return ipoint(0, 0);
});
const style = computed(() => {
  const vars = [scrollOffset.value?.toCSSVars('symbol-wrapper-scroll-offset')];
  if (parentScrollable.value) {
    vars.push(size.value.toCSSVars('symbol-wrapper-size'));
  } else {
    vars.push(layout.value.size.toCSSVars('symbol-wrapper-size'));
  }
  return vars;
});
const size = computed(() => {
  return wrapperItems.value
    .map(item => {
      return {
        item,
        index: wrapperSelectedItems.value.indexOf(item.id) + 1
      };
    })
    .sort((a, b) => {
      if (a.index > b.index) {
        return 1;
      } else if (a.index < b.index) {
        return -1;
      } else {
        return 0;
      }
    })
    .reduce(
      (result, { item }) => {
        const x = item.layout.position.x + item.layout.size.x;
        const y = item.layout.position.y + item.layout.size.y;
        result.x = result.x < x ? x : result.x;
        result.y = result.y < y ? y : result.y;
        return result;
      },
      point(0, 0)
    );
});
const showInvisibleItems = computed(() => {
  return webWorkbenchConfig[CONFIG_NAMES.SHOW_INVISIBLE_SYMBOLS];
});
const visibleItems = computed(() => {
  return wrapperItems.value.filter(isItemVisible);
});
const parentLayoutSize = computed(() => {
  return parentLayout?.value?.size || ipoint(0, 0);
});

watch(
  () => parentFocused,
  focused => {
    setFocused(focused);
  }
);

watch(
  () => $props.wrapperId,
  id => {
    core.modules.symbols?.get(id);
    onResize();
  }
);
watch(
  () => parentLayoutSize,
  () => {
    onResize();
  }
);
watch(
  () => size,
  () => {
    nextTick(() => {
      $emit('refresh', {
        scroll: true
      });
    });
  }
);

onMounted(() => {
  nextTick(() => {
    onResize();
    setFocused(parentFocused);
    $emit('ready');
  });
});

onUnmounted(() => {
  if (
    core.modules.symbols?.getPrimaryWrapper() &&
    core.modules.symbols?.getPrimaryWrapper().id === wrapper.value.id
  ) {
    core.modules.symbols?.setPrimaryWrapper(null);
  }
  if (
    core.modules.symbols?.getSecondaryWrapper() &&
    core.modules.symbols?.getSecondaryWrapper().id === wrapper.value.id
  ) {
    core.modules.symbols?.setSecondaryWrapper(null);
  }
});

function setFocused(focused: boolean = false) {
  if (core && core.modules.symbols) {
    if (focused) {
      if (wrapper.value instanceof ISymbolWrapper) {
        core.modules.symbols.setPrimaryWrapper(wrapper.value);
      }
    } else if (
      core.modules.symbols.getPrimaryWrapper() &&
      core.modules.symbols.getPrimaryWrapper().id === wrapper.value.id
    ) {
      core.modules.symbols.setPrimaryWrapper(null);
    }
  }
}
function onResize() {
  if (rootEl.value && parentLayout?.value) {
    const { left, top } = rootEl.value.getBoundingClientRect();
    wrapper.value.setLayout({
      position: ipoint(left, top),
      size: parentLayout.value.size
    });
    wrapper.value.setSize(
      ipoint(rootEl.value.offsetWidth, rootEl.value.offsetHeight)
    );
    wrapper.value.setParentSize(parentLayout.value.size);
  }
}
function isItemVisible(item: SymbolItem) {
  return (
    showInvisibleItems.value ||
    (!showInvisibleItems.value && item.model.visible)
  );
}
function onPointerMove() {
  if (wrapper.value instanceof ISymbolWrapper) {
    core?.modules.symbols?.setSecondaryWrapper(wrapper.value);
  }
}
function onPointerDown(e: PointerEvent) {
  if (e.target === helperEl.value || e.target === itemsEl.value) {
    wrapper.value.clearSelectedItems();
  }
}
</script>

<style lang="postcss" scoped>
.wb-env-symbol-wrapper {
  position: static;

  &:not(.parent-scrollable) {
    height: 100%;

    & .items {
      height: 100%;
    }
  }

  & .items {
    position: relative;
    top: 0;
    left: 0;
    width: calc(var(--symbol-wrapper-size-x) * 1px);
    height: calc(var(--symbol-wrapper-size-y) * 1px);
  }

  & .helper {
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
