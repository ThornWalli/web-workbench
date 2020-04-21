<template>
  <div class="wb-module-core-info">
    <atom-markdown :content="content" />
  </div>
</template>

<script>

import AtomMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    AtomMarkdown
  },
  mixins: [
    MixinWindowComponent
  ],

  data () {
    return {
      content: '# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: lammpee.de<br><br>Version: 0.0.1 ALPHA'
    };
  }
};
</script>

<style lang="postcss">
.wb-module-core-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
