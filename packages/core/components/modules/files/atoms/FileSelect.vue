<template>
  <div class="wb-module-files-atoms-file-select">
    <div>
      <wb-item-select v-bind="itemSelect" />
    </div>
    <div>
      <wb-button-wrapper align="outer" full direction="vertical">
        <wb-button
          style-type="secondary"
          :label="backLabel"
          :disabled="disableds.back"
          @click="onClicBack" />
        <wb-button
          style-type="secondary"
          :label="upLabel"
          :disabled="disableds.up"
          @click="onClickUp" />
        <wb-button
          v-if="downLabel"
          style-type="secondary"
          :label="downLabel"
          :disabled="disableds.down"
          @click="onClickDown" />
      </wb-button-wrapper>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T extends Model">
import {
  computed,
  markRaw,
  nextTick,
  onMounted,
  ref,
  watch,
  type Raw
} from 'vue';

import WbButton from '../../../atoms/Button.vue';
import WbButtonWrapper from '../../../molecules/ButtonWrapper.vue';
import WbItemSelect, {
  type Model
} from '../../../atoms/formField/ItemSelect.vue';
import type { Model as ItemModel } from '../../../atoms/formField/itemSelect/Item.vue';

import type FileSystem from '../../../../classes/FileSystem';
import type { TriggerRefresh } from '../../../../types/component';
import Item from '@web-workbench/core/classes/FileSystem/Item';
import ItemContainer from '@web-workbench/core/classes/FileSystem/ItemContainer';

const $emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
  (e: 'select', value: Raw<Item | ItemContainer>): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const $props = defineProps<{
  modelValue: T;
  fileSystem: FileSystem;
  fsItem: ItemContainer | null;
  backLabel?: string;
  upLabel?: string;
  downLabel?: string;
  maxVisibleItems?: number;
}>();

const backLabel = computed(() => {
  return $props.backLabel || '../';
});
const upLabel = computed(() => {
  return $props.upLabel || 'Up';
});
const downLabel = computed(() => {
  return $props.downLabel || 'Down';
});

// const $props = defineProps({
//   modelValue: {
//     type: String,
//     default: null
//   },
//   fileSystem: {
//     type: FileSystem,
//     default() {
//       return null;
//     }
//   },
//   fsItem: {
//     type: [ItemContainer, null],
//     default() {
//       return null;
//     }
//   },
//   backLabel: {
//     type: String,
//     default() {
//       return '../';
//     }
//   },
//   upLabel: {
//     type: String,
//     default() {
//       return 'Up';
//     }
//   },
//   downLabel: {
//     type: String,
//     default() {
//       return 'Down';
//     }
//   },
//   maxVisibleItems: {
//     type: Number,
//     default() {
//       return 5;
//     }
//   }
// });

const itemSelect = computed(() => {
  return {
    title: '',
    items: items.value,
    modelValue: $props.modelValue,
    'onUpdate:model-value': (value: T) => {
      if (typeof value === 'string') {
        $emit('update:model-value', value);
      }
    }
  };
});

const maxVisibleItems = computed(() => {
  return $props.maxVisibleItems || 5;
});
const currentFsItem = ref<ItemContainer>(
  $props.fsItem || markRaw($props.fileSystem.root)
);
const fsItems = ref<(Item | ItemContainer)[]>([]);
const currentIndex = ref(0);

const disableds = computed(() => {
  return {
    back: !currentFsItem.value.parent,
    up: currentIndex.value - 1 < 0,
    down: currentIndex.value + 1 > fsItems.value.length - maxVisibleItems.value
  };
});

const currentPath = computed(() => {
  return $props.modelValue;
});

const items = computed<ItemModel[]>(() => {
  const items: {
    label: string;
    value?: string;
    disabled?: boolean;
  }[] = fsItems.value
    .slice(currentIndex.value, currentIndex.value + maxVisibleItems.value)
    .map(fsItem => {
      return {
        label: fsItem.id,
        value: fsItem.getPath()
      };
    })
    .concat(
      Array(Math.max(maxVisibleItems.value - fsItems.value.length, 0)).fill({
        label: '&nbsp;',
        disabled: true
      })
    );

  if (fsItems.value.length < 1) {
    items[Math.floor(items.length / 2)] = {
      label: 'Empty',
      disabled: true
    };
  }
  return items;
});

watch(
  () => currentPath.value,
  async () => {
    if (typeof $props.modelValue !== 'string') {
      return;
    }
    currentFsItem.value = markRaw(
      await $props.fileSystem.get($props.modelValue)
    );
    if (currentFsItem.value instanceof ItemContainer) {
      fsItems.value = Array.from(
        (await currentFsItem.value.getItems()).values()
      ).map(markRaw);
      currentIndex.value = 0;
    }
    if (
      currentFsItem.value instanceof Item ||
      currentFsItem.value instanceof ItemContainer
    ) {
      $emit('select', currentFsItem.value);
    }
  }
);

onMounted(async () => {
  fsItems.value = Array.from(
    ((await currentFsItem.value?.getItems()) || []).values()
  ).map(fsItem => {
    return markRaw(fsItem);
  });
  nextTick(() => {
    $emit('refresh', { reset: true, resize: false, scroll: false });
  });
});

const onClicBack = () => {
  let path: string | undefined;
  if (
    !(currentFsItem.value instanceof ItemContainer) &&
    currentFsItem.value?.parent?.parent
  ) {
    path = currentFsItem.value?.parent?.parent?.getPath();
  } else if (currentFsItem.value.parent) {
    path = currentFsItem.value.parent?.getPath();
  }
  if (path) {
    $emit('update:model-value', path);
  } else {
    throw new Error('No parent found');
  }
};

const onClickUp = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
};

const onClickDown = () => {
  currentIndex.value = Math.min(
    currentIndex.value + 1,
    fsItems.value.length - maxVisibleItems.value
  );
};
</script>

<style lang="postcss" scoped>
.wb-module-files-atoms-file-select {
  /* empty */
  display: flex;

  & > div {
    flex: 1;

    & > div {
      height: 100%;
    }

    padding: 0 var(--default-element-margin);

    &:last-child {
      flex: 0;
      padding-left: 0;
    }
  }
}
</style>
