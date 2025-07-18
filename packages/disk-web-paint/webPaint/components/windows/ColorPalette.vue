<template>
  <wb-form class="wb-disks-extras13-web-paint-color-palette">
    <div class="colors style-scrollbar">
      <ul ref="itemsEl">
        <li v-for="paletteColor in colors" :key="paletteColor.id">
          <input
            :id="'color-palette-' + paletteColor.id"
            type="radio"
            :name="`${globalId}-palette-color`"
            :value="paletteColor.id"
            :checked="paletteColor.equal(selectedColor)"
            @input="selectedColor = paletteColor" />
          <label :for="'color-palette-' + paletteColor.id">
            <wb-paint-color-select
              :key="paletteColor.color.toHex()"
              :selected="paletteColor.equal(selectedColor)"
              :readonly="!paletteColor.equal(selectedColor)"
              embed
              :model-value="paletteColor.color"
              @update:model-value="onUpdateModelValue($event, paletteColor)" />
          </label>
        </li>
      </ul>
    </div>
    <div>
      <div class="test">
        <div class="info">
          <span class="font-bit-font">Total: {{ colors.flat().length }}</span>
          <span class="font-bit-font">
            {{ selectedColor?.color.toHex() }}
          </span>
        </div>
        <div class="separator"></div>
        <wb-button-wrapper embed>
          <wb-button
            :disabled="currentPalette?.locked"
            type="button"
            style-type="compact"
            :label="t('window.color_palette.add_color.label')"
            @click="onClickAddColor" />
          <wb-button
            :disabled="currentPalette?.locked"
            type="button"
            style-type="compact"
            :label="t('window.color_palette.remove_color.label')"
            @click="onClickDeleteColor" />
          <wb-button
            :disabled="currentPalette?.locked"
            type="button"
            style-type="compact"
            :label="t('window.color_palette.move_color_backward.label')"
            @click="onClickMoveColorBackward" />
          <wb-button
            :disabled="currentPalette?.locked"
            type="button"
            style-type="compact"
            :label="t('window.color_palette.move_color_forward.label')"
            @click="onClickMoveColorForward" />
        </wb-button-wrapper>
      </div>
      <wb-form-field-dropdown style-type="compact" v-bind="fieldPalette" />
      <wb-button-wrapper>
        <wb-form-field-dropdown
          style-type="compact"
          :disabled="currentPalette?.locked"
          v-bind="fieldColorsFromPalette" />
        <wb-button
          style="flex: 0"
          type="button"
          style-type="compact"
          :label="t('window.color_palette.colors_from_image.label')"
          :disabled="currentPalette?.locked"
          @click="onClickGetPaletteFromImage" />
      </wb-button-wrapper>
      <wb-button-wrapper type="grid" :columns="3" embed>
        <wb-button
          type="upload"
          style-type="compact"
          :label="t('window.color_palette.import_palette.label')"
          @upload="onUploadImport" />
        <wb-button
          type="button"
          style-type="compact"
          :label="t('window.color_palette.add_palette.label')"
          @click="onClickAddPalette" />
        <wb-button
          :disabled="currentPalette?.locked"
          type="button"
          style-type="compact"
          :label="t('window.color_palette.remove_palette.label')"
          @click="onClickDeletePalette" />
        <wb-button
          type="button"
          style-type="compact"
          :label="t('window.color_palette.export_palette.label')"
          @click="onClickExport" />
        <wb-button
          :disabled="currentPalette?.locked"
          type="button"
          style-type="compact"
          :label="t('window.color_palette.rename_palette.label')"
          @click="onClickRenamePalette" />
        <wb-button
          :disabled="!currentPalette"
          type="button"
          style-type="compact"
          :label="t('window.color_palette.save_palette.label')"
          @click="onClickApply" />
      </wb-button-wrapper>
    </div>
  </wb-form>
</template>

<script lang="ts" setup>
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import WbButtonWrapper from '@web-workbench/core/components/fragments/ButtonWrapper.vue';
import WbButton from '@web-workbench/core/components/elements/Button.vue';
import WbFormFieldDropdown from '@web-workbench/core/components/elements/formField/Dropdown.vue';

import { CONFIG_NAMES } from '../../types';
import type { Model } from '../../types';
import WbPaintColorSelect from '../ColorSelect.vue';
import { computed, onMounted, onUnmounted, ref, useId } from 'vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { filter, Subscription } from 'rxjs';
import PaletteColor from '../../lib/classes/PaletteColor';

import {
  getDefaultPalette,
  getPalette,
  getPalettes,
  PALETTE
} from '../../utils/colorPalette';
import Palette from '../../lib/classes/Palette';
import type { IPalette } from '../../lib/classes/Palette';
import type Core from '@web-workbench/core/classes/Core';
import type Color from '../../lib/classes/Color';
import { KEYBOARD_KEY } from '@web-workbench/core/types/dom';
import useI18n from '../../composables/useI18n';

const { t } = useI18n();
const globalId = useId();

const currentPalette = ref<Palette>();
const colors = computed(() => {
  if (!currentPalette.value) {
    return [];
  }
  return currentPalette.value.colors;
});
const selectedColor = ref<PaletteColor>();

const itemsEl = ref<HTMLUListElement | null>(null);

const $props = defineProps<{
  core: Core;
  model: Model;
}>();

function onUpdateModelValue(color: Color, paletteColor: PaletteColor) {
  paletteColor.setColor(color);
  saveColorPalette();
}

const palettes = ref<Palette[]>([getDefaultPalette()].concat(getPalettes()));

const totalPalettes = computed(() => {
  return [...palettes.value, ...colorPalettesConfig.value];
});

