<template>
  <div class="wb-disks-extras13-web-paint-info">
    <wb-element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import WbElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';

const content = ref(
  ['# Web Paint', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'].join(
    '\n'
  )
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
