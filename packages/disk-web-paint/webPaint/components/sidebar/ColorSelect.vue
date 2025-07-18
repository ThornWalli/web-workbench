<template>
  <wb-form class="wb-disks-extras13-web-paint-color-select">
    <div class="color-select" @contextmenu="onContextMenu">
      <wb-paint-color-select
        class="secondary center"
        :size="22"
        readonly
        embed
        :ratio="11 / 22"
        :model-value="$props.modelValue.secondaryColor.color" />
      <wb-paint-color-select
        class="primary"
        :size="44"
        readonly
        embed
        :ratio="22 / 44"
        :model-value="$props.modelValue.primaryColor.color" />
    </div>
    <ul
      data-hook="colorPaletteItems"
      class="style-filled style-scrollbar style-scrollbar-invert">
      <li v-for="paletteColor in colors" :key="paletteColor.id">
        <input
          :id="paletteColor.id"
          type="radio"
          :name="`${globalId}-palette-color`"
          :value="paletteColor.id"
          :checked="paletteColor.equal(selectedColor)"
          @input="selectedColor = paletteColor" />
        <label :for="paletteColor.id">
          <wb-paint-color-select
            :key="paletteColor.color.toHex()"
            :size="COLOR_SELECT_SIZE.SEMI"
            :selected="paletteColor.equal(selectedColor)"
            :hoverable="!paletteColor.equal(selectedColor)"
            :readonly="
              $props.modelValue.palette.locked ||
              !paletteColor.equal(selectedColor)
            "
            embed
            :model-value="paletteColor.color"
            @update:model-value="onUpdateModelValue($event, paletteColor)" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';

import { onUnmounted, onMounted, watch, computed, ref, useId } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { KEYBOARD_KEY } from '@web-workbench/core/types/dom';

import WbPaintColorSelect, { COLOR_SELECT_SIZE } from '../ColorSelect.vue';
import PaletteColor from '../../lib/classes/PaletteColor';
import type { ColorSelect } from '../../types/select';
import { CONFIG_NAMES } from '../../types';
import Palette from '../../lib/classes/Palette';
import type { IPalette } from '../../lib/classes/Palette';
import useCore from '@web-workbench/core/composables/useCore';
import Color from '../../lib/classes/Color';

const globalId = useId();
const { core } = useCore();

const $props = defineProps<{
  modelValue: ColorSelect;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: ColorSelect): void;
}>();

const subscription = new Subscription();
const selectedColor = ref<PaletteColor>();
const primarySelect = ref(true);

watch(
  () => selectedColor.value,
  (paletteColor?: PaletteColor) => {
    if (paletteColor) {
      if (primarySelect.value) {
        setValue('primaryColor', paletteColor);
      } else {
        setValue('secondaryColor', paletteColor);
      }
    }
  }
);

onMounted(() => {
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      switch (e.key) {
        case KEYBOARD_KEY.FUNCTION_9:
        case KEYBOARD_KEY.KEY_X:
          toggleColors();
          break;
      }
    })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

const colors = computed(() => {
  const colors = $props.modelValue.palette.colors;
  return [
    new PaletteColor({
      id: 'blank',
      color: new Color(0, 0, 0, 0)
    }),
    ...colors
  ];
});

function setValue(name: string, value: PaletteColor) {
  $emit('update:model-value', {
    ...$props.modelValue,
    [name]: value
  });
}

function toggleColors() {
  const primaryColor = $props.modelValue.secondaryColor;
  const secondaryColor = $props.modelValue.primaryColor;
  $emit('update:model-value', {
    ...$props.modelValue,
    primaryColor,
    secondaryColor
  });
}

function onContextMenu(e: Event) {
  e.preventDefault();
  toggleColors();
}

const colorPalettesConfig = computed<Palette[], Palette[]>({
  get: () =>
    (
      core.value!.config.get<IPalette[]>(CONFIG_NAMES.WEB_PAINT_PALETTES) || []
    ).map(palette => new Palette(palette)),
  set: (value: Palette[]) => {
    core.value!.config.set(CONFIG_NAMES.WEB_PAINT_PALETTES, value);
  }
});

function saveColorPalette() {
  colorPalettesConfig.value = [...colorPalettesConfig.value];
}

function onUpdateModelValue(color: Color, paletteColor: PaletteColor) {
  paletteColor.setColor(color);
  saveColorPalette();
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-color-select {
  --color-background: var(
    --color-disks-web-paint-sidebar-color-select-background,
    #ccc
  );
  --color-item-border: var(
    --color-disks-web-paint-sidebar-color-select-item-selected-border,
    #fff
  );
  --color-border: var(--color-disks-web-paint-sidebar-border, #fff);

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  border-left: solid var(--color-border) 2px;

  & input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  & ul {
    clear: fix;
    flex: 1;
    overflow: hidden scroll;

    & li {
      position: relative;
      float: left;

      & span {
        position: relative;

        /* z-index: 1; */
        display: block;
        width: 12px;
        height: 12px;
      }

      /* & input:checked + span,
      &:hover input:not([disabled]) + span {
        &::after {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          content: '';
          border: solid var(--color-item-border) 2px;
          mix-blend-mode: difference;
        }
      } */
    }
  }

  & .color-select {
    position: relative;

    & .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
