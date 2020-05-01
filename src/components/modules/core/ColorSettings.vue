<template>
  <div class="wb-module-core-color-settings">
    <wb-form class="settings__form" @submit="onSubmit">
      <div>
        <div class="col-1">
          <wb-form-field-dropdown v-bind="fields.presets" />
        </div>
        <div class="col-2">
          <wb-form-field-textbox v-bind="fields.colorPrimary" :model="model.colors" />
          <wb-form-field-textbox v-bind="fields.colorSecondary" :model="model.colors" />
        </div>
        <div class="col-2">
          <wb-form-field-textbox v-bind="fields.colorTertiary" :model="model.colors" />
          <wb-form-field-textbox v-bind="fields.colorQuaternary" :model="model.colors" />
        </div>
        <div class="col-1">
          <wb-form-field-dropdown v-bind="fields.filter" :model="model" />
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
import WbFormFieldDropdown from '@/components/environments/atoms/formField/Dropdown';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbFormFieldDropdown, WbFormFieldTextbox, WbButton, WbButtonWrapper },
  mixins: [
    MixinWindowComponent
  ],

  data () {
    const model = this.core.config.get(CORE_CONFIG_NAME.THEME) || PALETTE_THEMES[String(DEFAULT_PALETTE_THEME)];

    return {
      saveLabel: 'Save',
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
      this.model = Object.assign({}, PALETTE_THEMES[String(preset)]);
    }
  },

  methods: {
    onClickCancel () {
      this.$emit('close');
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

  width: 340px;
  color: #fff;
  background: #000;

  & .settings__form {
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

  & .col-2 {
    width: calc(50%);
  }

  & fieldset {
    margin: 10px;
    margin-bottom: 0;
  }
}
</style>
