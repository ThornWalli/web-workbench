<template>
  <div class="wb-disks-extras13-web-painting-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown.vue';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import type { Model } from '../types';

const $props = defineProps<{
  model: Model;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });

const content = ref(
  ['# WebPainting', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join(
    '\n'
  )
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
