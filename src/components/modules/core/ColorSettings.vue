<template>
  <div class="wb-module-core-color-settings">
    <wb-form class="color-settings__form" @submit="onSubmit">
      <div>
        <div class="col-1">
          <wb-form-field-dropdown v-bind="fields.presets" />
          <wb-form-field label="Colors" class="color-settings__color_select">
            <label v-for="(color, index) in model.colors" :key="index" :style="{'--color': color}">
              <input v-model="selectedColor" type="radio" name="color" :value="color">
            </label>
          </wb-form-field>
          <wb-form-field-dropdown v-bind="fields.filter" :model="model" />
        </div>
        <div class="col-1 color-settings__colors">
          <div class="color-settings__color_controls">
            <div class="color-settings__color_preview">
              <i :style="`background-color: rgb(${colors.join(', ')});`" />
            </div>
            <div>
              <div>
                <wb-form-field-range-slider
                  style-type="color-select"
                  label="Red"
                  class="color-settings__color_slider"
                  :model="colors"
                  name="0"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2"
                >
                  <template v-slot:after>
                    <span>{{ colors[0].toString(16).toUpperCase() }}</span>
                  </template>
                </wb-form-field-range-slider>
              </div>
              <div>
                <wb-form-field-range-slider
                  style-type="color-select"
                  label="Green"
                  class="color-settings__color_slider"
                  :model="colors"
                  name="1"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2"
                >
                  <template v-slot:after>
                    <span>{{ colors[1].toString(16).toUpperCase() }}</span>
                  </template>
                </wb-form-field-range-slider>
              </div>
              <div>
                <wb-form-field-range-slider
                  style-type="color-select"
                  label="Blue"
                  class="color-settings__color_slider"
                  :model="colors"
                  name="2"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2"
                >
                  <template v-slot:after>
                    <span>{{ colors[2].toString(16).toUpperCase() }}</span>
                  </template>
                </wb-form-field-range-slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <wb-button-wrapper align="outer" full>
        <wb-button
          v-if="saveLabel"
          style-type="primary"
          :label="saveLabel"
          type="submit"
        />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>

import { CONFIG_NAMES as CORE_CONFIG_NAME, CONFIG_NAMES } from '../../../web-workbench/classes/Core';
import { PALETTE_THEMES, DEFAULT_PALETTE_THEME, PaletteTheme } from '../../../web-workbench/classes/Theme';
import WbForm from '@/components/environments/molecules/Form';
import WbFormField from '@/components/environments/atoms/FormField';
import WbFormFieldRangeSlider from '@/components/environments/atoms/formField/RangeSlider';
import WbFormFieldDropdown from '@/components/environments/atoms/formField/Dropdown';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbFormField, WbFormFieldRangeSlider, WbFormFieldDropdown, WbButton, WbButtonWrapper },
  mixins: [
    MixinWindowComponent
  ],

  data () {
    const model = this.core.config.get(CORE_CONFIG_NAME.THEME) || PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)];

    return {
      screenModule: this.core.modules.screen,
      selectedColor: model.colors[1],
      colors: this.hexToRgb(model.colors[1]),
      saveLabel: 'Save',
      resetLabel: 'Reset',
      model,
      preset: '',
      fields: {
        presets: {
          name: 'preset',
          model: this,
          label: 'Presets',
          options: [
            {
              title: 'Select Theme',
              value: ''
            }, ...Object.keys(PALETTE_THEMES).map(key => ({
              title: PALETTE_THEMES[String(key)].title,
              value: key
            }))
          ]
        },
        colorPrimary: {
          name: '0',
          type: 'color',
          label: 'Primary'
        },
        colorSecondary: {
          name: '1',
          type: 'color',
          label: 'Secondary'
        },
        colorTertiary: {
          name: '2',
          type: 'color',
          label: 'Tertiary'
        },
        colorQuaternary: {
          name: '3',
          type: 'color',
          label: 'Quaternary'
        },
        filter: {
          name: 'filter',
          label: 'Filter',
          options: [
            {
              title: 'Invert',
              value: 'invert(100%)'
            },
            {
              title: 'Brightness',
              value: 'brightness(50%)'
            }
          ]
        }
      }
    };
  },

  watch: {
    preset (preset) {
      const theme = PALETTE_THEMES[String(preset)];
      this.model = {
        name: theme.name,
        colors: theme.colors,
        filter: theme.filter
      };
      this.selectedColor = this.model.colors[0];
    },
    selectedColor (selectedColor) {
      this.colors = this.hexToRgb(selectedColor);
    },
    colors: {
      deep: true,
      handler (color) {
        this.selectedColor = this.model.colors[this.model.colors.indexOf(this.selectedColor)] = this.rgbToHex(...Object.values(color).map(value => Number(value)));
      }
    }
  },

  methods: {
    rgbToHex (r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    hexToRgb (hex) {
      return [
        '0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0
      ];
    },
    onSubmit (e) {
      const theme = this.model;
      this.core.config.set(CONFIG_NAMES.THEME, theme);
      this.core.modules.screen.setTheme(new PaletteTheme('custom', theme));
      this.$emit('close');
    }
  }
};
</script>

<style lang="postcss">
.wb-module-core-color-settings {
  /* Dropdown */
  --color__dropdown__disabled__text: #000;
  --color__dropdown__disabled__background: #fff;
  --color__dropdown__text: #fff;
  --color__dropdown__background: #000;
  --color__dropdown__border: #000;
  --color__dropdown__outline: #fff;
  --color__dropdown__scrollbarPrimary: #fff;
  --color__dropdown__scrollbarSecondary: #000;
  --color__dropdown__expander__icon: #000;
  --color__dropdown__expander__border: #000;
  --color__dropdown__expander__background: #fff;

  /* Textbox */
  --color__textbox__background: #000;
  --color__textbox__border: #000;
  --color__textbox__outline: #fff;

  /* Button Primary */
  --color__button__primary__label: #000;
  --color__button__primary__background: #fff;
  --color__button__primary__border: #fff;
  --color__button__primary__outline: #000;

  /* Range Slider */
  --color__rangeSlider__background: #000;
  --color__rangeSlider__border: #fff;
  --color__rangeSlider__thumb_background: #fff;

  width: 340px;
  color: #fff;
  background: #000;

  & .color-settings__color_slider {
    & .field__label {
      min-width: 60px;
    }

    & span:last-child {
      flex: 0 0 50px;
      margin-top: 10px;
      text-align: center;
    }
  }

  & .color-settings__colors {
    & > div {
      display: flex;
      align-items: center;

      & span {
        width: 120px;
      }
    }
  }

  & .color-settings__color_controls {
    display: flex;

    & .color-settings__color_preview {
      position: relative;
      flex: 0 0 80px;

      & > i {
        position: absolute;
        top: calc(50% - 40px);
        left: 10%;
        width: 80%;
        height: 80px;
        border: solid #fff 2px;
      }
    }

    & > * {
      flex: 1;

      & > * {
        margin: 10px 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  & .color-settings__color_select {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;

    & label {
      display: block;
      width: 48px;
      height: 28px;
      margin-right: 5px;
      background: var(--color);
      border: solid #fff 2px;
      outline: none;
      appearance: none;

      &:last-child {
        margin-right: 0;
      }

      & input {
        display: none;
      }
    }
  }

  & .color-settings__form {
    padding: var(--default-element-margin);

    & > div:first-child {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 0;
    }
  }

  & .col-1 {
    width: 100%;
  }
}
</style>
