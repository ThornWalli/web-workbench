<template>
  <div class="mc-map-city" :class="{ selected, [`city-${index + 1}`]: true }">
    <img :src="src[0]" />
    <img v-if="destroyed" :src="src[1]" />
  </div>
</template>

<script setup>
import imageCity1 from '../../assets/graphics/map/city-1.png';
import imageCity2 from '../../assets/graphics/map/city-2.png';
import imageCity3 from '../../assets/graphics/map/city-3.png';
import imageCity4 from '../../assets/graphics/map/city-4.png';
import imageCity1Destroyed from '../../assets/graphics/map/city-1-destroyed.png';
import imageCity2Destroyed from '../../assets/graphics/map/city-2-destroyed.png';
import imageCity3Destroyed from '../../assets/graphics/map/city-3-destroyed.png';
import imageCity4Destroyed from '../../assets/graphics/map/city-4-destroyed.png';

const $props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  destroyed: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
});

const src = computed(() => {
  return [
    [imageCity1, imageCity1Destroyed],
    [imageCity2, imageCity2Destroyed],
    [imageCity3, imageCity3Destroyed],
    [imageCity4, imageCity4Destroyed]
  ][$props.index];
});
</script>

<style lang="postcss" scoped>
.mc-map-city {
  position: relative;
  width: 70px;
  height: 70px;

  &.city-1 {
    --color-primary: var(--mc-color-green);
    --color-secondary: var(--mc-color-dark-green);
  }

  &.city-2 {
    --color-primary: var(--mc-color-red);
    --color-secondary: var(--mc-color-dark-red);
  }

  &.city-3 {
    --color-primary: var(--mc-color-blue);
    --color-secondary: var(--mc-color-dark-blue);
  }

  &.city-4 {
    --color-primary: var(--mc-color-yellow);
    --color-secondary: var(--mc-color-dark-yellow);
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    content: '';
  }

  &.selected::after {
    border: 2px solid var(--mc-color-white);
    animation: blink 1s infinite;
    animation-timing-function: steps(4);
  }

  & img {
    display: block;
    width: 100%;
  }

  & img + img {
    position: absolute;
    top: 0;
    left: 0;
  }
}

@keyframes blink {
  0% {
    border-color: var(--mc-color-white);
  }

  25% {
    border-color: var(--color-primary);
  }

  75% {
    border-color: var(--color-secondary);
  }

  100% {
    border-color: #000;
  }
}
</style>
