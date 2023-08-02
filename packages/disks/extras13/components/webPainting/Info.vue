<template>
  <div class="wb-disks-extras13-web-painting-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../webPainting/contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return { };
      }
    }
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data () {
    return {
      content: [
        '# WebPainting', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
