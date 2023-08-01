<template>
  <div class="wb-disks-workbench13-clock-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';
import AtomMarkdown from '@/components/environments/atoms/Markdown';

import contextMenu from '@/web-workbench/disks/workbench13/clock/contextMenu';

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
