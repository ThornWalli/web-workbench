<template>
  <div class="wb-disks-workbench13-cloud-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../contextMenu';

export default {
  components: {
    AtomMarkdown
  },

  setup() {
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu);
    return windowContext;
  },

  data() {
    return {
      content: [
        '# Cloud',
        'Connect to a Firebase storage.  \n',
        'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-cloud-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
