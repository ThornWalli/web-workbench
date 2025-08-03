<template>
  <div class="wb-disks-extras13-boing-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import ElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

import { ref } from 'vue';

const content = ref(
  [
    '# Boing!',
    'Version: **1.0** - Created by **Thorn-Welf Walli**',
    '## Amiga "Boing" Ball – A 1984 Revival',
    'The red-and-white checkered ball debuted in January 1984 at CES in Chicago, as a demo for the first Amiga prototype, "Lorraine". Created overnight by Robert J. Mical and Dale Luck, it became a symbol of the Amiga’s vision: smooth animation, vibrant colors, and graphics that amazed – revolutionary for its time.'
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-boing-info {
  min-width: 380px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
