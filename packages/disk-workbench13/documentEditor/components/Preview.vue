<template>
  <div class="wb-disks-workbench13-document-editor-preview">
    <wb-markdown
      v-if="model.value.type === 'markdown'"
      :font-family="$props.model.value[PROPERTY.FONT_FAMILY]"
      :font-size="$props.model.value[PROPERTY.FONT_SIZE]"
      :line-height="$props.model.value[PROPERTY.LINE_HEIGHT]"
      :content="content"
      :modular-scale="
        ($props.model.value as DocumentModel)[PROPERTY.MODULAR_SCALE]
      " />
    <div v-if="model.value.type === 'html'" v-html="content" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue';
import WbMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import { PROPERTY } from '../types';
import type { DocumentModel, Model } from '../types';
import type { TriggerRefresh } from '@web-workbench/core/types/component';

const $props = defineProps<{
  model: Model;
}>();

const content = computed(() => {
  if (Array.isArray($props.model.value)) {
    return $props.model.value.join('\n');
  }
  return $props.model.value.content as string;
});

const $emit = defineEmits<{
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const value = computed(() => $props.model.value);

watch(
  () => value.value,
  () => {
    nextTick(() => {
      $emit('refresh', { scroll: true });
    });
  }
);
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor-preview {
  padding: var(--default-element-margin);
}
</style>
