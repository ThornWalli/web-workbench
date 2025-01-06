<template>
  <div class="wb-disks-workbench13-document-editor-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import { getDefaultDocumentModel } from '../index';
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

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const content = ref(
  [
    '# Document Editor',
    'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
