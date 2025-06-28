<template>
  <wb-form class="wb-disks-extras13-web-paint-color-palette">
    <div class="colors">
      <ul ref="itemsEl">
        <li v-for="paletteColor in colors" :key="paletteColor.id">
          <input
            :id="paletteColor.id"
            type="radio"
            :name="`${globalId}-palette-color`"
            :value="paletteColor.id"
            :checked="paletteColor.equal(selectedColor)"
            @input="selectedColor = paletteColor" />
          <label :for="paletteColor.id">
            <color-select
              :key="paletteColor.color.toHex()"
              :selected="paletteColor.equal(selectedColor)"
              :readonly="!paletteColor.equal(selectedColor)"
              embed
              :model-value="paletteColor.color"
              @update:model-value="paletteColor.setColor($event)" />
          </label>
        </li>
      </ul>
    </div>
    <div class="info">
      <p class="font-bit-font">Colors: {{ colors.flat().length }}</p>
    </div>
    <wb-button-wrapper>
      <wb-button
        type="button"
        style-type="secondary"
        label="Colors From Image"
        @click="onClickGetPaletteFromImage" />
      <wb-button
        type="button"
        style-type="secondary"
        label="Add"
        @click="onClickAddColor" />
      <wb-button
        type="button"
        style-type="secondary"
        label="Del"
        @click="onClickDeleteColor" />
      <wb-button
        type="button"
        style-type="secondary"
        label="<"
        @click="onClickMoveColorBackward" />
      <wb-button
        type="button"
        style-type="secondary"
        label=">"
        @click="onClickMoveColorForward" />
    </wb-button-wrapper>
    <wb-button-wrapper>
      <wb-button
        type="upload"
        style-type="secondary"
        label="Import"
        @upload="onUploadImport" />
      <wb-button
        type="button"
        style-type="secondary"
        label="Export"
        @click="onClickExport" />
      <wb-button
        type="button"
        style-type="secondary"
        label="Apply Palette"
        @click="onClickApply" />
    </wb-button-wrapper>
  </wb-form>
</template>

<script lang="ts" setup>
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import type { Model } from '../../types';
import ColorSelect from '../ColorSelect.vue';
import { onMounted, onUnmounted, ref, useId } from 'vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';
import { filter, Subscription } from 'rxjs';
import PaletteColor from '../../lib/classes/PaletteColor';

import { generateWindows98_256ColorPalette } from '../../utils/colorPalette';

const globalId = useId();
const colors = ref<PaletteColor[]>([]);
const selectedColor = ref<PaletteColor>();

const itemsEl = ref<HTMLUListElement | null>(null);

const $props = defineProps<{
  model: Model;
}>();

const subscription = new Subscription();
onMounted(() => {
  colors.value = generateWindows98_256ColorPalette().map(color => {
    return new PaletteColor({
      id: crypto.randomUUID(),
      color
    });
  });
  subscription.add(
    domEvents.keyDown
      .pipe(filter(e => e.key === KEYBOARD_KEY.BACKSPACE))
      .subscribe(() => {
        onClickDeleteColor();
      })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

// #region methods

// #region moven move color

function onClickMoveColorBackward() {
  if (!selectedColor.value) {
    return;
  }
  const currentIndex = colors.value.findIndex(color =>
    color.equal(selectedColor.value)
  );
  if (currentIndex > 0) {
    const temp = colors.value[currentIndex - 1];
    colors.value[currentIndex - 1] = colors.value[currentIndex];
    colors.value[currentIndex] = temp;
  }
}
function onClickMoveColorForward() {
  if (!selectedColor.value) {
    return;
  }
  const currentIndex = colors.value.findIndex(color =>
    color.equal(selectedColor.value)
  );
  if (currentIndex < colors.value.length - 1) {
    const temp = colors.value[currentIndex + 1];
    colors.value[currentIndex + 1] = colors.value[currentIndex];
    colors.value[currentIndex] = temp;
  }
}

// #endregion

// #region add delete color

function onClickAddColor() {
  colors.value.push(new PaletteColor()); // Add a new color (black by default)
  selectedColor.value = colors.value[colors.value.length - 1];
}
function onClickDeleteColor() {
  if (!selectedColor.value) {
    return;
  }
  const currentIndex = colors.value.findIndex(color =>
    color.equal(selectedColor.value)
  );
  if (currentIndex !== -1) {
    colors.value.splice(currentIndex, 1);
    selectedColor.value = undefined;
  }

  selectedColor.value = colors.value[Math.max(currentIndex - 1, 0)];
}

// #endregion

// #region import export

async function onUploadImport(files: FileList | null) {
  const colors_: PaletteColor[] = [];
  debugger;
  Array.from(files || []).forEach(async file => {
    const test = JSON.parse(await file.text()).map(
      (paletteColor: PaletteColor) => new PaletteColor(paletteColor)
    );
    console.log('test', test);
    colors_.push(...test);
  });

  colors.value = colors_;
  // empty
}
async function onClickExport() {
  const FileSaver = await import('file-saver').then(module => module.default);
  try {
    const data = colors.value.map(color => {
      return {
        id: crypto.randomUUID(),
        color
      };
    });

    await FileSaver.saveAs(
      new Blob([JSON.stringify(data)]),
      Date.now() + '-palette.json'
    );
  } catch (error) {
    console.error('An error occurred during export.', error);
  }
}

// #endregion

async function onClickGetPaletteFromImage() {
  const { payload } = await $props.model.app.actions.getColors();
  if (payload!.colors.length > 1000) {
    debugger;
    console.warn('Palette must not exceed 100 colors.');
  }
  colors.value = payload!.colors
    .slice(0, 1000)
    .map(color => new PaletteColor({ color }));
}

function onClickApply() {
  // empty
}

// #endregion
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-color-palette {
  & .colors {
    padding: 2px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-scrollbar-background);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar-spacer);
    }
  }

  & p {
    margin: calc(var(--default-element-margin) * 2);
  }

  & ul {
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: repeat(auto-fill, 16px);
    width: calc(3 * 6 * 16px + 4px + 8px);
    height: calc(12 * 16px - 2px);

    & input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }
}
</style>
