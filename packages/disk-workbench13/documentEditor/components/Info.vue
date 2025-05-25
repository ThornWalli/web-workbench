<template>
  <div class="wb-disks-workbench13-document-editor-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { DocumentModel } from '../types';
import type Item from '@web-workbench/core/classes/FileSystem/Item';

const $props = defineProps<{
  model: {
    fsItem: Item;
    value: DocumentModel;
  };
}>();

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
