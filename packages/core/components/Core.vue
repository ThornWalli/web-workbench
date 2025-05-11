<template>
  <div ref="rootEl" class="wb-env-core" :class="styleClasses" :style="style">
    <wb-env-screen
      ref="screenEl"
      v-model="screenOptions"
      :boot-sequence="screenBootSequence"
      :theme="theme"
      :cursor="cursor"
      v-bind="screen"
      @toggle-screen-active="onToggleScreenActive">
      <template #default>
        <div ref="innerEl" class="inner">
          <wb-env-molecule-header
            v-if="renderComponents && headerVisible"
            :show-cover="!ready"
            :items="headerItems"
            :parent-layout="core.modules.windows?.contentWrapper.layout" />
          <div ref="contentEl" class="content">
            <template v-if="renderComponents">
              <wb-env-window-wrapper
                ref="windowWrapperEl"
                :core="core"
                :wrapper="core.modules.windows?.contentWrapper"
                :clamp-y="false">
                <wb-env-symbol-wrapper
                  v-if="
                    renderSymbols && core.modules.symbols?.defaultWrapper?.id
                  "
                  :core="core"
                  :wrapper-id="core.modules.symbols.defaultWrapper?.id"
                  :parent-scrollable="false"
                  class="symbol-wrapper"
                  :clamp-symbols="true"
                  :show-storage-bar="false" />
              </wb-env-window-wrapper>
            </template>
            <wb-env-no-disk v-if="showNoDisk" />
            <wb-env-error
              v-if="currentError"
              v-bind="currentError"
              @close="onClickError" />
          </div>
        </div>
      </template>
    </wb-env-screen>
  </div>
</template>

<script lang="ts" setup>
import {
  toRaw,
  provide,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  markRaw
} from 'vue';
import { Subscription } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import Screen from '../classes/modules/Screen';
import { WINDOW_POSITION } from '../classes/WindowWrapper';
import domEvents from '../services/domEvents';
import { BOOT_DURATION } from '../classes/Core/utils';
import Theme from '../classes/Theme';
import defaultCursor from '../assets/svg/cursor/pointer.svg?url';
import WbEnvScreen from './Screen.vue';
import WbEnvError from './Error.vue';
import WbEnvNoDisk from './NoDisk.vue';
import WbEnvMoleculeHeader from './molecules/Header.vue';
import WbEnvWindowWrapper from './WindowWrapper.vue';
import WbEnvSymbolWrapper from './SymbolWrapper.vue';
import WbModulesCoreWebDos from './modules/core/WebDos.vue';

import { ref, useHead, computed, useRoute } from '#imports';

import useFonts from '../composables/useFonts';
import type Core from '../classes/Core';
import { fonts } from '../utils/font';
import { createBootScript } from '../utils/basic/boot';
import {
  BOOT_SEQUENCE,
  CONFIG_NAMES as CORE_CONFIG_NAMES,
  type CoreConfig,
  type ErrorDescription
} from '../classes/Core/types';
import type { WindowLayout } from '../types/window';
import { NO_DISK, type Config } from '../config';

const rootEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const screenEl = ref<InstanceType<typeof WbEnvScreen> | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const windowWrapperEl = ref<InstanceType<typeof WbEnvWindowWrapper> | null>(
  null
);

const $props = defineProps<{
  config: Config;
  core: Core;
}>();

const core = ref(markRaw($props.core));

const $emit = defineEmits<{
  (e: 'ready'): void;
}>();

// #region setup

const { registerFont } = useFonts();

registerFont(fonts);

const theme = computed(() => {
  if (core.value.modules.screen?.currentTheme) {
    return core.value.modules.screen.currentTheme;
  }
  return new Theme();
});

const vars = computed(() => {
  const vars = theme.value?.toCSSVars();
  if (vars) {
    return `:root {
        ${Object.keys(vars)
          .map(key => `${key}: ${vars[String(key)]};`)
          .join('\n')}
      }`;
  }
  return null;
});

useHead(() => {
  return {
    style: [
      vars.value && {
        key: 'wb-core-vars',
        type: 'text/css',
        innerHTML: vars.value
      }
    ].filter(Boolean)
  };
});

const route = useRoute();
provide('core', core.value);

const noBoot = computed(() => 'no-boot' in route.query);
const noWebDos = computed(() => 'no-webdos' in route.query);

const noDiskOverride = ref($props.config.noDisk === NO_DISK.FORCE);
const noDisk = computed(() => noDiskOverride.value || 'no-disk' in route.query);
const noCloudStorage = computed(() => 'no-cloud-storage' in route.query);

// #endregion

// #region data

const subscription = new Subscription();

const layout = ref<WindowLayout>({
  position: ipoint(0, 0),
  size: ipoint(0, 0)
});

provide('parentLayout', layout);

