<template>
  <div class="wb-disks-extras13-web-paint-help">
    <wb-element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import WbElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
const topics = [
  {
    title: 'Transparent Background',
    content:
      'For a transparent background, a transparent color is required and Brush Mode replace to replace the color.'
  }
];

const content = ref(
  [
    '# Help',
    topics.map(topic => `## ${topic.title}\n\n${topic.content}`).join('\n\n')
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-help {
  min-width: 360px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
