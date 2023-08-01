<template>
  <div class="wb-disks-extras13-web-basic-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import AtomMarkdown from '@/components/environments/atoms/Markdown';

import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';

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
