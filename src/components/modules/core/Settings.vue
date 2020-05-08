<template>
  <div class="wb-module-core-settings">
    <wb-form class="settings__form" @submit="onSubmit">
      <div>
        <fieldset v-if="generalSettings.items.legnth > 0" class="col-2">
          <legend>General - Settings</legend>
          <wb-form-field-checkbox-group v-bind="generalSettings" />
        </fieldset>
        <fieldset class="col-1">
          <legend>Screen - Settings</legend>
          <wb-form-field-checkbox-group v-bind="screenSettings" />
        </fieldset>
        <fieldset class="col-1">
          <legend>BOOT - Settings</legend>
          <wb-form-field-checkbox-group v-bind="bootSettings" />
        </fieldset>
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

import { CONFIG_NAMES as CORE_CONFIG_NAME } from '../../../web-workbench/classes/Core';
import WbForm from '@/components/environments/molecules/Form';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbFormFieldCheckboxGroup from '@/components/environments/atoms/formField/CheckboxGroup';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: { WbForm, WbButton, WbButtonWrapper, WbFormFieldCheckboxGroup },
  mixins: [
    MixinWindowComponent
  ],

  data () {
    const model = {
      [CORE_CONFIG_NAME.SCREEN_1084_FRAME]: this.core.config.get(CORE_CONFIG_NAME.SCREEN_1084_FRAME) || false,
      [CORE_CONFIG_NAME.SCREEN_REAL_LOOK]: this.core.config.get(CORE_CONFIG_NAME.SCREEN_REAL_LOOK) || false,
      [CORE_CONFIG_NAME.SCREEN_SCAN_LINES]: this.core.config.get(CORE_CONFIG_NAME.SCREEN_SCAN_LINES) || false,
      [CORE_CONFIG_NAME.SCREEN_ACTIVE_ANIMATION]: this.core.config.get(CORE_CONFIG_NAME.SCREEN_ACTIVE_ANIMATION) || false,
      [CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE]: this.core.config.get(CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE) || false,
      [CORE_CONFIG_NAME.BOOT_WITH_WEBDOS]: this.core.config.get(CORE_CONFIG_NAME.BOOT_WITH_WEBDOS) || false
    };
    return {
      saveLabel: 'Save',
      model
    };
  },

  computed: {
    generalSettings () {
      return {
        model: this.model,
        label: null,
        items: []
      };
    },
    screenSettings () {
      return {
        model: this.model,
        label: null,
        items: [
          { label: 'Use 1084 Frame with 640x480', name: CORE_CONFIG_NAME.SCREEN_1084_FRAME },
          { label: 'Screen with Real-Look', name: CORE_CONFIG_NAME.SCREEN_REAL_LOOK },
          { label: 'Screen with Scan-Lines', name: CORE_CONFIG_NAME.SCREEN_SCAN_LINES },
          { label: 'Screen with On/Off Animation', name: CORE_CONFIG_NAME.SCREEN_ACTIVE_ANIMATION }
        ]
      };
    },
    bootSettings () {
      return {
        model: this.model,
        label: null,
        items: [
          { label: 'Boot with Sequence?', name: CORE_CONFIG_NAME.BOOT_WITH_SEQUENCE },
          { label: 'Boot with WebDos', name: CORE_CONFIG_NAME.BOOT_WITH_WEBDOS }
        ]
      };
    }
  },

  methods: {
    onClickCancel () {
      this.$emit('close');
    },
    onSubmit (e) {
      this.core.config.set(this.model);
      this.$emit('close');
    }
  }
};
</script>

<style lang="postcss">
.wb-module-core-settings {
  width: 340px;

  & .settings__form {
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
    width: calc(50% - 10px * 2);
  }

  & fieldset {
    margin: 10px;
    margin-bottom: 0;
  }
}
</style>
