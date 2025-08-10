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
        <div v-show="ready" ref="backgroundEl" class="background">
          <wb-env-no-disk />
        </div>
        <div
          ref="innerEl"
          class="inner"
          :style="frameMovePosition.toCSSVars('position')">
          <wb-env-fragment-header
            v-if="!headerAbsolute && renderComponents && headerVisible"
            :core="core"
            :show-cover="!ready"
            :items="headerItems"
            :parent-layout="core.modules.windows?.contentWrapper.layout"
            @cover="onCover" />
          <div ref="contentEl" class="content">
            <template v-if="renderComponents">
              <wb-env-window-wrapper
                ref="windowWrapperEl"
                :core="core"
                :wrapper="wrapper"
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
          <wb-env-fragment-header
            v-if="headerAbsolute && renderComponents && headerVisible"
            absolute
            :core="core"
            :show-cover="!ready"
            :items="headerItems"
            :parent-layout="core.modules.windows?.contentWrapper.layout"
            @cover="onCover" />
        </div>
      </template>
    </wb-env-screen>
  </div>
</template>

<script lang="ts" setup>
import { provide, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { concatMap, from, lastValueFrom, Subscription, toArray } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import Screen from '../modules/Screen';
import type WindowWrapper from '../classes/WindowWrapper';
import domEvents from '../services/domEvents';
import { BOOT_DURATION } from '../classes/Core/utils';
import Theme from '../classes/Theme';
import defaultCursor from '../assets/svg/cursor/pointer.svg?url';
import WbEnvScreen from './Screen.vue';
import WbEnvError from './Error.vue';
import WbEnvNoDisk from './NoDisk.vue';
import WbEnvFragmentHeader from './fragments/Header.vue';
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
  CONFIG_NAMES as CORE_CONFIG_NAMES
} from '../classes/Core/types';
import type { CoreConfig, ErrorDescription } from '../classes/Core/types';
import type { WindowLayout } from '../types/window';
import { NO_DISK } from '../config';
import type { Config } from '../config';
import type FileSystem from '../classes/FileSystem';

import BitFontTtf from '../assets/fonts/BitFont/BitFont.ttf';
import { HEADER_HEIGHT } from '../utils/window';

const rootEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const screenEl = ref<InstanceType<typeof WbEnvScreen> | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const backgroundEl = ref<HTMLElement | null>(null);
const windowWrapperEl = ref<InstanceType<typeof WbEnvWindowWrapper> | null>(
  null
);

const $props = defineProps<{
  config: Config;
  core: Core;
}>();

const $emit = defineEmits<{
  (e: 'ready'): void;
}>();

// #region setup

const wrapper = computed(() => {
  return $props.core.modules.windows?.contentWrapper as WindowWrapper;
});

// #region fonts
const { registerFont } = useFonts();
const fontFile = new FontFace('BitFontCanvas', `url(${BitFontTtf})`, {});
document.fonts.add(fontFile);
registerFont(fonts);
await document.fonts.load(`10px "BitFontCanvas"`);
// #endregion

// #region theme

const theme = computed(() => {
  if ($props.core.modules.screen?.currentTheme) {
    return $props.core.modules.screen.currentTheme;
  }
  return new Theme();
});

const themeVars = computed(() => {
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
      themeVars.value && {
        key: 'wb-core-vars',
        type: 'text/css',
        innerHTML: themeVars.value
      }
    ].filter(Boolean)
  };
});

// #endregion

const route = useRoute();
provide('core', $props.core);

// region data

const subscription = new Subscription();

const renderComponents = ref(false);
const renderSymbols = ref(false);
const ready = ref(false);

const activeDisks = ref([]);

const coreConfig = computed(() => $props.core.config.observable);
const bootSequence = ref(BOOT_SEQUENCE.SEQUENCE_1);

const noBoot = computed(() => 'no-boot' in route.query);
const noWebDos = computed(() => 'no-webdos' in route.query);

const noDiskOverride = ref($props.config.noDisk === NO_DISK.FORCE);
const noDisk = computed(() => noDiskOverride.value || 'no-disk' in route.query);
const noCloudStorage = computed(() => 'no-cloud-storage' in route.query);

const layout = ref<WindowLayout>({
  position: ipoint(0, 0),
  size: ipoint(0, 0)
});

provide('parentLayout', layout);

// #endregion

// #region computed

