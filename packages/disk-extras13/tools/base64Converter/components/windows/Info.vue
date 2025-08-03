<template>
  <div class="wb-disks-extras13-base64-converter-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

import { ref } from 'vue';

const content = ref(
  [
    '# Base64 Converter',
    'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-base64-converter-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
