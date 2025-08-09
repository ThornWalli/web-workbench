<template>
  <div class="wb-disks-workbench13-document-editor">
    <element-input-text
      :override-focused="parentFocused"
      :model-value="model.value.content"
      @update:model-value="onUpdateModelValue"
      @refresh="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import ElementInputText from '@web-workbench/core/components/elements/InputText.vue';

import contextMenu from '../contextMenu';
import { getDefaultDocumentModel } from '../utils';
import useWindow from '@web-workbench/core/composables/useWindow';
import { CONFIG_NAMES } from '../types';
import type { TriggerRefresh } from '@web-workbench/core/types/component';
import useScrollContent from '@web-workbench/core/composables/useScrollContent';

const $emit = defineEmits<{
  (e: 'refresh', value: TriggerRefresh): void;
  (e: 'update:content', value: string): void;
}>();

const $props = defineProps({
  model: {
    type: Object,
    default() {
      return {
        fsItem: null,
        value: getDefaultDocumentModel()
      };
    }
  },
  setContent: {
    type: Function,
    default() {
      return () => {
        return;
      };
    }
  }
});

const { core, setContextMenu, preserveContextMenu, parentFocused } =
  useWindow();

setContextMenu(contextMenu, { model: $props.model });
preserveContextMenu();

const showPreview = computed(
  () => core.config.observable[CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]
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
    refresh();
  }
);

onMounted(() => {
  if (showPreview.value) {
    $props.model.actions.togglePreview();
  }
});

function onUpdateModelValue(value: string) {
  $emit('update:content', value);
}

const { refresh: refreshScrollContent } = useScrollContent();

let timeout;
function refresh() {
  window.clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    refreshScrollContent();
  }, 250);
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor {
  padding: var(--default-element-margin);
}
</style>
