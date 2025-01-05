<template>
  <div class="wb-disks-workbench13-calculator-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script setup>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import { ref } from 'vue';

const { setContextMenu } = useWindow();
setContextMenu(contextMenu);

const content = ref(
  ['# Calculator', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join(
    '\n'
  )
);
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-calculator-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
