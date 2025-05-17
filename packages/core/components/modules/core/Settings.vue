<template>
  <div class="wb-module-core-settings">
    <wb-form @submit="onSubmit">
      <div class="cols">
        <div class="col-2">
          <wb-form-field-checkbox-group
            v-if="generalSettings.items.length > 0"
            v-bind="generalSettings" />
          <wb-form-field-checkbox-group
            v-if="screenSettings.items.length > 0"
            v-bind="screenSettings" />
          <wb-form-field-checkbox-group
            v-if="bootSettings.items.length > 0"
            v-bind="bootSettings" />
        </div>

        <div class="col-2">
          <wb-form-field-textarea
            v-bind="fileTypeAssignment"
            label-top
            :rows="10" />
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

<script lang="ts" setup>
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '../../../classes/Core/types';
import WbForm from '../../molecules/Form.vue';
import WbButton from '../../atoms/Button.vue';
import WbButtonWrapper from '../../molecules/ButtonWrapper.vue';
import type { ModelObject } from '../../atoms/formField/CheckboxGroup.vue';
import WbFormFieldCheckboxGroup from '../../atoms/formField/CheckboxGroup.vue';
import WbFormFieldTextarea from '../../atoms/formField/Textarea.vue';
import useCore from '../../../composables/useCore';
import { computed, ref } from 'vue';

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
  label: '',
  items: [],
  modelValue: model.value,
  'onUpdate:model-value': (value: Model) => (model.value = value)
}));

const screenSettings = computed(() => ({
  label: 'Screen - Settings',
  items: [
    {
      label: 'Use 1084 Frame with 640x480',
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
  // model.value[String(CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT)] =
  //   model.value[String(CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT)]
  //     .split('\n')
  //     .map(a => a.match(/^([^ ]+) +(.*)$/).slice(1, 3));
  // core.value?.config.set(model.value);
  core.value?.config.set(model.value);
  $emit('close');
};
</script>

<style lang="postcss" scoped>
.wb-module-core-settings {
  width: 320px;

  @media (width >= 610px) {
    width: 600px;

    & .cols {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      & > * {
        width: 100%;
      }

      & .col-2 {
        width: 50%;
        padding: var(--default-element-margin);
      }
    }

    & .col-1 {
      width: 100%;
    }

    & .col-2 {
      width: 50%;
      padding: var(--default-element-margin);
    }
  }

  & fieldset {
    margin-top: calc(var(--default-element-margin) * 2);
  }
}
</style>
