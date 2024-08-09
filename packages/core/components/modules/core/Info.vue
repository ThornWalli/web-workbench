<template>
  <div class="wb-module-core-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import AtomMarkdown from '../../atoms/Markdown';
import { useNuxtApp } from '#imports';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomMarkdown
  },

  setup() {
    const versions = useNuxtApp().versions;
    return {
      ...useWindow(),
      versions
    };
  },

  data() {
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
