<template>
  <div class="wb-disks-workbench13-clock-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';
import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../clock/contextMenu';

export default {

  components: {
    AtomMarkdown
  },

  props: { ...windowProps },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu);
    return windowContext;
  },

  data () {
    return {
      content: [
        '# Clock', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }

};

</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-clock-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
