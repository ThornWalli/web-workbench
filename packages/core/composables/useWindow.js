import {
  unref,
  watch,
  computed,
  ref,
  onMounted,
  onUnmounted,
  inject
} from 'vue';

import ContextMenuItems from '../classes/ContextMenuItems';

import { nextTick } from '#imports';

export default function useWindow() {
  const ready = ref(false);

  const core = inject('core');
  const window = inject('window');
  const refresh = inject('window:refresh');

  const id = computed(() => window.value.id);
  const parentFocused = computed(() => window.value.options.focused);
  const parentWindow = computed(() => window.value.parentWindow);

  const currentContextMenu = ref();
  const contextMenu = ref();

  const embeddedWindow = computed(() => window.value.options.embedded);

  const preservedContextMenu = ref(false);
  const preserveContextMenu = (value = true) => {
    preservedContextMenu.value = value;
  };

  const setContextMenu = (value, options = {}) => {
    contextMenu.value = new ContextMenuItems(value, {
      core: core.value,
      mainWindow: unref(window),
      parentWindow: unref(parentWindow),
      preserveContextMenu,
      ...options
    });
  };
  const changeFocus = value => {
    if (contextMenu.value) {
      if (value) {
        currentContextMenu.value =
          core.value.modules.windows.setActiveContextMenu(contextMenu.value);
      } else if (
        !preservedContextMenu.value &&
        core.value.modules.windows.getActiveContextMenu() ===
          currentContextMenu.value &&
        !embeddedWindow.value
      ) {
        core.value.modules.windows.setActiveContextMenu(null);
      }
    }
  };

  watch(parentFocused, value => changeFocus(value));
  watch(contextMenu, value => {
    currentContextMenu.value =
      core.value.modules.windows.setActiveContextMenu(value);
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
      core.value.modules.windows.isContextMenu(currentContextMenu.value)
    ) {
      core.value.modules.windows.setActiveContextMenu(null);
    }
  });

  const isReady = computed(() => ready.value);

  return new WindowDesription({
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

class WindowDesription {
  /**
   * @type {import('vue').ComputedRef<Boolean>}
   */
  isReady;

  /**
   * @type {import('vue').ComputedRef<String>}
   */
  id;
  /**
   * @type {import('vue').ComputedRef<Boolean>}
   */
  parentFocused;

  /**
   * @type {import('vue').Ref<import('../classes/Core').default>}
   */
  core;

  /**
   * @type {import('vue').Ref<import('../classes/Window').default>}
   */
  window;

  /**
   * @type {Function}
   */
  setContextMenu;

  /**
   * @type {Function}
   */
  preserveContextMenu;

  /**
   * @type {import('vue').Ref<ContextMenuItems>}
   */
  contextMenu;

  /**
   * @type {import('vue').Ref<ContextMenuItems>}
   */
  currentContextMenu;

  /**
   * @type {Function}
   */
  refresh;

  constructor({
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
  }) {
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
