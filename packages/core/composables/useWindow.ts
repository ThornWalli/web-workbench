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
import type Windows from '../classes/modules/Windows';

export default function useWindow() {
  const ready = ref(false);

  const core = inject<Ref<Core>>('core') as Ref<Core>;
  const window = inject<Ref<Window>>('window') as Ref<Window>;
  const refresh = inject('window:refresh') as CallableFunction;

  const id = computed(() => window.value.id);
  const parentFocused = computed(() => window.value.options.focused);
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
      core: core.value,
      mainWindow: unref(window),
      parentWindow: unref(parentWindow),
      preserveContextMenu,
      ...options
    });
  };
  const changeFocus = (value: boolean) => {
    //FIXME: Fix this type workaround, core is not ts compatible
    const windowsModule = (
      core.value.modules as {
        windows: Windows;
      }
    ).windows;
    if (contextMenu.value) {
      if (value) {
        currentContextMenu.value = windowsModule.setActiveContextMenu(
          contextMenu.value
        );
      } else if (
        !preservedContextMenu.value &&
        windowsModule.getActiveContextMenu() === currentContextMenu.value &&
        !embedWindow.value
      ) {
        windowsModule.setActiveContextMenu(null);
      }
    }
  };

  watch(parentFocused, value => changeFocus(value));
  watch(contextMenu, value => {
    //FIXME: Fix this type workaround, core is not ts compatible
    const windowsModule = (
      core.value.modules as {
        windows: Windows;
      }
    ).windows;
    currentContextMenu.value = windowsModule.setActiveContextMenu(value);
  });

  onMounted(() => {
    nextTick(() => {
      ready.value = true;
      changeFocus(true);
    });
  });

  onUnmounted(() => {
    //FIXME: Fix this type workaround, core is not ts compatible
    const windowsModule = (
      core.value.modules as {
        windows: Windows;
      }
    ).windows;
    if (
      contextMenu.value &&
      windowsModule.isContextMenu(currentContextMenu.value)
    ) {
      windowsModule.setActiveContextMenu(null);
    }
  });

  const isReady = computed(() => ready.value);

  return new WindowDescription({
    isReady,
    id,
    parentFocused,
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
  core: Ref<Core>;
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
    this.core = core;
    this.window = window;
    this.setContextMenu = setContextMenu;
    this.preserveContextMenu = preserveContextMenu;
    this.contextMenu = contextMenu;
    this.currentContextMenu = currentContextMenu;
    this.refresh = refresh;
  }
}
