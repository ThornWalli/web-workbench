<template>
  <wb-form class="wb-disks-extras13-web-paint-new" @submit="onSubmit">
    <div>
      <div>
        <wb-form-field-dropdown v-bind="fieldTemplates" />
        <wb-form-field-textfield v-bind="fieldDimensionWidth" />
        <wb-form-field-textfield v-bind="fieldDimensionHeight" />
        <wb-form-field-textfield v-bind="fieldDimensionName" />

        <wb-element-markdown
          v-if="currentTemplate?.dimension"
          :content="content" />
      </div>
      <aspect-ratio-preview
        v-if="_currentModel?.dimension"
        :dimension="_currentModel?.dimension" />
    </div>
    <wb-button-wrapper embed>
      <wb-button type="submit" style-type="primary" name="Apply" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import formats, { DEFAULT_TEMPLATE } from '../../utils/formats';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
import type { Model } from '../../types';
import { ipoint, point } from '@js-basics/vector';
import AspectRatioPreview from '../AspectRatioPreview.vue';

const $props = defineProps<{
  model: Model;
}>();

const _currentTemplate = ref(DEFAULT_TEMPLATE);
const _currentModel = reactive({
  dimension: point(DEFAULT_TEMPLATE.dimension.x, DEFAULT_TEMPLATE.dimension.y),
  name: _currentTemplate.value.name || 'New Document'
});

const currentTemplate = computed(
  () =>
    formats
      .find(t =>
        t.formats.find(format => format.name === _currentTemplate.value.name)
      )
      ?.formats.find(format => format.name === _currentTemplate.value.name) ||
    formats[0].formats[0]
);

watch(
  () => currentTemplate.value.dimension,
  newValue => {
    if (newValue) {
      _currentModel.dimension = point(newValue.x, newValue.y);
    }
  }
);

// #region fields

const fieldDimensionWidth = computed(() => {
  return {
    embed: true,
    hideLabel: true,
    label: 'Width',
    required: true,
    placeholder: 'Width in px',

    modelValue: _currentModel.dimension.x,
    'onUpdate:modelValue': (value: string) => {
      _currentModel.dimension.x = parseInt(value);
    }
  };
});

const fieldDimensionHeight = computed(() => ({
  embed: true,
  hideLabel: true,
  label: 'Height',
  type: 'number',
  min: 1,
  step: 1,
  modelValue: _currentModel.dimension.y,
  'onUpdate:modelValue': (value: string) => {
    _currentModel.dimension.y = parseInt(value);
  },
  required: true,
  placeholder: 'Height in px'
}));

const fieldDimensionName = computed(() => ({
  embed: true,
  hideLabel: true,
  label: 'Title',
  modelValue: _currentModel.name || 'New Document',
  'onUpdate:modelValue': (value: string) => {
    _currentModel.name = value;
  },
  required: true,
  placeholder: 'Document Title'
}));

const fieldTemplates = ref({
  embed: true,
  hideLabel: true,
  name: 'Template',
  label: 'template',
  options: formats
    .map(formats => {
      return {
        label: formats.group,
        options: formats.formats.map(item => {
          return {
            label: item.name,
            value: item.name
          };
        })
      };
    })
    .flat(),
  modelValue: _currentTemplate.value,
  'onUpdate:modelValue': (value: string) => {
    _currentTemplate.value =
      formats
        .find(t => t.formats.find(format => format.name === value))
        ?.formats.find(format => format.name === value) || DEFAULT_TEMPLATE;
  },
  required: true,
  placeholder: 'Select a Template'
});

// #endregion

const content = computed(() => {
  if (!currentTemplate.value?.dimension) return '';
  return [
    `**Aspect Ratio:** ${
      getAspectRatio(
        currentTemplate.value.dimension.x,
        currentTemplate.value.dimension.y
      ).x
    }:${
      getAspectRatio(
        currentTemplate.value.dimension.x,
        currentTemplate.value.dimension.y
      ).y
    }`
  ].join('\n');
});

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

function onSubmit(event: Event) {
  event.preventDefault();

  $props.model.actions.newDocument({
    ..._currentModel,
    dimension: ipoint(_currentModel.dimension)
  });

  $emit('close');
}

function getAspectRatio(width: number, height: number) {
  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error('Width and height must be positive numbers');
  }

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  const commonDivisor = gcd(width, height);
  const aspectRatioWidth = width / commonDivisor;
  const aspectRatioHeight = height / commonDivisor;

  return {
    x: aspectRatioWidth,
    y: aspectRatioHeight
  };
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-new {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);

  & > div:first-child {
    display: flex;

    /* flex-direction: column; */
    gap: var(--default-element-margin);

    & > div {
      flex: 1;
    }
  }

  & .wb-env-element-markdown {
    margin: var(--default-element-margin) 0;
  }
}
</style>
