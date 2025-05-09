<template>
  <span
    class="mc-text"
    :class="{
      embed,
      background,
      block,
      multiline,
      underline,
      border,
      glossy
    }"
    :style="{
      '--align': align,
      '--color': `var(--mc-color-${color})`,
      '--underline-color': `var(--mc-color-${color})`
    }">
    <div ref="contentEl" class="font-style-bitfont">
      {{ preparedContent }}
    </div>
    <mc-text-canvas
      v-if="glossy && preparedContent.length > 0"
      :glossy="glossy"
      :color="color"
      :border="border"
      :underline="underline"
      :underline-color="underlineColor"
      :content="preparedContent" />
  </span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { COLOR } from '../utils/color';
import McTextCanvas from './TextCanvas.vue';

const contentEl = ref(null);

const $props = defineProps({
  align: {
    type: String,
    default: 'left',
    validate: (align: string) => {
      return ['left', 'center', 'right'].includes(align);
    }
  },
  glossy: {
    type: Boolean,
    default: false
  },
  embed: {
    type: Boolean,
    default: false
  },
  content: {
    type: [String, Number],
    default: null
  },
  background: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  underline: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: COLOR.WHITE,
    validate: (color: COLOR) => {
      return Object.values(COLOR).includes(color);
    }
  },
  underlineColor: {
    type: String,
    default: COLOR.GRAY,
    validate: (color: COLOR) => {
      return Object.values(COLOR).includes(color);
    }
  },
  multiline: {
    type: Boolean,
    default: false
  }
});

const preparedContent = computed(() => {
  return $props.content ? String($props.content).replace(/&nbsp;/g, ' ') : '';
});
</script>

<style lang="postcss" scoped>
.mc-text {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  line-height: 0;
  color: var(--color);
  text-align: var(--align);
  transition: color 0.2s steps(2);

  & .mc-text-canvas {
    position: absolute;
    top: 0;
    left: 0;

    /* mix-blend-mode: difference; */
  }

  &:not(.embed) {
    padding: 2px;
    padding-right: 0;

    & .mc-text-canvas {
      top: 2px;
      left: 2px;
    }
  }

  &.block {
    display: block;
    width: 100%;
  }

  &.background {
    &::before {
      position: absolute;
      inset: 0 -2px 0 0;
      content: '';
      background: var(--mc-color-black);
    }
  }

  /* &:not(.block) {
    & + & {
      padding-left: 0;

      & :deep(.mc-text-canvas) {
        left: 0;
      }
    }
  } */

  & > div {
    position: relative;
    height: 10px;
    white-space: pre;
  }

  &.glossy {
    & > div {
      &:first-child {
        opacity: 0;
      }
    }
  }

  &.underline {
    padding-bottom: 4px;

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      content: '';
      border-bottom: 2px solid var(--underline-color);
    }
  }

  &.border {
    text-shadow:
      0 -2px var(--mc-color-shadow),
      2px 0 var(--mc-color-shadow),
      0 2px var(--mc-color-shadow),
      -2px 0 var(--mc-color-shadow);
  }

  &:not(.multiline) {
    white-space: nowrap;
  }

  &.multiline {
    margin-bottom: -2px;

    & > span {
      height: auto;
      line-height: 14px;
    }
  }
}
</style>
