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
import type { MenuItemBase } from '../classes/MenuItem';
import type { WindowLayout } from '../types/window';

export default function useWindow() {
  const ready = ref(false);

  const core = inject<Core>('core');
  const window = inject<Window>('window');
  if (!core || !window) {
    throw new Error('Core or Window not found');
  }
  const refresh = inject('window:refresh') as CallableFunction;

  const id = computed(() => window.id);
  const parentLayout = computed(() => window.layout);
  const parentFocused = computed(() => window.options.focused || false);
  const parentWindow = computed(() => window.parentWindow);

  const currentContextMenu = ref();
  const contextMenu = ref();

  const embedWindow = computed(() => window.options.embed);

  const preservedContextMenu = ref(false);
  const preserveContextMenu = (value = true) => {
    preservedContextMenu.value = value;
  };

  const setContextMenu = (
    value: (arg: unknown) => MenuItemBase[],
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

  const close = () => {
    window.close();
  };

  let lastTitle: string | undefined;
  const setTitle = (title: string) => {
    if (window.options.title !== title) {
      lastTitle = window.options.title;
      window.options.title = title;
    }
  };

  let titleStatus = WINDOW_TITLE_STATUS.NONE;
  const setTitleStatus = (status: WINDOW_TITLE_STATUS) => {
    if (
      titleStatus === WINDOW_TITLE_STATUS.EDIT &&
      status === WINDOW_TITLE_STATUS.NONE
    ) {
      window.options.title = lastTitle;
    } else if (
      titleStatus === WINDOW_TITLE_STATUS.NONE &&
      status === WINDOW_TITLE_STATUS.EDIT
    ) {
      lastTitle = window.options.title;
      window.options.title = `${window.options.title} (unsaved)`;
    }
    titleStatus = status;
  };

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
    refresh,
    close,
    setTitle,
    setTitleStatus
  });
}

export enum WINDOW_TITLE_STATUS {
  NONE = 0,
  EDIT = 1
}

class WindowDescription {
  isReady: ComputedRef<boolean>;
  id: ComputedRef<string>;
  parentFocused: ComputedRef<boolean>;
  parentLayout: ComputedRef<WindowLayout>;
  core: Core;
  window: Window;
  setContextMenu: CallableFunction;
  preserveContextMenu: CallableFunction;
  contextMenu: Ref<ContextMenuItems>;
  currentContextMenu: Ref<ContextMenuItems>;
  refresh: CallableFunction;
  close: CallableFunction;
  setTitle: (title: string) => void;
  setTitleStatus: (status: WINDOW_TITLE_STATUS) => void;

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
      refresh,
      close,
      setTitle,
      setTitleStatus
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
    this.close = close;
    this.setTitle = setTitle;
    this.setTitleStatus = setTitleStatus;
  }
}
