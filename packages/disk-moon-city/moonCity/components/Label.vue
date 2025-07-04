<template>
  <component
    :is="tag"
    class="mc-label"
    :class="{
      merge,
      embed,
      shadow,
      selectable,
      [`background-${background}`]: true,
      [`type-${type}`]: true
    }"
    @click="onClick">
    <div>
      <div class="content">
        <slot>
          <mc-text
            :background="textBackground"
            :glossy="textGlossy"
            :color="color as COLOR"
            :content="content" />
        </slot>
        <mc-label-indicator
          v-if="selectable"
          :model-value="modelValue"
          :warning="warning"
          embed />
      </div>
    </div>
  </component>
</template>

<script lang="ts" setup>
import McText from './Text.vue';
import McLabelIndicator from './label/Indicator.vue';
import { computed } from 'vue';
import BaseButton from './base/Button.vue';
import { COLOR } from '../utils/color';
import { LABEL_BACKGROUND, LABEL_TYPE } from './types';

const $props = defineProps({
  background: {
    type: String,
    validator: (value: LABEL_BACKGROUND) =>
      [LABEL_BACKGROUND.DEFAULT, LABEL_BACKGROUND.BLACK].includes(value),
    default: LABEL_BACKGROUND.DEFAULT
  },
  content: {
    type: String,
    default: 'Label'
  },
  merge: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: COLOR.YELLOW,
    validator: (value: COLOR) => Object.values(COLOR).includes(value)
  },
  type: {
    type: String,
    default: LABEL_TYPE.DEFAULT,
    validator: (value: LABEL_TYPE) =>
      [
        LABEL_TYPE.DEFAULT,
        LABEL_TYPE.GLOSSY,
        LABEL_TYPE.EMBED,
        LABEL_TYPE.INSET
      ].includes(value)
  },
  textBackground: {
    type: Boolean,
    default: false
  },
  textGlossy: {
    type: Boolean,
    default: false
  },
  embed: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  warning: {
    type: Boolean,
    default: false
  }
});

const tag = computed(() => ($props.selectable ? BaseButton : 'div'));

const $emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();

const onClick = () => {
  if ($props.selectable) {
    $emit('update:model-value', true);
  }
};
</script>

<style lang="postcss" scoped>
.mc-label {
  position: relative;
  display: inline-block;
  height: 18px;
  padding: 0 2px;

  & input {
    /* display: none; */
  }

  &::before,
  &::after {
    position: absolute;
    top: 0;
    height: 100%;
  }

  &.shadow {
    box-shadow: 2px 2px 0 rgb(0 0 0 / 60%);
  }

  & .mc-label-indicator {
    margin-top: 2px;
    margin-right: 2px;
  }

  & .content {
    display: flex;
    justify-content: space-between;
  }

  &.type-default {
    &::before {
      left: 0;
      width: 2px;
      content: '';
      background: url('../assets/graphics/label/frame/default/start_default.png');
      background-size: contain;
    }

    &::after {
      right: 0;
      width: 2px;
      content: '';
      background: url('../assets/graphics/label/frame/default/end_default.png');
      background-size: contain;
    }

    & .content {
      box-sizing: border-box;
      flex: 1;
      height: 18px;
      padding: 2px 0;
      background: url('../assets/graphics/label/frame/default/fill_default.png');
      background-size: contain;
    }
  }

  &.background-black {
    &::before {
      background-image: url('../assets/graphics/label/frame/default/start_black.png');
    }

    &::after {
      background-image: url('../assets/graphics/label/frame/default/end_black.png');
    }

    & .content {
      background-image: url('../assets/graphics/label/frame/default/fill_black.png');
    }
  }

  &.type-glossy {
    padding-right: 2px;
    padding-left: 4px;

    &::before {
      left: 0;
      width: 4px;
      content: '';
      background-image: url('../assets/graphics/label/frame/glossy/start_default.png');
      background-size: contain;
    }

    &::after {
      right: 0;
      width: 2px;
      content: '';
      background-image: url('../assets/graphics/label/frame/glossy/end_default.png');
      background-size: contain;
    }

    & .content {
      box-sizing: border-box;
      flex: 1;
      height: 18px;
      padding: 2px 0;
      margin-left: -2px;
      background-image: url('../assets/graphics/label/frame/glossy/fill_default.png');
      background-size: contain;
    }

    &.background-black {
      &::before {
        background-image: url('../assets/graphics/label/frame/glossy/start_black.png');
      }

      &::after {
        background-image: url('../assets/graphics/label/frame/glossy/end_black.png');
      }

      & .content {
        background-image: url('../assets/graphics/label/frame/glossy/fill_black.png');
      }
    }
  }

  &.type-embed {
    padding-right: 4px;
    padding-left: 4px;

    &::before {
      left: 0;
      width: 4px;
      content: '';
      background-image: url('../assets/graphics/label/frame/embed/start_default.png');
      background-size: contain;
    }

    &::after {
      right: 0;
      width: 4px;
      content: '';
      background-image: url('../assets/graphics/label/frame/embed/end_default.png');
      background-size: contain;
    }

    & .content {
      box-sizing: border-box;
      flex: 1;
      height: 18px;
      padding: 2px 0;
      margin: 0 -2px;
      background-image: url('../assets/graphics/label/frame/embed/fill_default.png');
      background-size: contain;
    }

    &.background-black {
      &::before {
        background-image: url('../assets/graphics/label/frame/embed/start_black.png');
      }

      &::after {
        background-image: url('../assets/graphics/label/frame/embed/end_black.png');
      }

      & .content {
        background-image: url('../assets/graphics/label/frame/embed/fill_black.png');
      }
    }
  }

  &.type-inset {
    padding-right: 2px;
    padding-left: 2px;

    &::before {
      left: 0;
      width: 2px;
      content: '';
      background-image: url('../assets/graphics/label/frame/inset/start_default.png');
      background-size: contain;
    }

    &::after {
      right: 0;
      width: 2px;
      content: '';
      background-image: url('../assets/graphics/label/frame/inset/end_default.png');
      background-size: contain;
    }

    & .content {
      box-sizing: border-box;
      flex: 1;
      height: 18px;
      padding: 2px 0;
      background-image: url('../assets/graphics/label/frame/inset/fill_default.png');
      background-size: contain;
    }

    &.background-black {
      &::before {
        background-image: url('../assets/graphics/label/frame/inset/start_black.png');
      }

      &::after {
        background-image: url('../assets/graphics/label/frame/inset/end_black.png');
      }

      & .content {
        background-image: url('../assets/graphics/label/frame/inset/fill_black.png');
      }
    }
  }

  &.merge {
    flex: 1;
    padding-right: 0;

    &::after {
      display: none;
    }
  }

  & + * {
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}
</style>
