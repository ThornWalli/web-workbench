<template>
  <wb-form class="wb-disks-extras13-web-paint-brush-select">
    <ul>
      <li v-for="({ title, value }, index) in items" :key="index">
        <brush-select-item
          name="brush-select"
          :title="title"
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

import type { BRUSH_TYPE, BrushSelect } from '../../types/select';
import { getBrushSelectOptions } from '../../lib/utils/select';

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

const items = ref(getBrushSelectOptions());

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
      let update = false;
      const size = $props.modelValue?.size || 1;
      switch (e.key) {
        case KEYBOARD_KEY.HOME:
          currentIndex.value = Math.max(size - 1, 0);
          update = true;
          break;
        case KEYBOARD_KEY.INSERT:
          currentIndex.value = Math.min(size + 1);
          update = true;
          break;
      }
      if (update) {
        onInput({
          type: currentType.value,
          size
        });
      }
    })
  );
});

function onInput(e: BrushSelect) {
  $emit('update:model-value', e);
}

function onClick(event: MouseEvent, { type, size: size }: BrushSelect) {
  $emit('click', event, { type, size: size });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-brush-select {
  --color-background: var(
    --color-disks-web-paint-sidebar-background-secondary,
    #fff
  );
  --color-border: var(--color-disks-web-paint-sidebar-border, #fa5);

  position: relative;

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

  background: var(--color-background);
  border-top: solid var(--color-border) 2px;
  border-bottom: solid var(--color-border) 2px;

  & ul {
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
