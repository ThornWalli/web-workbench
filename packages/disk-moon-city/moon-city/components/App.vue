<template>
  <div class="mc-app" :style="{ ...(position?.toCSSVars('position') || {}) }">
    <mc-intro v-if="intro" ref="introEl" hidden />
    <mc-layout ref="layoutEl" :hidden="preload || intro">
      <template #button>
        <mc-info-button
          :disabled="locked || !core.started || playerChange"
          @click="onClickInfo" />
      </template>
      <template #name>
        <mc-text glossy :color="COLOR.BLUE" content="Name:" />
        <mc-text
          v-if="core.currentPlayer"
          sibling
          :color="COLOR.GRAY"
          :content="autoEllipsis(core.currentPlayer.name, 10)" />
      </template>
      <template #credits>
        <mc-text glossy :color="COLOR.YELLOW" content="Credits:" />
        <mc-text
          v-if="core.currentPlayer"
          sibling
          :color="COLOR.GRAY"
          :content="
            fillTextStart(String(core.currentPlayer.city.credits), 8, '0')
          " />
      </template>
      <template #round>
        <mc-text glossy :color="COLOR.YELLOW" content="Zug:" />
        <mc-text
          :color="COLOR.GRAY"
          sibling
          :content="fillTextStart(String(core.round), 3, '0')" />
      </template>
      <template #audio>
        <mc-frame-audio-player />
      </template>
      <template #date>
        <mc-text glossy :color="COLOR.BLUE" content="Datum:" />
        <mc-text-date color="gray" :date="core.date" sibling />
      </template>
      <template #menu>
        <mc-frame-menu
          v-model="menuKey"
          :disables="menuDisables"
          @complete="onCompleteMenu" />
      </template>
    </mc-layout>
    <mc-view-start v-if="showStart" @complete="onCompleteStart" />
    <mc-view-overview
      v-else-if="showOverview && core.currentPlayer"
      :key="`${core.round}-${core.currentPlayer.id}`"
      :skip-vehicle-arrives="debug"
      :round-start="roundStart"
      @round-start="onCompleteRoundStart" />
    <mc-view-shop v-else-if="showShop && core.currentPlayer" />
    <mc-view-city v-else-if="showCity && core.currentPlayer" />
    <mc-view-stats v-else-if="showStats && core.currentPlayer" />
    <mc-view-attack v-else-if="showAttack && core.currentPlayer" />
    <mc-view-info v-else-if="showInfo && core.currentPlayer" />
    <mc-view-status v-else-if="showStatus && core.currentPlayer" />
    <mc-preloader v-if="preload" ref="preloadEl" />
    <mc-debug v-if="debug" />
  </div>
</template>

<script lang="ts" setup>
import '../assets/css/base.pcss';
import '../assets/css/animation.pcss';

import { useHead } from '#imports';
import { ref, computed, onMounted, provide, watch } from 'vue';

import McLayout from './Layout.vue';
import McIntro from './Intro.vue';
import McText from './Text.vue';
import McTextDate from './text/Date.vue';
import McViewStart from './view/Start.vue';
import McViewOverview from './view/Overview.vue';
import McViewShop from './view/Shop.vue';
import McViewCity from './view/City.vue';
import McViewStats from './view/Stats.vue';
import McViewStatus from './view/Status.vue';
import McViewAttack from './view/Attack.vue';
import McViewInfo from './view/Info.vue';
import McInfoButton from './InfoButton.vue';
import McFrameMenu, { MENU_ITEM } from './frame/Menu.vue';
import McFrameAudioPlayer from './frame/AudioPlayer.vue';
import useCore from '../composables/useCore';
import useAppInit from '../composables/useAppInit';
import useAudioControl from '../composables/useAudioControl';
import { basicPlayerConfig } from '../utils/player';
import { autoEllipsis, fillTextStart } from '../utils/string';
import McPreloader from './Preloader.vue';
import McDebug from './Debug.vue';

import dummyContent from '../dummyContent';
import { SFX } from '../utils/sounds';
import { COLOR } from '../utils/color';

const { setGlobalVolume, playSfx } = useAudioControl();

const $props = defineProps({
  debug: {
    type: Boolean,
    default: false
  },
  debugContent: {
    type: Boolean,
    default: false
  },
  preload: {
    type: Boolean,
    default: true
  },
  intro: {
    type: Boolean,
    default: true
  },
  volume: {
    type: Number,
    default: 0.5
  },
  absolute: {
    type: HTMLElement,
    default: undefined
  },
  nativeCursor: {
    type: Boolean,
    default: true
  }
});
const { core } = useCore();

