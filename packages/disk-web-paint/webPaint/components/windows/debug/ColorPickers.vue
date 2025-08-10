<template>
  <div class="wb-disks-extras13-web-paint-debug-color-pickers">
    <div>
      Hovered Color: {{ hoveredColor?.toHex() }}<br />
      Selected Color:
      {{ selectedColor.toHex() }}
    </div>

    <wb-form-field-textfield
      v-model="density"
      label="Density"
      placeholder="Density (1-20)"
      type="number" />

    <div class="color-pickers">
      <fieldset v-for="{ title, items } in colorPickers" :key="title">
        <legend>{{ title }}</legend>
        <div class="items">
          <div v-for="item in items" :key="item.type">
            <color-picker
              :width="120"
              :model-value="selectedColor"
              v-bind="item"
              :density="ipoint(Number(density || 1), Number(density || 1))"
              @hover="hoveredColor = $event"
              @update:model-value="onSelect" />
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import ColorPicker, { Type } from '../../ColorPicker.vue';
import Color from '@web-workbench/core/classes/Color';
import WbFormFieldTextfield from '@web-workbench/core/components/elements/formField/Textfield.vue';
import { ipoint } from '@js-basics/vector';

const hoveredColor = ref<Color>();
const selectedColor = ref<Color>(new Color(0, 0, 0, 255));
const density = ref(10);
const colorPickers = computed(() => [
  {
    title: 'General',
    items: [
      { type: Type.CIRCLE, density: density.value - (density.value % 2) },
      { type: Type.SQUARE, density: density.value },
      { type: Type.SQUARE_EXTEND, density: density.value }
    ]
  },
  {
    title: 'HSL',
    items: [
      { type: Type.HSLA_HUE, density: density.value },
      { type: Type.HSLA_SATURATION, density: density.value },
      { type: Type.HSLA_LIGHTNESS, density: density.value },
      { type: Type.HSLA_ALPHA, density: density.value, grid: true }
    ]
  },
  {
    title: 'RGB',
    items: [
      { type: Type.RGBA_RED, density: density.value },
      { type: Type.RGBA_GREEN, density: density.value },
      { type: Type.RGBA_BLUE, density: density.value },
      { type: Type.RGBA_ALPHA, density: density.value, grid: true }
    ]
  }
]);

function onSelect(color: Color) {
  selectedColor.value = color;
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-debug-color-pickers {
  padding: var(--default-element-margin);

  & .color-pickers {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: var(--default-element-margin);

    & fieldset > div {
      display: flex;
    }
  }
}

pre {
  padding: 0;
  margin: 0;
}

/* .wb-disks-extras13-web-paint-color-picker {
  min-width: 120px;
} */
</style>
