import {
  unref,
  watch,
  computed,
  ref,
  onMounted,
  onUnmounted,
  inject,
  type Ref,
  type ComputedRef
} from 'vue';

import ContextMenuItems from '../classes/ContextMenuItems';

import { nextTick } from '#imports';
import type Window from '../classes/Window';
import type Core from '../classes/Core';
import type MenuItem from '../classes/MenuItem';
import type { WindowLayout } from '../types/window';

export default function useWindow() {
  const ready = ref(false);

  const core = inject<Core>('core') as Core;
  const window = inject<Ref<Window>>('window') as Ref<Window>;
  const refresh = inject('window:refresh') as CallableFunction;

  const id = computed(() => window.value.id);
  const parentLayout = computed(() => window.value.layout);
  const parentFocused = computed(() => window.value.options.focused || false);
  const parentWindow = computed(() => window.value.parentWindow);

  const currentContextMenu = ref();
  const contextMenu = ref();

  const embedWindow = computed(() => window.value.options.embed);

  const preservedContextMenu = ref(false);
  const preserveContextMenu = (value = true) => {
    preservedContextMenu.value = value;
  };

  const setContextMenu = (
    value: (arg: unknown) => MenuItem[],
    options = {}
  ) => {
    contextMenu.value = new ContextMenuItems(value, {
      core: core,
      mainWindow: unref(window),
      parentWindow: unref(parentWindow),
      preserveContextMenu,
      ...options
    });
  };
  const changeFocus = (value: boolean) => {
    if (contextMenu.value) {
      if (value) {
        currentContextMenu.value = core.modules.windows?.setActiveContextMenu(
          contextMenu.value
        );
      } else if (
        !preservedContextMenu.value &&
        core.modules.windows?.getActiveContextMenu() ===
          currentContextMenu.value &&
        !embedWindow.value
      ) {
        core.modules.windows?.setActiveContextMenu(null);
      }
    }
  };

  watch(parentFocused, value => changeFocus(value));
  watch(contextMenu, value => {
    currentContextMenu.value =
      core.modules.windows?.setActiveContextMenu(value);
  });

  onMounted(() => {
    nextTick(() => {
      ready.value = true;
      changeFocus(true);
    });
  });

  onUnmounted(() => {
    if (
      contextMenu.value &&
      core.modules.windows?.isContextMenu(currentContextMenu.value)
    ) {
      core.modules.windows?.setActiveContextMenu(null);
    }
  });

  const isReady = computed(() => ready.value);

  return new WindowDescription({
    isReady,
    id,
    parentFocused,
    parentLayout,
    core,
    window,
    setContextMenu,
    preserveContextMenu,
    contextMenu,
    currentContextMenu,
    refresh
  });
}

class WindowDescription {
  isReady: ComputedRef<boolean>;
  id: ComputedRef<string>;
  parentFocused: ComputedRef<boolean>;
  parentLayout: ComputedRef<WindowLayout>;
  core: Core;
  window: Ref<Window>;
  setContextMenu: CallableFunction;
  preserveContextMenu: CallableFunction;
  contextMenu: Ref<ContextMenuItems>;
  currentContextMenu: Ref<ContextMenuItems>;
  refresh: CallableFunction;

  constructor(options: WindowDescription) {
    const {
      isReady,
      id,
      parentFocused,
      parentLayout,
      core,
      window,
      setContextMenu,
      preserveContextMenu,
      contextMenu,
      currentContextMenu,
      refresh
    } = options;
    this.isReady = isReady;
    this.id = id;
    this.parentFocused = parentFocused;
    this.parentLayout = parentLayout;
    this.core = core;
    this.window = window;
    this.setContextMenu = setContextMenu;
    this.preserveContextMenu = preserveContextMenu;
    this.contextMenu = contextMenu;
    this.currentContextMenu = currentContextMenu;
    this.refresh = refresh;
  }
}
