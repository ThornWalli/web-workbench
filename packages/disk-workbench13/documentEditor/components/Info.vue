<template>
  <div class="wb-disks-workbench13-document-editor-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import contextMenu from '../contextMenu';
import { getDefaultDocumentModel } from '../index';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    model: {
      type: Object,
      default() {
        return { value: getDefaultDocumentModel() };
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
        '# Document Editor',
        'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