const colorPalettesConfig = computed<Palette[], Palette[]>({
  get: () =>
    (
      $props.core!.config.get<IPalette[]>(CONFIG_NAMES.WEB_PAINT_PALETTES) || []
    ).map(palette => new Palette(palette)),
  set: (value: Palette[]) => {
    $props.core!.config.set(CONFIG_NAMES.WEB_PAINT_PALETTES, value);
  }
});
function saveColorPalette() {
  colorPalettesConfig.value = [...colorPalettesConfig.value];
}

// #region form fields

const fieldColorsFromPalette = computed(() => {
  return {
    label: t('window.color_palette.colors_from_palette.label'),
    hideLabel: true,
    modelValue: '',
    'onUpdate:model-value': (id: string) => {
      const palette = totalPalettes.value.find(palette => palette.id === id);
      if (currentPalette.value && palette) {
        currentPalette.value.colors.push(...palette.colors);
        saveColorPalette();
      }
    },
    options: [
      {
        label: t(
          'window.color_palette.colors_from_palette.items.default.label'
        ),
        value: ''
      },
      ...(colorPalettesConfig.value.length > 0
        ? [
            {
              label: t(
                'window.color_palette.colors_from_palette.items.custom_palettes.label'
              ),
              options: colorPalettesConfig.value.map(palette => ({
                label: palette.name,
                value: palette.id
              }))
            }
          ]
        : []),
      {
        label: t(
          'window.color_palette.colors_from_palette.items.builtin_palettes.label'
        ),
        options: palettes.value.map(palette => ({
          label: palette.name,
          value: palette.id
        }))
      }
    ]
  };
});
const fieldPalette = computed(() => {
  return {
    label: t('window.color_palette.palette.label'),
    hideLabel: true,
    modelValue: currentPalette.value?.id,
    'onUpdate:model-value': (id: string) =>
      (currentPalette.value = totalPalettes.value.find(
        palette => palette.id === id
      )),
    options: [
      {
        label: t('window.color_palette.palette.items.new.label'),
        value: ''
      },
      ...(colorPalettesConfig.value.length > 0
        ? [
            {
              label: t(
                'window.color_palette.palette.items.custom_palettes.label'
              ),
              options: colorPalettesConfig.value.map(palette => ({
                label: palette.name,
                value: palette.id,
                group: 'custom'
              }))
            }
          ]
        : []),
      {
        label: t('window.color_palette.palette.items.builtin_palettes.label'),
        options: palettes.value.map(palette => ({
          label: palette.name,
          value: palette.id,
          group: 'built-in'
        }))
      }
    ]
  };
});

// #endregion

const subscription = new Subscription();
onMounted(() => {
  currentPalette.value = getPalette(PALETTE.WIN_256);
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

function onClickAddPalette() {
  colorPalettesConfig.value = [
    ...colorPalettesConfig.value,
    new Palette({
      name: 'New Palette',
      colors: []
    })
  ];
  currentPalette.value =
    colorPalettesConfig.value[colorPalettesConfig.value.length - 1];
}
function onClickDeletePalette() {
  if (!currentPalette.value) {
    return;
  }
  const currentIndex = colorPalettesConfig.value.findIndex(
    p => p.id === currentPalette.value!.id
  );
  if (currentIndex !== -1) {
    colorPalettesConfig.value.splice(currentIndex, 1);
    currentPalette.value = undefined;
  }

  currentPalette.value =
    colorPalettesConfig.value[Math.max(currentIndex - 1, 0)];
}

async function onClickRenamePalette() {
  if (currentPalette.value) {
    const value = (
      await $props.model.actions.prompt({
        text: 'Rename Palette',
        type: 'text',
        value: currentPalette.value.name || ''
      })
    )?.value;
    currentPalette.value.name = value;
    saveColorPalette();
  }
}

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
  if (files && files[0]) {
    const palette = new Palette(JSON.parse(await files[0].text()));
    if (colorPalettesConfig.value.find(({ id }) => palette.id === id)) {
      colorPalettesConfig.value = colorPalettesConfig.value.map(p => {
        if (p.id === palette.id) {
          return palette;
        }
        return p;
      });
    } else {
      colorPalettesConfig.value = [...colorPalettesConfig.value, palette];
    }
  }
}

async function onClickExport() {
  const FileSaver = await import('file-saver').then(module => module.default);
  try {
    await FileSaver.saveAs(
      new Blob([JSON.stringify(currentPalette.value)]),
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
    console.warn('Palette must not exceed 100 colors.');
  }
  if (currentPalette.value?.colors) {
    currentPalette.value.colors = payload!.colors
      .slice(0, 500)
      .map(color => new PaletteColor({ color }));
  }
}

function onClickApply() {
  if (currentPalette.value) {
    $props.model.app.setColorPalette(currentPalette.value);
  }
  // empty
}

// #endregion
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-color-palette {
  min-width: 360px;

  & .colors {
    padding: 2px;
    overflow-y: scroll;
  }

  & .colors + div {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    padding: var(--default-element-margin);
  }

  & .info {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }

  & ul {
    display: grid;
    flex-wrap: wrap;
    grid-template-rows: repeat(auto-fill, 16px);
    grid-template-columns: repeat(auto-fill, 16px);
    width: calc(3 * 6 * 16px + 4px + 8px);
    height: calc(8 * 16px - 2px);

    & input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }

  & .test {
    display: flex;
    gap: var(--default-element-margin);
    align-items: center;
    justify-content: space-between;

    /* margin: calc(var(--default-element-margin) * 2)
      var(--default-element-margin); */

    & .separator {
      padding-left: 2px;
      border-left: solid 2px var(--workbench-color-1);
    }
  }
}
</style>
