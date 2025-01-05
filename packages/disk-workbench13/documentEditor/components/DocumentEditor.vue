<template>
  <div class="wb-disks-workbench13-document-editor">
    <atom-input-text
      :options="inputTextOptions"
      :model-value="model.value.content"
      @update:model-value="onUpdateModelValue"
      @refresh="onRefreshInputText" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from 'vue';
import AtomInputText from '@web-workbench/core/components/atoms/InputText';

import contextMenu from '../contextMenu';
import { CONFIG_NAMES, getDefaultDocumentModel } from '../index';
import useWindow from '@web-workbench/core/composables/useWindow';

const $props = defineProps({
  model: {
    type: Object,
    default() {
      return {
        fsItem: null,
        value: getDefaultDocumentModel()
      };
    }
  }
});

const { core, setContextMenu, preserveContextMenu, parentFocused } =
  useWindow();

setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const $emit = defineEmits(['refresh']);

const inputTextOptions = computed(() => ({
  focused: parentFocused.value
}));

const showPreview = computed(
  () => core.value.config.observable[CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]
);

watch(
  () => showPreview.value,
  value => {
    $props.model.actions.togglePreview(value);
  }
);

watch(
  () => $props.model.value,
  () => {
    nextTick(() => {
      $emit('refresh', { scroll: true });
    });
  }
);

onMounted(() => {
  if (showPreview.value) {
    $props.model.actions.togglePreview();
  }
});

function onUpdateModelValue(value) {
  $props.model.value.content = value;
}

function onRefreshInputText() {
  $emit('refresh', { scroll: true });
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor {
  padding: var(--default-element-margin);
}
</style>
