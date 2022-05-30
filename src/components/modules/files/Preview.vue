<template>
  <div class="wb-module-files-preview">
    <ul v-if="type === 'basic'" class="basic">
      <li v-for="(value, index) in lines" :key="index">
        {{ value }}
      </li>
    </ul>
    <wb-markdown v-if="type === 'markdown'" :content="content" />
    <div v-if="type === 'html'" v-html="content" />
    <img v-if="type === 'image'" :src="content">
  </div>
</template>

<script>

import { cleanString } from '../../../web-workbench/utils/helper';
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
  },
  data () {
    return {
      lines: []
    };
  },
  mounted () {
    if (this.type === 'basic') {
      global.requestAnimationFrame(() => {
        this.lines = [];
        this.core.modules.parser.parseBasic(this.content, async (value, options) => {
          const parsedValue = await this.core.executeCommand(value, options);
          if (options.message) {
            this.lines.push(cleanString(options.message));
          }
          return parsedValue;
        });
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-files-preview {
  padding: var(--default-element-margin);

  & ul.basic {
    & li {
      white-space: nowrap;
    }
  }
}
</style>
