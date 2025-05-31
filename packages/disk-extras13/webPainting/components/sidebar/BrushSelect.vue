<template>
  <wb-form class="wb-disks-extras13-web-painting-brush-select">
    <ul class="controls-brushes">
      <li v-for="(item, index) in items" :key="index">
        <label>
          <input
            v-model="currentIndex"
            :disabled="item.disabled"
            type="radio"
            name="index"
            :value="index" />
          <component :is="item.component" />
          <svg-web-painting-disabled
            v-if="item.disabled"
            class="controls-tools-disabled" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { markRaw, onMounted, onUnmounted, ref, watch } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';

import SvgWebPaintingDisabled from '../../assets/svg/web-painting/disabled.svg?component';
import SvgWebPaintingBuiltInBrush0 from '../../assets/svg/web-painting/built_in_brush_0.svg?component';
import SvgWebPaintingBuiltInBrush1 from '../../assets/svg/web-painting/built_in_brush_1.svg?component';
import SvgWebPaintingBuiltInBrush2 from '../../assets/svg/web-painting/built_in_brush_2.svg?component';
import SvgWebPaintingBuiltInBrush3 from '../../assets/svg/web-painting/built_in_brush_3.svg?component';
import SvgWebPaintingBuiltInBrush4 from '../../assets/svg/web-painting/built_in_brush_4.svg?component';
import SvgWebPaintingBuiltInBrush5 from '../../assets/svg/web-painting/built_in_brush_5.svg?component';
import SvgWebPaintingBuiltInBrush6 from '../../assets/svg/web-painting/built_in_brush_6.svg?component';
import SvgWebPaintingBuiltInBrush7 from '../../assets/svg/web-painting/built_in_brush_7.svg?component';
import SvgWebPaintingBuiltInBrush8 from '../../assets/svg/web-painting/built_in_brush_8.svg?component';
import SvgWebPaintingBuiltInBrush9 from '../../assets/svg/web-painting/built_in_brush_9.svg?component';

import { BRUSH_SIZE, BRUSH_TYPE, type BrushSelect } from '../../types/select';

const $props = defineProps<{
  modelValue: BrushSelect;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: BrushSelect): void;
}>();
const currentIndex = ref(0);
const subscription = new Subscription();

const items = ref([
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush0),
    index: BRUSH_TYPE.ROUND,
    size: BRUSH_SIZE.SMALL
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush1),
    index: BRUSH_TYPE.ROUND,
    size: BRUSH_SIZE.MEDIUM
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush2),
    index: BRUSH_TYPE.ROUND,
    size: BRUSH_SIZE.LARGE
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush3),
    index: BRUSH_TYPE.ROUND,
    size: BRUSH_SIZE.XLARGE
  },
  {
    component: markRaw(SvgWebPaintingBuiltInBrush4),
    index: BRUSH_TYPE.SQUARE,
    size: BRUSH_SIZE.XLARGE
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush5),
    index: BRUSH_TYPE.SQUARE,
    size: BRUSH_SIZE.LARGE
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush6),
    index: BRUSH_TYPE.SQUARE,
    size: BRUSH_SIZE.MEDIUM
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush7),
    index: BRUSH_TYPE.SQUARE,
    size: BRUSH_SIZE.SMALL
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush8),
    index: BRUSH_TYPE.SPRINKLE,
    size: BRUSH_SIZE.SMALL
  },
  {
    disabled: true,
    component: markRaw(SvgWebPaintingBuiltInBrush9),
    index: BRUSH_TYPE.SPRINKLE,
    size: BRUSH_SIZE.MEDIUM
  }
]);

watch(
  () => currentIndex.value,
  index => {
    setValue(items.value[Number(index)]);
  }
);

onUnmounted(() => {
  subscription.unsubscribe();
});

onMounted(() => {
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      const size = $props.modelValue.size || 1;
      switch (e.key) {
        case KEYBOARD_KEY.HOME:
          // +
          setValue({
            size: size + 1
          });
          break;
        case KEYBOARD_KEY.INSERT:
          // -
          setValue({
            size: size - 1
          });
          break;
      }
    })
  );
});

function setValue(modelValue: Partial<BrushSelect>) {
  $emit('update:model-value', {
    ...$props.modelValue,
    ...modelValue
  });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-brush-select {
  --color-web-painting-brush-select-background: #fff;
  --color-web-painting-brush-select-selected: #fa5;

  position: relative;
  background: var(--color-web-painting-brush-select-background);

  /* &-built_in_brushes {
    box-sizing: content-box;
    display: block;
    background: $workbenchColor_3;
    border: solid $workbenchColor_1;
    border-width: 2px 2px 0 2px;

    svg {
      * {
        fill: $workbenchColor_1;
      }
    }
  } */

  & input {
    display: none;
  }

  & label {
    display: inline-block;
  }

  & svg {
    display: block;
  }

  & .controls-brushes {
    position: relative;
    width: 46px;
    height: 40px;

    & li {
      position: absolute;

      &:nth-child(1) {
        top: -2px;
        left: 2px;
      }

      &:nth-child(2) {
        top: -4px;
        left: 10px;
      }

      &:nth-child(3) {
        top: -2px;
        left: 18px;
      }

      &:nth-child(4) {
        top: 0;
        left: 30px;
      }

      &:nth-child(5) {
        top: 12px;
        left: 2px;
      }

      &:nth-child(6) {
        top: 10px;
        left: 16px;
      }

      &:nth-child(7) {
        top: 8px;
        left: 28px;
      }

      &:nth-child(8) {
        top: 6px;
        left: 38px;
      }

      /* &:nth-child(9) {
        top: 22px;
        left: 30px;
      } */

      &:nth-child(9) {
        top: 20px;
        left: 8px;
      }

      &:nth-child(10) {
        top: 22px;
        left: 30px;
      }

      & input:checked + :deep(svg *),
      &:hover input:not([disabled]) + :deep(svg *) {
        fill: var(--color-web-painting-tool-select-selected);
      }

      & .controls-tools-disabled {
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
      }
    }
  }
}
</style>
