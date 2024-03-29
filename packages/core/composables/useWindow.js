import {
  unref,
  watch,
  computed,
  ref,
  toRefs,
  onMounted,
  onUnmounted
} from 'vue';

import ContextMenuItems from '../classes/ContextMenuItems';

import { nextTick } from '#imports';

export default function useWindow(props, context = {}) {
  const refs = toRefs(props);

  const { id, parentFocused, core, window, parentWindow } = refs;

  const currentContextMenu = ref();
  const contextMenu = ref();

  const embeddedWindow = computed(() => window.value.options.embedded);

  const setContextMenu = (value, options = {}) => {
    contextMenu.value = new ContextMenuItems(value, {
      core: core.value,
      mainWindow: unref(window),
      parentWindow: unref(parentWindow),
      preserveContextMenu,
      ...options
    });
  };

  const preservedContextMenu = ref(false);
  const preserveContextMenu = (value = true) => {
    preservedContextMenu.value = value;
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
      context.emit('ready');
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
  return {
    id,
    parentFocused,
    core,
    window,
    setContextMenu,
    preserveContextMenu,
    contextMenu,
    currentContextMenu
  };
}

export const windowProps = {
  id: {
    type: String,
    default: ''
  },
  parentFocused: {
    type: Boolean,
    default: false
  },
  core: {
    type: Object,
    required: true
  },
  window: {
    type: Object,
    required: true
  },
  parentWindow: {
    type: Object,
    required: false
  }
};

export const windowEmits = ['ready'];
