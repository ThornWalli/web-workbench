<template>
  <div class="wb-disks-workbench13-document-editor-preview" :style="style">
    <wb-markdown v-if="model.value.type === 'markdown'" :content="content" />
    <div v-if="model.value.type === 'html'" v-html="content" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';

import contextMenu from '../contextMenu';
import { MODULAR_SCALE_VALUES } from '../utils';
import useWindow from '@web-workbench/core/composables/useWindow';
import { PROPERTY, type DocumentModel, type Model } from '../types';
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

const style = computed(() => {
  const fontFamily = $props.model.value[PROPERTY.FONT_FAMILY];
  const fontSize = $props.model.value[PROPERTY.FONT_SIZE];
  const lineHeight = $props.model.value[PROPERTY.LINE_HEIGHT];
  const modularScale =
    MODULAR_SCALE_VALUES[
      ($props.model.value as DocumentModel)[PROPERTY.MODULAR_SCALE]
    ];
  return {
    '--font-size-markdown': fontSize,
    '--font-line-height-markdown': lineHeight,
    '--font-modular-scale-markdown': modularScale,
    '--font-markdown-typo-headline-primary': fontFamily,
    '--font-markdown-typo-headline-secondary': fontFamily,
    '--font-markdown-typo-text': fontFamily,
    '--font-markdown-typo-code': fontFamily,
    '--font-markdown-typo-blockquote': fontFamily
  };
});

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
