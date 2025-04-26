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
                :clamp-y="false"
                :parent-layout="layout">
                <wb-env-symbol-wrapper
                  v-if="
                    renderSymbols &&
                    $props.core.modules.symbols?.defaultWrapper?.id
                  "
                  :core="core"
                  :wrapper-id="$props.core.modules.symbols.defaultWrapper?.id"
                  :parent-scrollable="false"
                  class="symbol-wrapper"
                  :clamp-symbols="true"
                  :show-storage-bar="false"
                  :parent-layout="layout" />
              </wb-env-window-wrapper>
            </template>
            <wb-env-no-disk v-if="showNoDisk" />
            <wb-env-error v-if="error" v-bind="error" @close="onClickError" />
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
  reactive
} from 'vue';
import { Subscription } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import Screen from '../classes/modules/Screen';
import { WINDOW_POSITION } from '../classes/WindowWrapper';
import domEvents from '../services/domEvents';
import {
  BOOT_SEQUENCE,
  CONFIG_NAMES as CORE_CONFIG_NAMES,
  BOOT_DURATION
} from '../classes/Core/utils';
import Theme from '../classes/Theme';
import defaultCursor from '../assets/svg/cursor/pointer.svg?url';
import WbEnvScreen from './Screen.vue';
import WbEnvError from './Error.vue';
import WbEnvNoDisk from './NoDisk.vue';
import WbEnvMoleculeHeader from './molecules/Header.vue';
import WbEnvWindowWrapper from './WindowWrapper.vue';
import WbEnvSymbolWrapper from './SymbolWrapper.vue';
import WbModulesCoreWebDos from './modules/core/WebDos.vue';

import { useRuntimeConfig, ref, useHead, computed, useRoute } from '#imports';

import useFonts from '../composables/useFonts';
import Core from '../classes/Core';
import type { Layout } from '../types';
import { fonts } from '../utils/font';
import { createBootScript } from '../utils/basic/boot';

const rootEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const screenEl = ref<InstanceType<typeof WbEnvScreen> | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const windowWrapperEl = ref<InstanceType<typeof WbEnvWindowWrapper> | null>(
  null
);

const $props = defineProps({
  core: {
    type: Core,
    required: true
  },
  disks: {
    type: Object,
    default: () => ({})
  },
  forceNoDisk: {
    type: Boolean,
    default: false
  }
});

const $emit = defineEmits<{
  (e: 'ready'): void;
}>();

// #region setup

const { registerFont } = useFonts();

registerFont(fonts);

const theme = computed(() => {
  if ($props.core.modules.screen?.currentTheme) {
    return $props.core.modules.screen.currentTheme;
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

$props.core.modules.files?.addDisks($props.disks);

const route = useRoute();
provide('core', $props.core);

const noBoot = computed(() => 'no-boot' in route.query);
const noWebDos = computed(() => 'no-webdos' in route.query);

const noDiskOverride = ref($props.forceNoDisk);
const noDisk = computed(() => noDiskOverride.value || 'no-disk' in route.query);
const noCloudStorage = computed(() => 'no-cloud-storage' in route.query);

// #endregion

// #region data

const subscription = new Subscription();

const error = ref();

const layout = ref<Layout>({
  position: ipoint(0, 0),
  size: ipoint(0, 0)
});

const renderComponents = ref(false);
const renderSymbols = ref(false);
const ready = ref(false);

const activeDisks = ref([]);

const coreConfig = computed(() => $props.core.config.observable);
const bootSequence = ref(BOOT_SEQUENCE.SEQUENCE_1);

// #endregion

// #region computed

const screenOptions = reactive(
  $props.core.config.observable[CORE_CONFIG_NAMES.SCREEN_CONFIG] || {
    horizontalCentering: true
  }
);

const style = computed(() => {
  return {
    '--default-cursor': `url(${defaultCursor})`
  };
});

const showNoDisk = computed(() => {
  return bootSequence.value === BOOT_SEQUENCE.NO_DISK;
});
const horizontalCentering = computed(() => {
  return screenOptions.horizontalCentering;
});

const headerVisible = computed(() => {
  if ($props.core.modules.windows) {
    return $props.core.modules.windows.contentWrapper.isHeaderVsible();
  }
  return true;
});
const screenBootSequence = computed(() => {
  if (error.value) {
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
        $props.core.modules.symbols?.defaultWrapper?.rearrangeIcons({
          root: true
        });
        $props.core.modules.windows?.contentWrapper.setWindowPositions(
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
    $props.core.addModule(Screen, {
      contentEl: contentEl.value
    });
  }

  await $props.core.setup();

  onResize();
  subscription.add(
    $props.core.errorObserver.subscribe(err => {
      setError(err);
    })
  );
  await screenActiveAnimation();
  // window.setTimeout(async () => {
  await onReady();
  // }, 300);
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
    const { left, top, width, height } = rootEl.value.getBoundingClientRect();
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
  error.value = null;
}

function setError(e: Error, userInteraction = true) {
  console.warn(e);
  const data: {
    input: string | null;
    text: string | null;
    stack: string | null;
    code?: string | null;
    userInteraction?: boolean;
  } = {
    input: 'Press left mouse button or touch to continue.',
    text: e.message,
    stack: null,
    code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(
      Math.random() * 99999999
    )}`
  };
  if (!userInteraction) {
    data.input = null;
  }
  data.userInteraction = userInteraction;
  error.value = data;
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

  const disks = ['workbench13', 'extras13', 'synthesizer', 'moonCity'];
  const cloudStorages = noCloudStorage.value ? [] : ['CDLAMMPEE'];
  await createBootScript($props.core, { withWebDos, disks, cloudStorages });

  const commands = ['remove "TMP:BOOT.basic"', 'mountDisk "debug"'];
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
  const { firebase } = useRuntimeConfig().public;
  $props.core.modules.parser?.memory.set(
    'FIREBASE_API_KEY',
    '"' + firebase.apiKey + '"'
  );
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
