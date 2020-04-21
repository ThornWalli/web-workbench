<template>
  <div class="wb-module-files-preview">
    <ul v-if="type === 'basic'" class="basic">
      <li v-for="(value, index) in content" :key="index">
        {{ value }}
      </li>
    </ul>
    <wb-markdown v-if="type === 'markdown'" :content="content" />
    <div v-if="type === 'html'" v-html="content" />
  </div>
</template>

<script>

import WbMarkdown from '@/components/environments/atoms/Markdown';

import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    WbMarkdown
  },
  mixins: [
    MixinWindowComponent
  ],
  props: {
    type: {
      type: String,
      default: null
    },
    content: {
      type: [
        String, Array
      ],
      default: null
    }
  }
};
</script>

<style lang="postcss">
.wb-module-files-preview {
  padding: var(--default-element-margin);

  & ul.basic {
    & li {
      white-space: nowrap;
    }
  }
}
</style>
