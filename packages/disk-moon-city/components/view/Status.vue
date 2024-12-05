<template>
  <div class="mc-view-status">
    <teleport to="#layout_content_1">
      <div class="content-1">
        <div></div>
      </div>
    </teleport>
    <teleport to="#layout_content_2">
      <div class="content-2"></div>
    </teleport>
    <teleport to="#layout_screen">
      <mc-screen :background-image="backgroundImage">
        <mc-text-drawer :key="core.currentPlayer.status" :lines="lines" />
      </mc-screen>
      <div class="screen"></div>
    </teleport>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import useCore from '../../composables/useCore';
import { PLAYER_STATUS } from '../../utils/keys';
import McScreen from '../Screen.vue';
import McTextDrawer from '../TextDrawer.vue';

import imageGameLost from '../../assets/graphics/screen/game_over.png';
import imageGameWon from '../../assets/graphics/screen/game_win.png';

const { core } = useCore();

const backgroundImage = computed(() => {
  switch (core.currentPlayer.status) {
    case PLAYER_STATUS.GAME_LOST:
      return imageGameLost;
    case PLAYER_STATUS.GAME_WON:
      return imageGameWon;
    default:
      return null;
  }
});
const lines = computed(() => {
  return [
    [],
    [
      { spacer: true },
      [
        core.currentPlayer.status === PLAYER_STATUS.GAME_LOST
          ? {
              class: 'blinking-error',
              background: true,
              content: `Sie sind erledigt !`,
              color: 'dark-blue'
            }
          : {
              class: 'blinking-blue',
              background: true,
              content: `Sie haben gewonnen !`,
              color: 'dark-blue'
            }
      ],
      { spacer: true }
    ]
  ];
});
</script>

<style lang="postcss" scoped>
.content-1 {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/overview-content-1-1.png');
  background-size: contain;

  & > div {
    position: absolute;
    top: 26px;
    left: 14px;
    width: 260px;
    height: 232px;
    padding: 2px;
    background: url('../../assets/graphics/background/ground.png');
    background-size: contain;
  }
}

.content-2 {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  background: url('../../assets/graphics/layout/overview-content-2.png');
  background-size: contain;

  & > div {
    position: absolute;
    top: 288px;
    left: 8px;
  }
}
</style>
