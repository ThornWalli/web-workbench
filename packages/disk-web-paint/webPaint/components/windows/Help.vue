<template>
  <div class="wb-disks-extras13-web-paint-help">
    <wb-element-markdown
      :content="content"
      :font-size="12"
      :modular-scale="MODULAR_SCALE.MINOR_SECOND"
      :font-family="FONT_FAMILY.MONOSPACE" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import WbElementMarkdown from '@web-workbench/core/components/elements/Markdown.vue';
import {
  FONT_FAMILY,
  MODULAR_SCALE
} from '@web-workbench/disk-workbench13/documentEditor/utils';
const topics = [
  {
    title: 'General',
    items: [
      {
        title:
          'Which settings should I disable in the WebWorkbench for a clearer display and more workspace?',
        content: `To improve clarity and maximize your usable workspace in the WebWorkbench, we recommend disabling the following settings:
- Use 1084 Frame with 640x480
- Screen with Real-Look
- Screen with Scan-Lines

Disabling these options gives you a cleaner, distraction-free interface and more room to work effectively.`
      }
    ]
  },
  {
    title: 'Draw',
    items: [
      {
        title: 'Transparent Background',
        content:
          'For a transparent background, a transparent color is required and Brush Mode replace to replace the color.'
      }
    ]
  },
  {
    title: 'Color Palette',
    items: [
      {
        title: 'Customize a Palette',
        content:
          'Predefined color palettes are protected.\nCreate a new color palette and transfer the colors from a preset.'
      }
    ]
  }
];

const content = ref(
  [
    '# Help',
    topics
      .map(topic => {
        const items = topic.items.map(item => {
          return `### ${item.title || ''}\n\n${item.content}`;
        });
        return `## ${topic.title}\n\n${items}`;
      })
      .join('\n\n')
  ].join('\n')
);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-help {
  min-width: 360px;
  padding: calc(var(--default-element-margin) * 2);
  padding-right: calc(var(--default-element-margin) * 4);
}
</style>