const renderComponents = ref(false);
const renderSymbols = ref(false);
const ready = ref(false);

const activeDisks = ref([]);

const coreConfig = computed(() => core.value.config.observable);
const bootSequence = ref(BOOT_SEQUENCE.SEQUENCE_1);

// #endregion

// #region computed

const screenOptions = computed<CoreConfig['core_screenConfig']>({
  get() {
    return core.value.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG];
  },
  set(value) {
    core.value.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG] = value;
  }
});

const style = computed(() => {
  return {
    '--default-cursor': `url(${defaultCursor})`
  };
});

const showNoDisk = computed(() => {
  return bootSequence.value === BOOT_SEQUENCE.NO_DISK;
});
const horizontalCentering = computed(() => {
  return screenOptions.value.horizontalCentering;
});

const headerVisible = computed(() => {
  if (core.value.modules.windows) {
    return core.value.modules.windows.contentWrapper.isHeaderVsible();
  }
  return true;
});
const screenBootSequence = computed(() => {
  if (currentError.value) {
    return BOOT_SEQUENCE.ERROR;
  }
  return bootSequence.value;
});
const cursor = computed(() => {
  if (core.value.modules.screen) {
    return core.value.modules.screen.cursor;
  }
  return null;
});
const screen = computed(() => {
  return {
    frameActive: coreConfig.value[CORE_CONFIG_NAMES.SCREEN_1084_FRAME],
    hasRealLook: coreConfig.value[CORE_CONFIG_NAMES.SCREEN_REAL_LOOK],
    hasScanLines: coreConfig.value[CORE_CONFIG_NAMES.SCREEN_SCAN_LINES],
    hasActiveAnimation:
      !noBoot.value &&
      coreConfig.value[CORE_CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]
  };
});
const hasFrame = computed(() => {
  return coreConfig.value[CORE_CONFIG_NAMES.SCREEN_1084_FRAME];
});
const styleClasses = computed(() => {
  return {
    ready: ready.value,
    waiting: waiting.value
  };
});

const waiting = computed(() => {
  return core.value.executionCounter > 0;
});

const headerItems = computed(() => {
  return core.value.modules.windows?.contextMenu.activeItems.items;
});

// #endregion

// #region watch

watch(
  () => horizontalCentering.value,
  () => {
    onResize();
  }
);
watch(
  () => waiting.value,
  waiting => {
    if (cursor.value) {
      toRaw(cursor.value).setWait(waiting);
    }
  }
);
watch(
  () => hasFrame.value,
  () => {
    nextTick(() => {
      onResize();
      nextTick(() => {
        core.value.modules.symbols?.defaultWrapper?.rearrangeIcons({
          root: true
        });
        core.value.modules.windows?.contentWrapper.setWindowPositions(
          WINDOW_POSITION.CENTER
        );
      });
    });
  }
);

// #endregion

// #region initialization

onMounted(async () => {
  subscription.add(domEvents.resize.subscribe(onResize));

  if (contentEl.value) {
    core.value.addModule(Screen, {
      contentEl: contentEl.value
    });
  }

  await core.value.setup({
    disks: $props.config.disks,
    rootItems: $props.config.rootItems
  });

  onResize();
  subscription.add(
    core.value.errorObserver.subscribe(err => {
      setError(err);
    })
  );
  await screenActiveAnimation();
  await onReady();

  await Promise.all(
    $props.config.startCommands.map(command =>
      core.value.executeCommand(command)
    )
  );
});

onUnmounted(() => {
  activeDisks.value.forEach(file =>
    core.value.modules.files?.fs.removeFloppyDisk(file)
  );
  core.value.modules.windows?.clear();
  subscription.unsubscribe();
});

// #endregion

// #region methods

function onToggleScreenActive(screenActive: boolean) {
  if (!ready.value && !screenActive) {
    noDiskOverride.value = true;
  }
  if (screenActive) {
    nextTick(() => {
      onResize();
    });
  }
}

function screenActiveAnimation() {
  let result: Promise<unknown> | undefined;
  let parallel = false;
  if (!noBoot.value) {
    if (coreConfig.value[CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE]) {
      result = new Promise(resolve =>
        window.setTimeout(async () => {
          await screenEl.value?.turnOn(1500);
          resolve(true);
        }, 1000)
      );
    } else if (coreConfig.value[CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS]) {
      result = screenEl.value?.turnOn(2000);
    } else {
      result = screenEl.value?.turnOn(0);
    }
  }

  parallel = !!result;

  if (!parallel && screenEl.value) {
    result = screenEl.value
      .turnOn(2000)
      .then(() => {
        return windowWrapperEl.value?.refresh();
      })
      .catch(err => {
        throw err;
      });
  }

  result = result?.then(() => screenEl.value?.togglePanel(true));

  if (parallel) {
    return result;
  }
}

