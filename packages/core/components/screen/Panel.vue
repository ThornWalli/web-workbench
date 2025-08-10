<template>
  <div class="wb-env-screen-panel">
    <figure
      v-for="(button, index) in buttons"
      :key="index"
      class="control"
      :disabled="button.disabled">
      <component :is="button.svg" />
      <figcaption class="label">{{ button.label }}</figcaption>
      <div>
        <button
          :aria-label="`Decrease ${button.label}`"
          @pointerdown="onPointerDown($event, button, false)"
          @pointerup="onPointerUp" />
        <div class="knob">
          <i
            :style="{
              '--value': modelValue[button.name]
            }">
            <div>
              <svg-screen-panel-stick-texture />
              <span />
            </div>
          </i>
          <wb-radial-slider
            :model-value="modelValue[button.name]"
            style-type="screen-panel-control-knob"
            :min="0"
            :max="1"
            @dblclick="onDoubleClick(button.name)"
            @update:model-value="onUpdateModelValue(button.name, $event)" />
        </div>
        <button
          :aria-label="`Increase ${button.label}`"
          @pointerdown="onPointerDown($event, button, true)"
          @pointerup="onPointerUp" />
      </div>
    </figure>
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, ref } from 'vue';
import type { ComputedRef } from 'vue';

import WbRadialSlider from '../elements/RadialSlider.vue';
import SvgScreenPanelHorizontalCentering from '../../assets/svg/screen/panel/horizontal_centering.svg?component';
import SvgScreenPanelBrightness from '../../assets/svg/screen/panel/brightness.svg?component';
import SvgScreenPanelContrast from '../../assets/svg/screen/panel/contrast.svg?component';
import SvgScreenPanelColor from '../../assets/svg/screen/panel/colors.svg?component';
import SvgScreenPanelSharpness from '../../assets/svg/screen/panel/sharpness.svg?component';
import SvgScreenPanelAudioVolume from '../../assets/svg/screen/panel/audio_volume.svg?component';
import SvgScreenPanelStickTexture from '../../assets/svg/screen/stick_texture.svg?component';
import { getScreenDefaults } from '@web-workbench/core/classes/Core/utils';

const screenDefaults = getScreenDefaults();

const $props = defineProps({
  modelValue: {
    type: Object,
    default() {
      return {};
    }
  }
});
function onDoubleClick(name) {
  $emit('update:model-value', {
    ...$props.modelValue,
    [name]: screenDefaults[name]
  });
}
const $emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void;
}>();

const clickMultiplicator = ref(1);

const buttons: ComputedRef<Button[]> = computed(() => [
  {
    name: 'horizontalCentering',
    svg: markRaw(SvgScreenPanelHorizontalCentering),
    label: 'H. Centering',
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    name: 'brightness',
    svg: markRaw(SvgScreenPanelBrightness),
    label: 'Brightness',
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    name: 'contrast',
    svg: markRaw(SvgScreenPanelContrast),
    label: 'Contrast',
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    name: 'color',
    svg: markRaw(SvgScreenPanelColor),
    label: 'Color',
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    name: 'sharpness',
    svg: markRaw(SvgScreenPanelSharpness),
    label: 'Sharpness',
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    // disabled: true,
    name: 'soundVolume',
    svg: markRaw(SvgScreenPanelAudioVolume),
    label: 'Volume',
    min: 0,
    max: 1,
    step: 0.01
  }
]);

function onUpdateModelValue(name: string, value: number) {
  $emit('update:model-value', {
    ...$props.modelValue,
    [name]: value
  });
}

let clickInterval: ReturnType<typeof setInterval> | undefined;
function onPointerDown(e: PointerEvent, button: Button, add: boolean) {
  e.preventDefault();
  window.clearInterval(clickInterval);
  clickInterval = setInterval(() => {
    const step = button.step * clickMultiplicator.value;
    if (add) {
      onUpdateModelValue(
        button.name,
        Math.min(Number($props.modelValue[button.name]) + step, button.max)
      );
    } else {
      onUpdateModelValue(
        button.name,
        Math.max(Number($props.modelValue[button.name]) - step, button.min)
      );
    }
    clickMultiplicator.value = Math.min(clickMultiplicator.value + 1, 10);
  }, 125);
}
function onPointerUp(e: PointerEvent) {
  e.preventDefault();
  window.clearInterval(clickInterval);
  clickMultiplicator.value = 1;
}
</script>

