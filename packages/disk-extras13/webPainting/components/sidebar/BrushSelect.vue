<template>
  <wb-form class="wb-disks-extras13-web-painting-brush-select">
    <ul class="controls-brushes">
      <li
        v-for="({ passive, title, disabled, value }, index) in items"
        :key="index">
        <brush-select-item
          name="brush-select"
          :passive="passive"
          :title="title"
          :disabled="disabled"
          :value="value"
          :model-value="$props.modelValue"
          @update:model-value="onInput"
          @click="onClick" />
      </li>
    </ul>
  </wb-form>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';

import BrushSelectItem from './brushSelect/Item.vue';

import { BRUSH_SIZE, BRUSH_TYPE, type BrushSelect } from '../../types/select';
import { BRUSH_SIZE_VALUE } from '../../utils/brush';

const $props = defineProps<{
  modelValue?: BrushSelect;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: BrushSelect): void;
  (e: 'click', event: MouseEvent, value: BrushSelect): void;
}>();
const currentType = computed<BRUSH_TYPE>(
  () => items.value[currentIndex.value].value.type
);
const subscription = new Subscription();

const items = computed<
  {
    value: BrushSelect;
    title: string;
    disabled?: boolean;
    passive?: boolean;
  }[]
>(() => [
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.CIRCLE,
      size: BRUSH_SIZE.SMALL
    },
    title: 'Small Circle'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.CIRCLE,
      size: BRUSH_SIZE.MEDIUM
    },
    title: 'Medium Circle'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.CIRCLE,
      size: BRUSH_SIZE.LARGE
    },
    title: 'Large Circle'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.CIRCLE,
      size: BRUSH_SIZE.XLARGE
    },
    title: 'Extra Large Circle'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.SQUARE,
      size: BRUSH_SIZE.XLARGE
    },
    title: 'Extra Large Square'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.SQUARE,
      size: BRUSH_SIZE.LARGE
    },
    title: 'Large Square'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.SQUARE,
      size: BRUSH_SIZE.MEDIUM
    },
    title: 'Medium Square'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.SQUARE,
      size: BRUSH_SIZE.SMALL
    },
    title: 'Small Square'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.DOTS,
      size: BRUSH_SIZE.SMALL
    },
    title: 'Small Dots'
  },
  {
    disabled: false,
    value: {
      type: BRUSH_TYPE.DOTS,
      size: BRUSH_SIZE.MEDIUM
    },
    title: 'Medium Dots'
  }
]);

const currentIndex = ref(
  items.value.findIndex(
    ({ value }) =>
      value.type === $props.modelValue?.type &&
      value.size === $props.modelValue?.size
  )
);

watch(
  () => currentIndex.value,
  index => {
    onInput(items.value[index].value);
  }
);

onUnmounted(() => {
  subscription.unsubscribe();
});

onMounted(() => {
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      switch (e.key) {
        case KEYBOARD_KEY.HOME:
          currentIndex.value = Math.max(currentIndex.value - 1, 0);
          break;
        case KEYBOARD_KEY.INSERT:
          currentIndex.value = Math.min(
            currentIndex.value + 1,
            items.value.length - 1
          );
          break;
      }
      onInput({
        type: currentType.value,
        size: (
          Object.keys(BRUSH_SIZE_VALUE[currentType.value]) as BRUSH_SIZE[]
        )[currentIndex.value]
      });
    })
  );
});

function onInput(e: BrushSelect) {
  $emit('update:model-value', e);
}

function onClick(event: MouseEvent, { type, size }: BrushSelect) {
  $emit('click', event, { type, size });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-brush-select {
  --color-web-painting-brush-select-background: #fff;

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
    }
  }
}
</style>