function onResize() {
  if (rootEl.value && contentEl.value && innerEl.value) {
    const { left, top, width, height } = rootEl.value.getBoundingClientRect();
    layout.value = {
      position: ipoint(left, top),
      size: ipoint(width, height)
    };
    if (contentEl.value) {
      core.value.modules.screen?.updateContentLayout(contentEl.value);
      core.value.modules.screen?.updateScreenLayout(innerEl.value);
    }
  }
}

async function onReady() {
  const executionResolve = core.value.addExecution();

  const withBoot = noBoot.value
    ? false
    : coreConfig.value[CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE] || false;
  await startBootSequence(withBoot);

  if (!noDisk.value) {
    bootSequence.value = BOOT_SEQUENCE.READY;

    onResize();
    renderComponents.value = true;

    await new Promise(resolve => {
      nextTick(async () => {
        if (contentEl.value && innerEl.value) {
          core.value.modules.screen?.updateContentLayout(contentEl.value);
          core.value.modules.screen?.updateScreenLayout(innerEl.value);
        }
        renderSymbols.value = true;

        const withWebDos = noWebDos.value
          ? false
          : coreConfig.value[CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS] || false;
        await boot(withWebDos);

        ready.value = true;
        resolve(undefined);
      });
    });
    executionResolve();
    $emit('ready');
  } else {
    bootSequence.value = BOOT_SEQUENCE.NO_DISK;
  }
}

// Error

function onClickError() {
  currentError.value = errors.value.shift();
}

const currentError = ref<ErrorDescription | undefined>();
const errors = ref<ErrorDescription[]>([]);
function setError(e: Error, userInteraction = true) {
  console.warn(e);
  const data: ErrorDescription = {
    input: 'Press left mouse button or touch to continue.',
    message: e.message,
    stack: null,
    code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(
      Math.random() * 99999999
    )}`
  };
  if (!userInteraction) {
    data.input = undefined;
  }
  data.userInteraction = userInteraction;
  if (currentError.value) {
    errors.value.push(data);
  } else {
    currentError.value = data;
  }
}

// Start Sequence & Boot

async function startBootSequence(active: boolean) {
  const defaultSequences = [
    BOOT_SEQUENCE.SEQUENCE_1,
    BOOT_SEQUENCE.SEQUENCE_2,
    BOOT_SEQUENCE.SEQUENCE_3
  ];
  if (active) {
    let counter = defaultSequences.length;
    const sequence = async () => {
      counter--;
      bootSequence.value =
        defaultSequences[defaultSequences.length - Number(counter)];
      if (counter > 0) {
        await new Promise(resolve => {
          window.setTimeout(resolve, BOOT_DURATION);
        });
        await sequence();
      }
    };
    await new Promise(resolve => window.setTimeout(resolve, BOOT_DURATION / 2));
    await sequence();
  } else {
    bootSequence.value = defaultSequences[defaultSequences.length - 1];
  }
}

async function boot(withWebDos: boolean) {
  await prepareMemory();

  const cloudStorages = noCloudStorage.value ? [] : $props.config.cloudStorages;
  await createBootScript(core.value, {
    withWebDos,
    disks: $props.config.disks,
    cloudStorages
  });

  const commands = ['remove "TMP:BOOT.basic"'];
  if (withWebDos) {
    await startWebDos();
  } else {
    commands.unshift('basic "TMP:BOOT.basic"');
  }

  return core.value.executeCommands(commands);
}

function startWebDos() {
  const bootWindow = core.value.modules.windows?.addWindow(
    {
      component: WbModulesCoreWebDos,
      componentData: {
        core: core.value,
        command: 'basic "TMP:BOOT.basic"'
      },
      options: {
        title: 'WebDOS',
        scaleX: false,
        scaleY: false,
        scrollX: false,
        scrollY: true,
        embed: true
      }
    },
    { full: true }
  );
  if (bootWindow) {
    bootWindow.wrapper?.centerWindow(bootWindow);
    bootWindow.focus();
    return bootWindow?.awaitClose();
  }
}

function prepareMemory() {
  // const { firebase } = useRuntimeConfig().public;
  // core.value.modules.parser?.memory.set(
  //   'FIREBASE_API_KEY',
  //   '"' + firebase.apiKey + '"'
  // );
}
</script>

<style lang="postcss" scoped>
.wb-env-core {
  --color-text: var(--color-core-text, #fff);

  color: var(--color-text);

  & * {
    cursor: var(--default-cursor), auto;
  }

  & style {
    display: none;
  }

  & .inner {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .content {
    flex: 1;
    height: auto;
  }

  & .content > .symbol-wrapper {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &.ready {
    & .content > .symbol-wrapper {
      opacity: 1;
    }
  }
}
</style>
