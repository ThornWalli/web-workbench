<template>
  <wb-form class="wb-disks-extras13-web-painting-tool-select">
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
import WbForm from '@web-workbench/core/components/fragments/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';
import { KEYBOARD_KEY } from '@web-workbench/core/services/dom';

import ToolSelectItem from './toolSelect/Item.vue';
import { TOOLS, type ToolSelect } from '../../types/select';
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
>(() => [
  {
    disabled: false,
    value: TOOLS.DOTTED_FREEHAND,
    title: 'Dotted Freehand'
  },
  {
    disabled: false,
    value: TOOLS.CONTINUOUS_FREEHAND,
    title: 'Continuous Freehand'
  },
  {
    disabled: true,
    value: TOOLS.STRAIGHT_LINE,
    title: 'Straight Line'
  },
  {
    disabled: true,
    value: TOOLS.CURVE,
    title: 'Curve'
  },
  {
    disabled: true,
    value: TOOLS.FILL_TOOL,
    title: 'Fill Tool'
  },
  {
    disabled: true,
    value: TOOLS.AIR_BRUSH,
    title: 'Air Brush'
  },
  {
    disabled: true,
    value: TOOLS.UNFILLED_FILLED_RECTANGLE,
    title: 'Unfilled Filled Rectangle'
  },
  {
    disabled: true,
    value: TOOLS.UNFILLED_FILLED_CIRCLE,
    title: 'Unfilled Filled Circle'
  },
  {
    disabled: true,
    value: TOOLS.UNFILLED_FILLED_ELLIPSE,
    title: 'Unfilled Filled Ellipse'
  },
  {
    disabled: true,
    value: TOOLS.UNFILLED_FILLED_POLYGON,
    title: 'Unfilled Filled Polygon'
  },
  {
    disabled: true,
    value: TOOLS.BRUSH_SELECTOR,
    title: 'Brush Selector'
  },
  {
    disabled: true,
    value: TOOLS.TEXT,
    title: 'Text'
  },
  {
    disabled: true,
    value: TOOLS.GRID,
    title: 'Grid'
  },
  {
    disabled: true,
    value: TOOLS.SYMMETRY,
    title: 'Symmetry'
  },
  {
    value: TOOLS.MAGNIFY,
    title: 'Magnify'
  },
  {
    value: TOOLS.ZOOM,
    title: 'Zoom'
  },
  ...(shiftActive.value
    ? [
        {
          disabled: !canRedo.value,
          value: TOOLS.STACK_REDO,
          passive: true,
          title: 'Redo'
        }
      ]
    : [
        {
          disabled: !canUndo.value,
          value: TOOLS.STACK_UNDO,
          passive: true,
          title: 'Undo'
        }
      ]),
  {
    value: TOOLS.CLEAR,
    passive: true,
    title: 'Clear'
  }
]);

const filled = ref(true);
const shiftActive = ref(false);
onMounted(() => {
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      switch (e.key) {
        case KEYBOARD_KEY.NUM_PAD_6:
        case KEYBOARD_KEY.KEY_F:
          filled.value = false;
          break;

        default:
          filled.value = true;
          break;
      }
    })
  );
  subscription.add(
    domEvents.keyDown.subscribe(e => {
      if (e.key === KEYBOARD_KEY.SHIFT) {
        shiftActive.value = domEvents.shiftActive;
      }
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

function onInput(value: TOOLS) {
  $emit('update:model-value', { value, filled: filled.value });
}

function onClick(event: MouseEvent, value: TOOLS) {
  $emit('click', event, { value });
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
.wb-disks-extras13-web-painting-tool-select {
  --color-web-painting-tool-select-background: #fff;
  --color-web-painting-tool-select-border: #fff;
  --color-web-painting-tool-select-icon-background: #05a;
  --color-web-painting-tool-select-icon: #fff;
  --color-web-painting-tool-select-selected: #fa5;

  position: relative;
  clear: fix;
  background: var(--color-web-painting-tool-select-background);
  border-bottom: solid var(--color-web-painting-tool-select-border) 2px;

  & input {
    display: none;
  }

  & svg {
    display: block;
  }

  & li {
    position: relative;
    float: left;
    border: solid var(--color-web-painting-tool-select-border);
    border-width: 2px 0 0 2px;

    &:nth-child(even) {
      border-width: 2px 2px 0;
    }
  }
}
</style>
