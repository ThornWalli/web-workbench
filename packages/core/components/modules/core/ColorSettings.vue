<template>
  <div class="wb-module-core-color-settings">
    <wb-form class="form" @submit="onSubmit">
      <div>
        <div class="col-1">
          <wb-form-field-dropdown v-bind="fields.presets" v-model="preset" />
          <wb-form-field label="Colors" class="color-select">
            <div class="colors-select-list">
              <label
                v-for="(color, index) in model.colors"
                :key="index"
                :style="{ '--color': color }">
                <input
                  v-model="selectedColor"
                  type="radio"
                  name="color"
                  :value="color" />
              </label>
            </div>
          </wb-form-field>
          <wb-form-field-dropdown
            v-bind="fields.filter"
            v-model="model.filter" />
        </div>
        <div class="col-1 colors">
          <div class="color-controls">
            <div class="color-preview">
              <i :style="`background-color: rgb(${colors.join(', ')});`" />
            </div>
            <div>
              <div>
                <wb-form-field-range-slider
                  v-model="colors[0]"
                  style-type="color-select"
                  label="Red"
                  class="color-slider"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2">
                  <template #after>
                    <span>{{ colors[0].toString(16).toUpperCase() }}</span>
                  </template>
                </wb-form-field-range-slider>
              </div>
              <div>
                <wb-form-field-range-slider
                  v-model="colors[1]"
                  style-type="color-select"
                  label="Green"
                  class="color-slider"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2">
                  <template #after>
                    <span>{{ colors[1].toString(16).toUpperCase() }}</span>
                  </template>
                </wb-form-field-range-slider>
              </div>
              <div>
                <wb-form-field-range-slider
                  v-model="colors[2]"
                  style-type="color-select"
                  label="Blue"
                  class="color-slider"
                  :max="255"
                  :min="0"
                  :step="1"
                  :handle-size="0.2">
                  <template #after>
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
          type="submit" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script>
import { rgbToHex, hexToRgb } from '../../../utils/color';
import {
  PALETTE_THEMES,
  DEFAULT_PALETTE_THEME,
  PaletteTheme
} from '../../../classes/Theme';
import {
  CONFIG_NAMES as CORE_CONFIG_NAMES,
  CONFIG_NAMES
} from '../../../classes/Core/utils';
import WbForm from '../../molecules/Form';
import WbFormField from '../../atoms/FormField';
import WbFormFieldRangeSlider from '../../atoms/formField/RangeSlider';
import WbFormFieldDropdown from '../../atoms/formField/Dropdown';
import WbButton from '../../atoms/Button';
import WbButtonWrapper from '../../molecules/ButtonWrapper';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbForm,
    WbFormField,
    WbFormFieldRangeSlider,
    WbFormFieldDropdown,
    WbButton,
    WbButtonWrapper
  },

  emits: ['close'],

  setup() {
    return useWindow();
  },

  data() {
    const model =
      this.core.config.get(CORE_CONFIG_NAMES.THEME) ||
      PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)];

    return {
      screenModule: this.core.modules.screen,
      selectedColor: model.colors[1],
      colors: hexToRgb(model.colors[1]),
      saveLabel: 'Save',
      resetLabel: 'Reset',
      model,
      preset: '',
      fields: {
        presets: {
          label: 'Presets',
          options: [
            {
              title: 'Select Theme',
              value: ''
            },
            ...Object.keys(PALETTE_THEMES).map(key => ({
              title: PALETTE_THEMES[String(key)].title,
              value: key
            }))
          ]
        },
        filter: {
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
    preset(preset) {
      const theme = PALETTE_THEMES[String(preset)];
      this.model = {
        name: theme.name,
        colors: theme.colors,
        filter: theme.filter
      };
      this.selectedColor = this.model.colors[0];
    },
    selectedColor(selectedColor) {
      this.colors = hexToRgb(selectedColor);
    },
    colors: {
      deep: true,
      handler(color) {
        this.selectedColor = this.model.colors[
          this.model.colors.indexOf(this.selectedColor)
        ] = rgbToHex(...Object.values(color).map(value => Number(value)));
      }
    }
  },

  methods: {
    onSubmit() {
      const theme = this.model;
      this.core.config.set(CONFIG_NAMES.THEME, theme);
      this.core.modules.screen.setTheme(new PaletteTheme('custom', theme));
      this.$emit('close');
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-core-color-settings {
  /* Dropdown */
  --color-dropdown-disabled-text: #000;
  --color-dropdown-disabled-background: #fff;
  --color-dropdown-text: #fff;
  --color-dropdown-background: #000;
  --color-dropdown-border: #000;
  --color-dropdown-outline: #fff;
  --color-dropdown-scrollbar-primary: #fff;
  --color-dropdown-scrollbar-secondary: #000;
  --color-dropdown-expander-icon: #000;
  --color-dropdown-expander-border: #000;
  --color-dropdown-expander-background: #fff;

  /* Textfield */
  --color-textfield-background: #000;
  --color-textfield-border: #000;
  --color-textfield-outline: #fff;

  /* Button Primary */
  --color-button-primary-label: #000;
  --color-button-primary-background: #fff;
  --color-button-primary-border: #fff;
  --color-button-primary-outline: #000;

  /* Range Slider */
  --color-range-slider-background: #000;
  --color-range-slider-border: #fff;
  --color-range-slider-thumb-background: #fff;

  width: 340px;
  color: #fff;
  background: #000;

  & .color-slider {
    & .field-label {
      min-width: 60px;
    }

    & span:last-child {
      flex: 0 0 50px;
      margin-top: 10px;
      text-align: center;
    }
  }

  & .colors {
    & > div {
      display: flex;
      align-items: center;

      & span {
        width: 120px;
      }
    }
  }

  & .color-controls {
    display: flex;

    & .color-preview {
      position: relative;
      display: flex;
      flex: 0 0 80px;
      padding: 10px;

      & > i {
        flex: 1;
        border: solid #fff 2px;

        &::before {
          display: block;
          padding-top: calc(100%);
          content: '';
        }
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

  & .color-select {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;

    & .colors-select-list {
      display: flex;
      gap: 5px;
    }

    & label {
      display: block;
      flex: 1;
      height: 28px;
      appearance: none;
      outline: none;
      background: var(--color);
      border: solid #fff 2px;

      &:last-child {
        margin-right: 0;
      }

      & input {
        display: none;
      }
    }
  }

  & .form {
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
