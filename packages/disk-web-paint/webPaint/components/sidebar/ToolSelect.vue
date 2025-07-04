<template>
  <wb-form class="wb-disks-extras13-web-paint-tool-select">
    <ul>
      <li
        v-for="{ passive, title, disabled, value } in items"
        :key="value"
        :class="value">
        <tool-select-item
          name="tool-select"
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { getToolSelectOptions } from '../../lib/utils/select';

import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import ToolSelectItem from './toolSelect/Item.vue';

import { SHAPE_STYLE } from '../../types/select';
import type { TOOLS, ToolSelect } from '../../types/select';
import type { App } from '../../lib/App';

const $props = defineProps<{
  modelValue?: ToolSelect;
  app: App;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue?: ToolSelect): void;
  (e: 'click', event: MouseEvent, value: ToolSelect): void;
}>();

const subscription = new Subscription();

const items = computed<
  {
    value: TOOLS;
    title: string;
    disabled?: boolean;
    passive?: boolean;
  }[]
>(() =>
  getToolSelectOptions({
    shiftActive: shiftActive.value,
    canRedo: canRedo.value,
    canUndo: canUndo.value
  })
);

const shiftActive = ref(false);
onMounted(() => {
  subscription.add(
    domEvents.keyDown.subscribe(() => {
      shiftActive.value = domEvents.shiftActive;
    })
  );
  subscription.add(
    domEvents.keyUp.subscribe(() => {
      shiftActive.value = domEvents.shiftActive;
    })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

function getToolSelect(value: TOOLS): ToolSelect {
  return {
    value,
    shapeStyle: $props.modelValue?.shapeStyle ?? SHAPE_STYLE.STROKED,
    segmentLength: $props.modelValue?.segmentLength ?? 1,
    gapLength: $props.modelValue?.gapLength ?? 0
  };
}

function onInput(value: TOOLS) {
  $emit('update:model-value', getToolSelect(value));
}

function onClick(event: MouseEvent, value: TOOLS) {
  $emit('click', event, getToolSelect(value));
}

const canRedo = computed(() => {
  return (
    $props.app.state.stackCount > 0 &&
    $props.app.state.stackIndex < $props.app.state.stackCount - 1
  );
});

const canUndo = computed(() => {
  return $props.app.state.stackIndex > -1 && $props.app.state.stackCount > 0;
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-tool-select {
  --color-background: var(
    --color-disks-web-paint-sidebar-tool-select-background,
    #05a
  );
  --color-border: var(--color-disks-web-paint-sidebar-border, #fff);

  position: relative;
  clear: fix;
  border-bottom: solid var(--color-border) 2px;

  & input {
    display: none;
  }

  & svg {
    display: block;
  }

  & ul {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    background: var(--color-border);
  }

  & li {
    position: relative;

    /* background-color: var(--color-background); */
  }
}
</style>
