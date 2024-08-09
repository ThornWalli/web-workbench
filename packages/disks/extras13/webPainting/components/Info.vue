<template>
  <div class="wb-disks-extras13-web-painting-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  setup(props) {
    const model = toRef(props, 'model');
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu, { model: model.value });
    return windowContext;
  },

  data() {
    return {
      content: [
        '# WebPainting',
        'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
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
