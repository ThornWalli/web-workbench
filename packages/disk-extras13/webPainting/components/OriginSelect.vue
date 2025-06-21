<template>
  <div class="origin-select">
    <div v-for="{ value, svg, hide } in items" :key="value">
      <input
        :id="id"
        :disabled="hide"
        type="radio"
        name="origin-select"
        :value="value"
        :checked="value === modelValue"
        @input="onInput" />
      <label :for="id">
        <component :is="svg"> </component>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgOriginSelectLeftTop from '../assets/svg/web-painting/origin-select/left_top.svg?component';
import SvgOriginSelectTop from '../assets/svg/web-painting/origin-select/top.svg?component';
import SvgOriginSelectRightTop from '../assets/svg/web-painting/origin-select/right_top.svg?component';
import SvgOriginSelectLeft from '../assets/svg/web-painting/origin-select/left.svg?component';
import SvgOriginSelectCenter from '../assets/svg/web-painting/origin-select/center.svg?component';
import SvgOriginSelectRight from '../assets/svg/web-painting/origin-select/right.svg?component';
import SvgOriginSelectLeftBottom from '../assets/svg/web-painting/origin-select/left_bottom.svg?component';
import SvgOriginSelectBottom from '../assets/svg/web-painting/origin-select/bottom.svg?component';
import SvgOriginSelectRightBottom from '../assets/svg/web-painting/origin-select/right_bottom.svg?component';
import { ORIGIN } from '../types';
import { computed, useId } from 'vue';
const id = useId();

const $emit = defineEmits<{
  (e: 'update:model-value', value: ORIGIN): void;
}>();

const $props = defineProps<{
  modelValue?: ORIGIN;
  withCenter?: boolean;
}>();

const items = computed(() => [
  { value: ORIGIN.LEFT_TOP, svg: SvgOriginSelectLeftTop },
  { value: ORIGIN.TOP, svg: SvgOriginSelectTop },
  { value: ORIGIN.RIGHT_TOP, svg: SvgOriginSelectRightTop },
  { value: ORIGIN.LEFT, svg: SvgOriginSelectLeft },
  {
    hide: !$props.withCenter,
    value: ORIGIN.CENTER,
    svg: SvgOriginSelectCenter
  },
  { value: ORIGIN.RIGHT, svg: SvgOriginSelectRight },
  { value: ORIGIN.LEFT_BOTTOM, svg: SvgOriginSelectLeftBottom },
  { value: ORIGIN.BOTTOM, svg: SvgOriginSelectBottom },
  { value: ORIGIN.RIGHT_BOTTOM, svg: SvgOriginSelectRightBottom }
]);

function onInput(e: Event) {
  $emit('update:model-value', (e.target as HTMLInputElement).value as ORIGIN);
}
</script>

<style lang="postcss" scoped>
.origin-select {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(3, auto);
  gap: 2px;

  & div {
    position: relative;
  }

  & svg {
    display: block;
  }

  & label {
    display: block;
    padding: 4px;
    background: var(--workbench-color-1);
  }

  & input {
    position: absolute;
    opacity: 0;
  }

  /* & input:focus + svg {
    filter: var(--filter-default);
  } */

  & input:checked + label {
    background: var(--workbench-color-4);
  }

  & input[disabled] + label {
    visibility: hidden;
  }

  /* width: 100%;
  height: 100%;
  gap: var(--default-element-margin);

  & > * {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      width: calc(var(--default-element-size) * 0.75);
      height: calc(var(--default-element-size) * 0.75);
    }
  } */
}
</style>
