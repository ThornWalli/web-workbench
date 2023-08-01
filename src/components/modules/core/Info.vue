<template>
  <div class="wb-module-core-info">
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
      content: `# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: [lammpee.de](https://lammpee.de)<br><br>Version: ${this.core.version}`
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-core-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
