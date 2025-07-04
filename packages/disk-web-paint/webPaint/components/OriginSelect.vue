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
import SvgOriginSelectLeftTop from '../assets/svg/origin-select/left_top.svg?component';
import SvgOriginSelectTop from '../assets/svg/origin-select/top.svg?component';
import SvgOriginSelectRightTop from '../assets/svg/origin-select/right_top.svg?component';
import SvgOriginSelectLeft from '../assets/svg/origin-select/left.svg?component';
import SvgOriginSelectCenter from '../assets/svg/origin-select/center.svg?component';
import SvgOriginSelectRight from '../assets/svg/origin-select/right.svg?component';
import SvgOriginSelectLeftBottom from '../assets/svg/origin-select/left_bottom.svg?component';
import SvgOriginSelectBottom from '../assets/svg/origin-select/bottom.svg?component';
import SvgOriginSelectRightBottom from '../assets/svg/origin-select/right_bottom.svg?component';
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
  --color-background: var(
    --color-disks-web-paint-origin-select-background,
    #fff
  );
  --color-foreground: var(
    --color-disks-web-paint-origin-select-foreground,
    #000
  );
  --color-selected-background: var(
    --color-disks-web-paint-origin-select-selected-background,
    #fa5
  );
  --color-selected-foreground: var(
    --color-disks-web-paint-origin-select-selected-foreground,
    #000
  );

  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(3, auto);
  gap: 2px;

  & div {
    position: relative;
  }

  & label {
    display: block;
    padding: 4px;
    background: var(--color-background);

    & svg {
      display: block;
      fill: var(--color-foreground);
    }
  }

  & input {
    position: absolute;
    opacity: 0;
  }

  & input:checked + label {
    background: var(--color-selected-background);

    & svg {
      fill: var(--color-selected-foreground);
    }
  }

  & input[disabled] + label {
    visibility: hidden;
  }
}
</style>
