<template>
  <div class="wb-disks-workbench13-document-editor-preview" :style="style">
    <wb-markdown
      v-if="model.value.type === 'markdown'"
      :content="model.value.content" />
    <div v-if="model.value.type === 'html'" v-html="model.value.content" />
  </div>
</template>

<script setup>
import { computed, nextTick, watch } from 'vue';
import WbMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import { PROPERTY, getDefaultDocumentModel } from '../index';
import useWindow from '@web-workbench/core/composables/useWindow';

const $props = defineProps({
  model: {
    type: Object,
    default() {
      return {
        value: getDefaultDocumentModel()
      };
    }
  }
});

const $emit = defineEmits(['refresh']);

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const style = computed(() => {
  const fontFamily = $props.model.value[PROPERTY.FONT_FAMILY];
  return {
    '--font-size-markdown': `${$props.model.value[PROPERTY.FONT_SIZE]}`,
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
