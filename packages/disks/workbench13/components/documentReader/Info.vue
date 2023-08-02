<template>
  <div class="wb-disks-workbench13-document-reader-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import { getDocumentModelValue } from '../../utils';
import contextMenu from '../../documentReader/contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    ...windowProps,
    model: {
      type: Object,
      default () {
        return { value: getDocumentModelValue() };
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
        '# Document Reader', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-reader-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
