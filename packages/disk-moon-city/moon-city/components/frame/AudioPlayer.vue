<template>
  <div class="mc-frame-audio-player">
    <div class="items">
      <base-button @click="onPointerDownMute">
        <svg-audio-player-icon-muted v-if="muted" />
        <svg-audio-player-icon-unmuted v-else />
      </base-button>
      <base-button
        class="volume"
        :class="{ active: showVolumeControl }"
        @click="onPointerDownVolumeControl">
        <svg-audio-player-icon-volume />
      </base-button>
      <base-button @click="onPointerDownPrev">
        <svg-audio-player-icon-prev />
      </base-button>
      <base-button @click="onPointerDownNext">
        <svg-audio-player-icon-next />
      </base-button>
    </div>
    <div v-if="showVolumeControl" class="volume-control">
      <div class="content">
        <mc-label text-glossy content="Musik:" />
        <mc-input-stepper v-model="volumes.music" :step="0.01" :min-max="1" />
        <mc-label
          color="white"
          :content="fillTextStart(Math.round(volumes.music * 100), 3, '0')" />
        <mc-input-stepper v-model="volumes.music" :step="-0.01" :min-max="0" />
        <mc-label content="SFX:" text-glossy />
        <mc-input-stepper v-model="volumes.sfx" :step="0.01" :min-max="1" />
        <mc-label
          color="white"
          :content="fillTextStart(Math.round(volumes.sfx * 100), 3, '0')" />
        <mc-input-stepper v-model="volumes.sfx" :step="-0.01" :min-max="0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import SvgAudioPlayerIconUnmuted from '../../assets/graphics/audio-player/icon/unmuted.svg?component';
import SvgAudioPlayerIconMuted from '../../assets/graphics/audio-player/icon/muted.svg?component';
import SvgAudioPlayerIconVolume from '../../assets/graphics/audio-player/icon/volume.svg?component';
import SvgAudioPlayerIconPrev from '../../assets/graphics/audio-player/icon/prev.svg?component';
import SvgAudioPlayerIconNext from '../../assets/graphics/audio-player/icon/next.svg?component';

import BaseButton from '../base/Button.vue';
import McInputStepper from '../input/Stepper.vue';
import McLabel from '../Label.vue';
import useAudioControl from '../../composables/useAudioControl';
import { music as soundMusic } from '../../utils/sounds';
import { fillTextStart } from '../../utils/string';

const $props = defineProps({
  volume: {
    type: Number,
    default: 1
  }
});

watch(
  () => $props.volume,
  value => {
    volumes.global = value;
  }
);

// const { play } = useAudioControl();
// console.log(play('error'));

const musicList = Object.keys(soundMusic);
const currentIndex = ref(0);

const { volumes, mute, unmute, playMusic, playSfx } = useAudioControl();

const muted = ref(true);
const showVolumeControl = ref(false);
const currentMusic = ref();

watch(
  () => muted.value,
  value => {
    if (value) {
      mute();
      currentMusic.value?.stop();
    } else {
      unmute();
      if (!value) {
        currentMusic.value = playMusic(musicList[currentIndex.value]);
      }
    }
  }
);

const next = () => {
  currentMusic.value?.stop();
  currentIndex.value = (currentIndex.value + 1) % musicList.length;
  currentMusic.value = playMusic(musicList[currentIndex.value]);
};

const prev = () => {
  currentMusic.value?.stop();
  currentIndex.value =
    (currentIndex.value - 1 + musicList.length) % musicList.length;
  currentMusic.value = playMusic(musicList[currentIndex.value]);
};

const onPointerDownVolumeControl = () => {
  playSfx('button_1_click');
  showVolumeControl.value = !showVolumeControl.value;
};

const onPointerDownMute = () => {
  playSfx('button_1_click');
  muted.value = !muted.value;
};

const onPointerDownPrev = () => {
  playSfx('button_1_click');
  prev();
};

const onPointerDownNext = () => {
  playSfx('button_1_click');
  next();
};
</script>

<style lang="postcss" scoped>
.mc-frame-audio-player {
  display: block;
  width: 100%;
  height: 100%;
}

.items {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #000;

  & button {
    --color: var(--mc-color-yellow);

    &.pressed,
    &.active {
      --color: var(--mc-color-dark-yellow);
    }

    & svg {
      fill: var(--color);
      transition: fill 0.2s steps(3);
    }
  }
}

.volume-control {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 1;
  display: flex;
  width: 160px;
  background: #000;
  transform: translateX(-50%);

  &::before {
    flex: 0 0 12px;
    height: 52px;
    content: '';
    background: url('../../assets/graphics/audio-player/frame/start.png');
    background-size: contain;
  }

  &::after {
    flex: 0 0 12px;
    height: 52px;
    content: '';
    background: url('../../assets/graphics/audio-player/frame/end.png');
    background-size: contain;
  }

  & .content {
    display: grid;
    flex: 1;
    grid-template-rows: auto;
    grid-template-columns: auto 24px auto 24px;
    height: 52px;
    padding: 6px 0;
    background: url('../../assets/graphics/audio-player/frame/fill.png');
    background-size: contain;
  }
}
</style>
