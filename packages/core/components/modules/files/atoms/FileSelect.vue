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

<script setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue';

import WbButton from '../../../atoms/Button';
import WbButtonWrapper from '../../../molecules/ButtonWrapper';
import WbItemSelect from '../../../atoms/formField/ItemSelect';

import ItemContainer from '../../../../classes/FileSystem/ItemContainer';

const $emit = defineEmits(['update:model-value', 'select', 'refresh']);

const $props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  fileSystem: {
    type: Object,
    default() {
      return null;
    }
  },
  fsItem: {
    type: Object,
    default() {
      return null;
    }
  },
  backLabel: {
    type: String,
    default() {
      return '../';
    }
  },
  upLabel: {
    type: String,
    default() {
      return 'Up';
    }
  },
  downLabel: {
    type: String,
    default() {
      return 'Down';
    }
  },
  maxVisibleItems: {
    type: Number,
    default() {
      return 5;
    }
  }
});

const itemSelect = computed(() => {
  return {
    title: null,
    items: items.value,
    modelValue: $props.modelValue,
    'onUpdate:model-value': value => {
      $emit('update:model-value', value);
    }
  };
});

const currentFsItem = ref($props.fsItem || markRaw($props.fileSystem.root));
const fsItems = ref([]);
const currentIndex = ref(0);

const disableds = computed(() => {
  return {
    back: !currentFsItem.value.parent,
    up: currentIndex.value - 1 < 0,
    down: currentIndex.value + 1 > fsItems.value.length - $props.maxVisibleItems
  };
});

const currentPath = computed(() => {
  return $props.modelValue;
});

const items = computed(() => {
  const items = fsItems.value
    .slice(currentIndex.value, currentIndex.value + $props.maxVisibleItems)
    .map(fsItem => {
      return {
        label: fsItem.id,
        value: fsItem.getPath()
      };
    })
    .concat(
      Array(Math.max($props.maxVisibleItems - fsItems.value.length, 0)).fill({
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
    currentFsItem.value = markRaw(
      await $props.fileSystem.get($props.modelValue)
    );
    if (currentFsItem.value instanceof ItemContainer) {
      fsItems.value = Array.from(
        (await currentFsItem.value.getItems()).values()
      ).map(markRaw);
      currentIndex.value = 0;
    }
    $emit('select', currentFsItem.value);
  }
);

onMounted(async () => {
  fsItems.value = Array.from(
    (await currentFsItem.value.getItems()).values()
  ).map(markRaw);
  nextTick(() => {
    $emit('refresh', { reset: true, resize: false, scroll: false });
  });
});

const onClicBack = () => {
  if (!(currentFsItem.value instanceof ItemContainer)) {
    $emit('update:model-value', currentFsItem.value.parent.parent.getPath());
  } else {
    $emit('update:model-value', currentFsItem.value.parent.getPath());
  }
};

const onClickUp = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
};

const onClickDown = () => {
  currentIndex.value = Math.min(
    currentIndex.value + 1,
    fsItems.value.length - $props.maxVisibleItems
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
