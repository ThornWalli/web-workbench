<template>
  <div class="wb-disks-extras13-web-painting-info">
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

  props: {
    model: {
      type: Object,
      default () {
        return { };
      }
    }
  },

  data () {
    return {
      content: [
        '# WebPainting', 'Version: **1.0**  \nCreated by **Thorn-Welf Walli**'
      ].join('\n')
    };
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-info {
  min-width: 240px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
