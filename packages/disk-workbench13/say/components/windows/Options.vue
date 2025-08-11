<template>
  <div ref="rootEl" class="wb-disks-workbench13-options">
    <wb-form @submit="onSubmit" @reset="onReset">
      <wb-form-field-dropdown v-bind="fieldVoice" label-top />
      <wb-form-field-range-slider
        v-bind="fieldRate"
        :label="`${fieldRate.label} (${fieldRate.modelValue})`"
        label-top />
      <wb-form-field-range-slider
        v-bind="fieldPitch"
        :label="`${fieldPitch.label} (${fieldPitch.modelValue})`"
        label-top />
      <wb-button-wrapper direction="vertical" align="outer" full>
        <wb-button type="submit" style-type="primary" label="Save" />
        <wb-button type="reset" style-type="secondary" label="Reset" />
      </wb-button-wrapper>
    </wb-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import contextMenu from '../../contextMenu';
import useWindow, {
  WINDOW_TITLE_STATUS
} from '@web-workbench/core/composables/useWindow';

import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbFormFieldRangeSlider from '@web-workbench/core/components/elements/formField/RangeSlider.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import type { Model, Options } from '../../types';
import { getDefaultVoice, getVoiceByName } from '../../utils';

const $props = defineProps<{
  model: Model;
  modelValue: Options;
}>();

const { setContextMenu, setTitleStatus, close } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const voices = ref(window.speechSynthesis.getVoices());

const rootEl = ref<HTMLInputElement | null>(null);

const $emit = defineEmits<{
  (e: 'update:model-value', value: Options): void;
}>();

const currentModel = reactive<Options>({
  ...$props.modelValue
});

watch(
  () => currentModel,
  () => {
    setTitleStatus(WINDOW_TITLE_STATUS.EDIT);
  },
  { deep: true }
);

const fieldVoice = computed(() => {
  return {
    label: 'Voice',
    options: voiceOptions.value,
    modelValue: currentModel.voice.name,
    'onUpdate:model-value': async (voice: string) =>
      (currentModel.voice = await getVoiceByName(voice))
  };
});

const fieldRate = computed(() => {
  return {
    label: 'Rate',
    name: 'fieldRate',
    modelValue: currentModel.rate,
    'onUpdate:model-value': (rate: number) => (currentModel.rate = rate),
    max: 10,
    min: 0.1,
    step: 0.1,
    handleSize: 0.1
  };
});
const fieldPitch = computed(() => {
  return {
    label: 'Pitch',
    name: 'fieldPitch',
    modelValue: currentModel.pitch,
    'onUpdate:model-value': (pitch: number) => (currentModel.pitch = pitch),
    max: 2,
    min: 0,
    step: 0.1,
    handleSize: 0.1
  };
});

const voiceOptions = computed(() => {
  return voices.value.map(voice => {
    return {
      title: `${voice.name} (${voice.lang})`,
      value: voice.name
    };
  });
});

async function onReset() {
  Object.assign(currentModel, {
    rate: 1,
    pitch: 1,
    voice: await getDefaultVoice()
  });
}

function onSubmit() {
  $emit('update:model-value', currentModel);
  setTitleStatus(WINDOW_TITLE_STATUS.NONE);
  close();
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-options {
  position: relative;
  width: 200px;

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  & .period {
    position: absolute;
    top: var(--default-element-margin);
    right: var(--default-element-margin);
  }
}
</style>
