<template>
  <div class="wb-env-screen-panel">
    <div v-for="(button, index) in buttons" :key="index" class="panel__control" :disabled="button.disabled">
      <component :is="button.svg" />
      <span class="panel__control__label">{{ button.label }}</span>
      <div>
        <button
          @touchstart="(e) => onPointerDown(e, button, false)"
          @mousedown="(e) => onPointerDown(e, button, false)"
          @touchend="onPointerUp"
          @mouseup="onPointerUp"
        />
        <!-- {{ button.model[button.name] }} -->
        <!-- {{:model="button.model" :name="button.name"}} -->
        <div
          class="panel__control__knob"
        >
          <i
            :style="{
              '--value': button.model[button.name]
            }"
          >
            <div>
              <svg-screen-panel-stick-texture />
              <span />
            </div>
          </i>
          <wb-radial-slider
            style-type="screen-panel-control-knob"
            :min="0"
            :max="1"
            :model="options"
            :name="button.name"
          />
        </div>
        <!-- <input size="3" :value="Math.round(button.model[button.name] * 100)" readonly> -->
        <button
          @touchstart="(e) => onPointerDown(e, button, true)"
          @mousedown="(e) => onPointerDown(e, button, true)"
          @touchend="onPointerUp"
          @mouseup="onPointerUp"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SvgScreenPanelHorizontalCentering from '@/assets/svg/screen/panel/horizontal_centering.svg?vue-template';
import SvgScreenPanelBrightness from '@/assets/svg/screen/panel/brightness.svg?vue-template';
import SvgScreenPanelContrast from '@/assets/svg/screen/panel/contrast.svg?vue-template';
import SvgScreenPanelColor from '@/assets/svg/screen/panel/colors.svg?vue-template';
import SvgScreenPanelSharpness from '@/assets/svg/screen/panel/sharpness.svg?vue-template';
import SvgScreenPanelAudioVolume from '@/assets/svg/screen/panel/audio_volume.svg?vue-template';
import SvgScreenPanelStickTexture from '@/assets/svg/screen/stick_texture.svg?vue-template';
import WbRadialSlider from '@/components/environments/atoms/RadialSlider';

export default {
  components: {
    SvgScreenPanelStickTexture, WbRadialSlider
  },
  props: {
    options: {
      type: Object,
      default () {
        return {
          contrast: 0.5,
          brightness: 0.5,
          color: 0.5,
          sharpness: 0,
          horizontalCentering: 0.5,
          soundVolumne: 0.5
        };
      }
    }
  },
  data () {
    return {
      buttons: [
        {
          name: 'horizontalCentering',
          model: this.options,
          svg: SvgScreenPanelHorizontalCentering,
          label: 'H. Centering',
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          name: 'brightness',
          model: this.options,
          svg: SvgScreenPanelBrightness,
          label: 'Brightness',
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          name: 'contrast',
          model: this.options,
          svg: SvgScreenPanelContrast,
          label: 'Contrast',
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          name: 'color',
          model: this.options,
          svg: SvgScreenPanelColor,
          label: 'Color',
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          name: 'sharpness',
          model: this.options,
          svg: SvgScreenPanelSharpness,
          label: 'Sharpness',
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          disabled: true,
          name: 'soundVolumne',
          model: this.options,
          svg: SvgScreenPanelAudioVolume,
          label: 'Volume',
          min: 0,
          max: 1,
          step: 0.01
        }
      ],
      clickMultiplicator: 1,
      clickInterval: null
    };
  },
  methods: {
    onPointerDown (e, button, add) {
      e.preventDefault();
      global.clearInterval(this.clickInterval);
      this.clickInterval = setInterval(() => {
        const step = button.step * this.clickMultiplicator;
        if (add) {
          button.model[button.name] = Math.min(button.model[button.name] + step, button.max);
        } else {
          button.model[button.name] = Math.max(button.model[button.name] - step, button.min);
        }
        this.clickMultiplicator = Math.min(this.clickMultiplicator + 1, 10);
      }, 125);
    },
    onPointerUp (e) {
      e.preventDefault();
      global.clearInterval(this.clickInterval);
      this.clickMultiplicator = 1;
    }
  }
};
</script>

<style lang="postcss">
.wb-env-screen-panel {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 5px;
  user-select: none;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.5);

  & .panel__control__label {
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9px;
    color: #000;
    text-transform: uppercase;
    opacity: 0.8;
  }

  & .panel__control {
    flex: 1;
    padding: 0;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
    -webkit-appearance: none;

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
        background: #333;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
        border: none;
        border: solid #000 1px;
        border-radius: 50%;
        outline: none;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.5), 2px 2px 3px rgba(0, 0, 0, 0.2);
        transition: box-shadow 0.2s linear, transform 0.1s linear;
        appearance: none;

        &:active {
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5), 0 0 3px rgba(0, 0, 0, 0.2);
          transform: scale(0.95);
        }

      }

      /* & > span {
        width: width;
      } */

      & .panel__control__knob {
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
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%);
        border: solid 1px rgba(0, 0, 0, 0.4);
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

            & * {
              stroke: rgba(255, 255, 255, 0.1);
            }

          }

          & span {
            position: absolute;
            top: calc((21px - 11px - 2px ) / 2);
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
              content: "";
              background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%);
            }

            &::before {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 1px;
              height: 50%;
              content: "";
              background: rgba(255, 255, 255, 0.2);
              box-shadow: 0 0 2 rgba(255, 255, 255, 1);
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
        background: transparent;
        border: none;
        opacity: 0.8;
        appearance: none;
      }

    }
  }
}
</style>
