<template>
  <div class="wb-disks-extras13-web-basic-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomMarkdown
  },

  props: {
    ...windowProps
  },
  emits: [
    ...windowEmits
  ],

  setup (props, context) {
    return useWindow(props, context);
  },

  data () {
    return {
      content: [
        '# WebBasic', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