const screenOptions = computed<CoreConfig['core_screenConfig']>({
  get() {
    return $props.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG];
  },
  set(value) {
    $props.core.config.set(CORE_CONFIG_NAMES.SCREEN_CONFIG, value);
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
  if ($props.core.modules.windows) {
    return $props.core.modules.windows.contentWrapper.isHeaderVsible();
  }
  return true;
});
const headerAbsolute = computed(() => {
  if ($props.core.modules.windows) {
    return $props.core.modules.windows.contentWrapper.isHeaderAbsolute();
  }
  return false;
});
const screenBootSequence = computed(() => {
  if (currentError.value) {
    return BOOT_SEQUENCE.ERROR;
  }
  return bootSequence.value;
});
const cursor = computed(() => {
  if ($props.core.modules.screen) {
    return $props.core.modules.screen.cursor;
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

const styleClasses = computed(() => {
  return {
    ready: ready.value,
    waiting: waiting.value
  };
});

const waiting = computed(() => {
  return $props.core.executionCounter > 0;
});

const headerItems = computed(() => {
  return $props.core.modules.windows?.contextMenu.activeItems.items;
});

// #endregion

// #region watch

watch(
  () => horizontalCentering.value,
  () => {
    onResize();
  }
);

let waitTimeout = -1;
watch(
  () => waiting.value,
  (waiting, lastWaiting) => {
    if (cursor.value) {
      if (waiting && !lastWaiting) {
        waitTimeout = window.setTimeout(() => {
          cursor.value?.setWait(true);
        }, 0);
      } else if (!waiting) {
        window.clearTimeout(waitTimeout);
        cursor.value.setWait(false);
      }
    }
  }
);

// #endregion

declare global {
  interface Window {
    fileSystem?: FileSystem;
  }
}

// #region initialization

onMounted(async () => {
  // Remove previous websocket failure flag
  window.setTimeout(() => {
    window.localStorage.removeItem('firebase:previous_websocket_failure');
  }, 2000);

  subscription.add(domEvents.resize$.subscribe(onResize));
  window.fileSystem = $props.core.modules.files?.fs;
  if (contentEl.value) {
    $props.core.addModule(Screen, {
      contentEl: contentEl.value
    });
  }

  await $props.core.setup({
    firebase: $props.config.firebase,
    symbols: $props.config.symbols,
    disks: $props.config.disks
  });

  onResize();
  subscription.add(
    $props.core.errorObserver.subscribe(err => {
      setError(err);
    })
  );
  await screenActiveAnimation();
  await onReady();

  if ($props.config.rootItems?.length) {
    await $props.core.addRootItems(
      await $props.config.rootItems({ core: $props.core })
    );
  }

  if (window.matchMedia('(max-width: 640px)').matches && !import.meta.env.DEV) {
    $props.core.executeCommand('rearrangeIcons -root -force');
  } else {
    $props.core.executeCommand('rearrangeIcons -root');
  }

  if ($props.config.startCommands.length) {
    await lastValueFrom(
      from($props.config.startCommands).pipe(
        concatMap(command => $props.core.executeCommand(command)),
        toArray()
      )
    );
  }
});

onUnmounted(() => {
  activeDisks.value.forEach(file =>
    $props.core.modules.files?.fs.removeFloppyDisk(file)
  );
  $props.core.modules.windows?.clear();
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
    const { left, top, width, height } =
      contentEl.value.getBoundingClientRect();
    layout.value = {
      position: ipoint(left, top),
      size: ipoint(width, height)
    };
    if (contentEl.value) {
      $props.core.modules.screen?.updateContentLayout(contentEl.value);
      $props.core.modules.screen?.updateScreenLayout(innerEl.value);
    }
  }
}

async function onReady() {
  const executionResolve = $props.core.addExecution();

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
          $props.core.modules.screen?.updateContentLayout(contentEl.value);
          $props.core.modules.screen?.updateScreenLayout(innerEl.value);
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
  await createBootScript($props.core, {
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

  return $props.core.executeCommands(commands);
}

function startWebDos() {
  const bootWindow = $props.core.modules.windows?.addWindow(
    {
      component: WbModulesCoreWebDos,
      componentData: {
        core: $props.core,
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
  // $props.core.modules.parser?.memory.set(
  //   'FIREBASE_API_KEY',
  //   '"' + firebase.apiKey + '"'
  // );
}

// #endregion

// #region inner move
const frameStartPosition = ref(ipoint(0, 0));
const frameMovePosition = ref(ipoint(0, 0));
let coverSubscription;
function onCover(e: PointerEvent, value: boolean) {
  if (value) {
    const backgroundRect = backgroundEl.value?.getBoundingClientRect();
    const rect = innerEl.value?.getBoundingClientRect();

    frameStartPosition.value = ipoint(
      e.x - (rect.x - backgroundRect.x),
      e.y - (rect.y - backgroundRect.y)
    );
    coverSubscription = new Subscription();
    coverSubscription.add(
      domEvents.pointerUp$.subscribe(() => {
        subscription.unsubscribe();
      })
    );
    coverSubscription.add(
      domEvents.pointerMove$.subscribe(e => {
        frameMovePosition.value = ipoint(() =>
          Math.min(
            Math.max(
              Math.round(ipoint(e.x, e.y) - frameStartPosition.value),
              0
            ),
            rect.height - HEADER_HEIGHT
          )
        );
      })
    );
  } else {
    coverSubscription?.unsubscribe();
    coverSubscription = null;
  }
}
// #endregion
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

  &:not(.ready) {
    & .background {
      opacity: 0;
    }

    & .inner {
      background: none;
    }
  }

  & .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  & .inner {
    position: absolute;
    top: calc(var(--position-y) * 1px);
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--color-background, #05a);
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
