<template>
  <div class="mc-app" :style="{ ...position.toCSSVars('position') }">
    <layout ref="layoutEl">
      <template #name>
        <mc-text glossy color="blue" content="Name:" />
        <mc-text
          v-if="core.currentPlayer"
          sibling
          color="gray"
          :content="core.currentPlayer.name" />
      </template>
      <template #credits>
        <mc-text glossy color="yellow" content="Credits:" />
        <mc-text
          v-if="core.currentPlayer"
          sibling
          color="gray"
          :content="core.currentPlayer.credits" />
      </template>
      <template #round>
        <mc-text glossy color="yellow" content="Zug:" />
        <mc-text
          color="gray"
          sibling
          :content="String(core.round).padStart(3, '0')" />
      </template>
      <template #audio>
        <mc-frame-audio-player />
      </template>
      <template #date>
        <mc-text glossy color="blue" content="Datum:" />
        <mc-text-date color="gray" :date="core.date" sibling />
      </template>

      <template #menu>
        <mc-frame-menu
          v-model="menuKey"
          :disabled="!core.started || playerChange"
          :disables="{
            [MENU_ITEM.SAVE]: true
          }"
          @complete="onCompleteMenu" />
      </template>
    </layout>
    <mc-view-start v-if="showStart" @complete="onCompleteStart" />
    <mc-view-overview
      v-else-if="showOverview && core.currentPlayer"
      :key="`${core.round}-${core.currentPlayer.id}`"
      :round-start="roundStart"
      @round-start="onCompleteRoundStart" />
    <mc-view-shop v-else-if="showShop && core.currentPlayer" />
    <mc-view-city v-else-if="showCity && core.currentPlayer" />
    <mc-view-stats v-else-if="showStats && core.currentPlayer" />
    <mc-view-attack v-else-if="showAttack && core.currentPlayer" />
  </div>
</template>

<script setup>
import '../assets/css/base.pcss';
import Layout from './Layout.vue';
import McText from './Text.vue';
import McTextDate from './text/Date.vue';
import McViewStart from './view/Start.vue';
import McViewOverview from './view/Overview.vue';
import McViewShop from './view/Shop.vue';
import McViewCity from './view/City.vue';
import McViewStats from './view/Stats.vue';
import McViewAttack from './view/Attack.vue';
import McFrameMenu, { MENU_ITEM } from './frame/Menu.vue';
import McFrameAudioPlayer from './frame/AudioPlayer.vue';
import useCore from '../composables/useCore.js';
import Player from '../classes/Player.js';
import { computed, onMounted } from 'vue';
import useAppInit from '../composables/useAppInit.js';
import useAudioControl from '../composables/useAudioControl.js';

const { core } = useCore();
const { position } = useAppInit();

const ready = ref(false);

const layoutEl = ref();

onMounted(() => {
  ready.value = true;
});

const menuKey = ref(MENU_ITEM.NONE);
const showStart = computed(() => ready.value && !core.started);
const showOverview = computed(
  () => ready.value && menuKey.value === MENU_ITEM.NONE && core.currentPlayer
);
const showShop = computed(
  () => ready.value && menuKey.value === MENU_ITEM.SHOP && core.currentPlayer
);
const showCity = computed(
  () => ready.value && menuKey.value === MENU_ITEM.CITY && core.currentPlayer
);
const showStats = computed(
  () => ready.value && menuKey.value === MENU_ITEM.STATS && core.currentPlayer
);
const showAttack = computed(
  () => ready.value && menuKey.value === MENU_ITEM.ATTACK && core.currentPlayer
);

const onCompleteStart = ({ players }) => {
  players.forEach(name => core.addPlayer(new Player({ name })));
  console.log('onCompleteStart', core);
  core.start();
};
const roundStart = ref(false);
const playerChange = ref(false);
const { playSfx } = useAudioControl();
const onCompleteMenu = async () => {
  playerChange.value = true;
  playSfx('round_complete');
  await layoutEl.value.hide();
  await core.next();
  menuKey.value = MENU_ITEM.NONE;
  playSfx('round_complete');
  await layoutEl.value.show();
  roundStart.value = true;
};

const onCompleteRoundStart = () => {
  roundStart.value = false;
  playerChange.value = false;
};
</script>

<style lang="postcss" scoped>
.mc-app {
  position: absolute;
  top: calc(var(--position-y) * 1px);
  left: calc(var(--position-x) * 1px);
  user-select: none;
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
</style>

<style lang="postcss">
html,
body {
  cursor: url('../assets/cursor/pointer.svg'), pointer !important;
}
</style>