<script lang="ts">
export interface Button {
  disabled?: boolean;
  name: string;
  svg: unknown;
  label: string;
  min: number;
  max: number;
  step: number;
}
</script>

<style lang="postcss" scoped>
.wb-env-screen-panel {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 5px;
  user-select: none;
  box-shadow: inset 2px 2px 4px rgb(0 0 0 / 50%);

  & .label {
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9px;
    color: #000;
    text-transform: uppercase;
    opacity: 0.8;
  }

  & .control {
    flex: 1;
    padding: 0;
    margin: 0;
    text-align: center;
    appearance: none;
    outline: none;
    background: transparent;
    border: none;

    &[disabled] {
      pointer-events: none;
      opacity: 0.4;
    }

    & > svg {
      height: 14px;
      margin-top: 4px;
      margin-bottom: 4px;
      opacity: 0.8;

      & * {
        fill: #000;
      }
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;

      & button {
        width: 12px;
        height: 12px;
        padding: 0;
        appearance: none;
        outline: none;
        background: #333;
        background: linear-gradient(
          135deg,
          rgb(0 0 0 / 30%) 0%,
          rgb(0 0 0 / 80%) 100%
        );
        border: none;
        border: solid #000 1px;
        border-radius: 50%;
        box-shadow:
          0 0 3px rgb(0 0 0 / 50%),
          2px 2px 3px rgb(0 0 0 / 20%);
        transition:
          box-shadow 0.2s linear,
          transform 0.1s linear;

        &:active {
          box-shadow:
            inset 0 0 3px rgb(0 0 0 / 50%),
            0 0 3px rgb(0 0 0 / 20%);
          transform: scale(0.95);
        }
      }

      /* & > span {
        width: width;
      } */

      & .knob {
        position: relative;

        --size: 21px;

        width: var(--size);
        height: var(--size);
        margin: 0 3px;

        & > * {
          position: absolute;
          top: 0%;
          left: 0%;
          width: 100%;
          height: 100%;
        }
      }

      & i {
        position: relative;
        display: block;
        width: 21px;
        height: 21px;
        overflow: hidden;
        background: #333;
        background: linear-gradient(
          135deg,
          rgb(0 0 0 / 40%) 0%,
          rgb(0 0 0 / 80%) 100%
        );
        border: solid 1px rgb(0 0 0 / 40%);
        border-radius: 50%;

        & > div {
          width: 100%;
          height: 100%;
          transform: rotate(calc((180deg) * var(--value) * 2));
          transform-origin: center center;

          & svg {
            position: absolute;
            top: 0%;
            left: 0%;
            width: 100%;
            height: 100%;

            & :deep(*) {
              stroke: rgb(255 255 255 / 10%) !important;
            }
          }

          & span {
            position: absolute;
            top: calc((21px - 11px - 2px) / 2);
            left: calc((21px - 11px - 2px) / 2);
            width: 11px;
            height: 11px;
            overflow: hidden;
            background: #000;
            border-radius: 50%;
            box-shadow: 0 0 1px black;

            &::after {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              content: '';
              background: radial-gradient(
                circle,
                rgb(255 255 255 / 10%) 0%,
                rgb(255 255 255 / 20%) 100%
              );
            }

            &::before {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 1px;
              height: 50%;
              content: '';
              background: rgb(255 255 255 / 20%);
              box-shadow: 0 0 2px rgb(255 255 255 / 100%);
              transform: translateX(-0.5px);
            }
          }
        }
      }

      & input {
        display: block;
        width: 18px;
        padding: 0;
        margin: 0 3px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9px;
        color: #000;
        text-align: center;
        text-transform: uppercase;
        appearance: none;
        background: transparent;
        border: none;
        opacity: 0.8;
      }
    }
  }
}
</style>
