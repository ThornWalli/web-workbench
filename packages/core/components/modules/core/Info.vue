<template>
  <div class="wb-module-core-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';
import AtomMarkdown from '../../atoms/Markdown';
import { useNuxtApp } from '#imports';

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
    const versions = useNuxtApp().versions;
    return {
      ...useWindow(props, context),
      versions
    };
  },

  data () {
    return {
      content: `# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: [lammpee.de](https://lammpee.de)<br><br>Version: <strong>${this.core.version}</strong><br>Nuxt: <strong>${this.versions.nuxt}</strong><br>Vue: <strong>${this.versions.vue}</strong>`
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