if ($props.debugContent) {
  await dummyContent(core);
}

useHead(() => {
  return {
    title: 'Moon City',
    htmlAttrs: { class: `${$props.nativeCursor ? 'mc-cursor' : ''}` }
  };
});

watch(
  () => $props.volume,
  volume => {
    setGlobalVolume(volume);
  },
  { immediate: true }
);

const { position } = useAppInit({ absolute: $props.absolute });

const ready = ref(false);
const locked = ref(false);
const preloadEl = ref<typeof McPreloader>();

const introEl = ref<typeof McIntro>();
const layoutEl = ref<typeof McLayout>();

provide('controlsLocked', locked);
provide('lockControls', (value: boolean) => (locked.value = value));

onMounted(async () => {
  if ($props.preload) {
    await preloadEl.value?.start();
  }
  if ($props.intro) {
    await introEl.value?.start();
    ready.value = true;
    layoutEl.value?.show();
  } else {
    ready.value = true;
    if ($props.preload) {
      layoutEl.value?.show();
    }
  }
});

// :disabled="locked || !core.started || playerChange"
const menuDisables = computed(() => {
  return {
    [MENU_ITEM.SHOP]: !playerIsPlaying.value,
    [MENU_ITEM.CITY]: !playerIsPlaying.value,
    [MENU_ITEM.STATS]: !playerIsPlaying.value,
    [MENU_ITEM.ATTACK]: !playerIsPlaying.value,
    [MENU_ITEM.INFO]: !playerIsPlaying.value,
    [MENU_ITEM.OK]: !core.started,
    [MENU_ITEM.SAVE]: true
  };
});

const menuKey = ref(MENU_ITEM.NONE);
const showStart = computed(() => ready.value && !core.started);
const showOverview = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.NONE &&
    core.currentPlayer
);
const showShop = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.SHOP &&
    core.currentPlayer
);
const showCity = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.CITY &&
    core.currentPlayer
);
const showStats = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.STATS &&
    core.currentPlayer
);
const showAttack = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.ATTACK &&
    core.currentPlayer
);
const showInfo = computed(
  () =>
    ready.value &&
    playerIsPlaying.value &&
    menuKey.value === MENU_ITEM.INFO &&
    core.currentPlayer
);

const playerIsPlaying = computed(
  () => core.currentPlayer && core.currentPlayer.isPlaying()
);
const showStatus = computed(() => ready.value && !playerIsPlaying.value);

watch(
  () => core.currentPlayer?.id + '_' + showStatus.value,
  () => {
    if (core.currentPlayer && !core.currentPlayer.isPlaying()) {
      onCompleteRoundStart();
    }
  }
);

const onCompleteStart = ({ players }: { players: string[] }) => {
  players.forEach(name => {
    const player = core.createPlayer(name);
    basicPlayerConfig(player);
  });
  core.start();
};

const onRestart = async () => {
  await layoutEl.value?.hide();
  await core.restart();
  await layoutEl.value?.show();
};

const roundStart = ref(false);
const playerChange = ref(false);
const onPlayerChange = async () => {
  playerChange.value = true;
  playSfx(SFX.ROUND_COMPLETE);
  await layoutEl.value?.hide();
  await core.next();
  menuKey.value = MENU_ITEM.NONE;
  playSfx(SFX.ROUND_COMPLETE);
  roundStart.value = true;
  await layoutEl.value?.show();
};

const onCompleteMenu = async () => {
  if (core.currentPlayer?.isWon()) {
    await onRestart();
  } else {
    await onPlayerChange();
  }
};

const onCompleteRoundStart = () => {
  roundStart.value = false;
  playerChange.value = false;
};

const onClickInfo = async () => {
  playSfx(SFX.BUTTON_2_CLICK);
  if (menuKey.value === MENU_ITEM.INFO) {
    menuKey.value = MENU_ITEM.NONE;
  } else {
    menuKey.value = MENU_ITEM.INFO;
  }
};
</script>

<style lang="postcss" scoped>
.mc-app {
  position: absolute;
  top: calc(var(--position-y) * 1px);
  left: calc(var(--position-x) * 1px);
  user-select: none;

  /* transform: scale(1.3); */
}

.test {
  position: fixed;
  top: 50%;
  left: 50%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.mc-intro {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<style lang="postcss">
html.mc-cursor,
html.mc-cursor body {
  cursor: url('../assets/cursor/pointer.svg'), pointer !important;
}

.pix-font {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 1px;
  align-items: center;
  justify-content: center;
  color: white;
  user-select: text;
  background-color: black;

  & span {
    background-color: red;
  }
}
</style>
