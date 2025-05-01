<template>
  <div class="wb-disks-workbench13-cloud-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';
import { ref } from 'vue';
import type { Model } from '../types';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const content = ref(
  [
    '# Cloud',
    'Connect to a Firebase storage.  \n',
    'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-cloud-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
