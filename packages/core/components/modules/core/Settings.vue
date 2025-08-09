<template>
  <wb-form class="wb-module-core-settings" @submit="onSubmit">
    <wb-view-menu>
      <template #default>
        <wb-view-menu-container
          v-if="generalSettings.items.length > 0"
          label="General">
          <wb-form-field-checkbox-group hide-label v-bind="generalSettings" />
          <p class="info-restart">Restart required</p>
        </wb-view-menu-container>
        <wb-view-menu-container
          v-if="screenSettings.items.length > 0"
          label="Screen">
          <wb-form-field-checkbox-group hide-label v-bind="screenSettings" />
          <p class="info-restart">Restart required</p>
        </wb-view-menu-container>
        <wb-view-menu-container
          v-if="bootSettings.items.length > 0"
          label="Boot">
          <wb-form-field-checkbox-group hide-label v-bind="bootSettings" />
          <p class="info-restart">Restart required</p>
        </wb-view-menu-container>
        <wb-view-menu-container
          v-if="bootSettings.items.length > 0"
          label="File Type Assignment">
          <wb-form-field-textarea
            v-bind="fileTypeAssignment"
            label-top
            fluid
            :rows="10" />
        </wb-view-menu-container>
      </template>
      <template #foot>
        <wb-button-wrapper align="outer" full>
          <wb-button
            v-if="saveLabel"
            style-type="primary"
            :label="saveLabel"
            type="submit" />
        </wb-button-wrapper>
      </template>
    </wb-view-menu>
  </wb-form>
</template>

<script lang="ts" setup>
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../../classes/Core/types';
import WbForm from '../../fragments/Form.vue';
import WbButton from '../../elements/Button.vue';
import WbButtonWrapper from '../../fragments/ButtonWrapper.vue';
import type { ModelObject } from '../../elements/formField/CheckboxGroup.vue';
import WbFormFieldCheckboxGroup from '../../elements/formField/CheckboxGroup.vue';
import WbFormFieldTextarea from '../../elements/formField/Textarea.vue';
import useCore from '../../../composables/useCore';
import { computed, ref } from 'vue';

import WbViewMenu from '@web-workbench/core/components/fragments/ViewMenu.vue';
import WbViewMenuContainer from '@web-workbench/core/components/fragments/ViewMenuContainer.vue';

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

const { core } = useCore();

interface Model extends ModelObject {
  [CORE_CONFIG_NAMES.SCREEN_1084_FRAME]: boolean;
  [CORE_CONFIG_NAMES.SCREEN_REAL_LOOK]: boolean;
  [CORE_CONFIG_NAMES.SCREEN_SCAN_LINES]: boolean;
  [CORE_CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]: boolean;
  [CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE]: boolean;
  [CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS]: boolean;
  [CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]: string[][];
}

const model = ref<Model>({
  [CORE_CONFIG_NAMES.SCREEN_1084_FRAME]:
    core.value?.config.get(CORE_CONFIG_NAMES.SCREEN_1084_FRAME) || false,
  [CORE_CONFIG_NAMES.SCREEN_REAL_LOOK]:
    core.value?.config.get(CORE_CONFIG_NAMES.SCREEN_REAL_LOOK) || false,
  [CORE_CONFIG_NAMES.SCREEN_SCAN_LINES]:
    core.value?.config.get(CORE_CONFIG_NAMES.SCREEN_SCAN_LINES) || false,
  [CORE_CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION]:
    core.value?.config.get(CORE_CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION) || false,
  [CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE]:
    core.value?.config.get(CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE) || false,
  [CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS]:
    core.value?.config.get(CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS) || false,
  [CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]:
    core.value?.config.get<string[][]>(
      CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT
    ) || []
});

const encodeExtension = (value: string[][]) => {
  return value.map(a => a.join(' ')).join('\n');
};

const decodeExtension = (value: string) => {
  return value.split('\n').map(a => {
    const [, ext, path] = a.match(/^([^ ]+) +(.*)$/) || [];
    return [ext, path];
  });
};

const saveLabel = 'Save';

const fileTypeAssignment = computed(() => ({
  modelValue: encodeExtension(
    model.value[CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT]
  ),
  'onUpdate:model-value': (value: string) => {
    model.value[CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT] =
      decodeExtension(value);
  },
  name: CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT,
  label: 'File Extension assignment to Application',
  placeholder: 'e.g. md openPreview…'
}));

const generalSettings = computed(() => ({
  label: 'General Settings',
  hideLabel: true,
  items: [],
  modelValue: model.value,
  'onUpdate:model-value': (value: Model) => (model.value = value)
}));

const screenSettings = computed(() => ({
  label: 'Screen - Settings',
  items: [
    {
      label: 'Use 1084 Frame',
      name: CORE_CONFIG_NAMES.SCREEN_1084_FRAME
    },
    {
      label: 'Screen with Real-Look',
      name: CORE_CONFIG_NAMES.SCREEN_REAL_LOOK
    },
    {
      label: 'Screen with Scan-Lines',
      name: CORE_CONFIG_NAMES.SCREEN_SCAN_LINES
    },
    {
      label: 'Screen with On/Off Animation',
      name: CORE_CONFIG_NAMES.SCREEN_ACTIVE_ANIMATION
    }
  ],
  modelValue: model.value,
  'onUpdate:model-value': (value: Model) => (model.value = value)
}));

const bootSettings = computed(() => ({
  label: 'BOOT - Settings',
  items: [
    {
      label: 'Boot with Sequence?',
      name: CORE_CONFIG_NAMES.BOOT_WITH_SEQUENCE
    },
    { label: 'Boot with WebDos?', name: CORE_CONFIG_NAMES.BOOT_WITH_WEBDOS }
  ],
  modelValue: model.value,
  'onUpdate:model-value': (value: Model) => (model.value = value)
}));

const onSubmit = () => {
  core.value?.config.set(model.value);
  $emit('close');
};
</script>

<style lang="postcss" scoped>
.wb-module-core-settings {
  display: flex;
  flex-direction: column;
  width: 480px;
  min-height: 300px;

  & > * {
    flex: 1;
  }

  & .info-restart {
    padding: var(--default-element-margin);
    margin: var(--default-element-margin) 0;
    border-top: solid 4px currentColor;
  }
}
</style>
