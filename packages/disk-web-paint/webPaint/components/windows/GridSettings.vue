<template>
  <wb-form class="wb-disks-extras13-web-paint-grid-settings" @submit="onSubmit">
    <div>
      <wb-form-field-checkbox v-bind="fieldActive" />
      <div>
        <wb-form-field-textfield v-bind="fieldWidth" />
      </div>
      <wb-form-field-textfield v-bind="fieldHeight" />
      <wb-form-field-textfield v-bind="fieldX" />
      <wb-form-field-textfield v-bind="fieldY" />
      <wb-form-field-color v-bind="fieldLinePrimary" />
      <wb-form-field-color v-bind="fieldLineSecondary" />
    </div>
    <div v-if="!hasDisplay" class="no-display">
      <div>
        <p>
          No display is currently active. Please select a display to configure
          the grid settings.
        </p>
      </div>
    </div>
    <wb-button-wrapper>
      <wb-button
        type="button"
        style-type="secondary"
        label="Close"
        @click="onClickClose" />
      <wb-button type="submit" style-type="primary" label="Apply" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbFormFieldCheckbox from '@web-workbench/core/components/elements/formField/Checkbox.vue';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import WbFormFieldColor from '../formField/Color.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';

import type { Model } from '../../types';
import Color from '../../lib/classes/Color';
import type { Grid } from '../../types/display';
import { ipoint } from '@js-basics/vector';

const $props = defineProps<{
  model: Model;
}>();

const hasDisplay = computed(() => {
  return $props.model.app.currentDisplay !== undefined;
});

const currentModel = reactive<Grid>({
  active: false,
  position: ipoint(0, 0),
  dimension: ipoint(1, 1),
  colors: {
    primary: new Color(0, 0, 0, 255 * 0.6),
    secondary: new Color(0, 0, 0, 255 * 0.2)
  }
});

watch(
  () => $props.model.app.currentDisplay,
  display => {
    if (display?.options.grid) {
      currentModel.active = display.options.grid.active;
      currentModel.position = display.options.grid.position;
      currentModel.dimension = display.options.grid.dimension;
      currentModel.colors = { ...display.options.grid.colors };
    }
  },
  { immediate: true }
);

const fieldActive = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Active',
    modelValue: currentModel.active,
    'onUpdate:modelValue': (value: boolean) => {
      currentModel.active = value;
    }
  };
});

const fieldWidth = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Width',
    modelValue: currentModel.dimension.x || 1,
    'onUpdate:modelValue': (value: number) => {
      currentModel.dimension = ipoint(Number(value), currentModel.dimension.y);
    },
    type: 'number',
    min: 1
  };
});

const fieldHeight = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Height',
    modelValue: currentModel.dimension.y || 1,
    'onUpdate:modelValue': (value: number) => {
      currentModel.dimension = ipoint(currentModel.dimension.x, Number(value));
    },
    type: 'number',
    min: 1
  };
});

const fieldX = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'X',
    modelValue: currentModel.position.x || 0,
    'onUpdate:modelValue': (value: number) => {
      currentModel.position = ipoint(Number(value), currentModel.position.y);
    },
    type: 'number'
  };
});
const fieldY = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Y',
    modelValue: currentModel.position.y || 0,
    'onUpdate:modelValue': (value: number) => {
      currentModel.position = ipoint(currentModel.position.x, Number(value));
    },
    type: 'number'
  };
});

const fieldLinePrimary = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Primary Line Color',
    modelValue: currentModel.colors.primary || '#000000',
    'onUpdate:modelValue': (value: Color) => {
      currentModel.colors.primary = value;
    },
    type: 'color'
  };
});
const fieldLineSecondary = computed(() => {
  return {
    disabled: !hasDisplay.value,
    label: 'Secondary Line Color',
    modelValue: currentModel.colors.secondary || '#ffffff',
    'onUpdate:modelValue': (value: Color) => {
      currentModel.colors.secondary = value;
    },
    type: 'color'
  };
});

const $emit = defineEmits<{
  (e: 'close'): void;
}>();

async function onSubmit() {
  await $props.model.app.currentDisplay?.setGrid({
    active: currentModel.active,
    position: currentModel.position,
    dimension: currentModel.dimension,
    colors: {
      primary: currentModel.colors.primary,
      secondary: currentModel.colors.secondary
    }
  });
}

async function onClickClose() {
  $emit('close');
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-grid-settings {
  min-width: 320px;
  padding: var(--default-element-margin);

  & .dimension {
    display: flex;
    flex-direction: row;
    gap: var(--default-element-margin);
    margin-bottom: var(--default-element-margin);

    & > * {
      flex: 0;

      &:first-child {
        flex: 1;
      }
    }
  }

  & .no-display {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    & > div {
      width: 80%;
      padding: var(--default-element-margin);
      color: var(--color-disks-web-paint-grid-warning-foreground);
      text-align: center;
      background-color: var(--color-disks-web-paint-grid-warning-background);
      border: solid var(--color-disks-web-paint-grid-warning-border) 2px;
    }
  }
}
</style>
