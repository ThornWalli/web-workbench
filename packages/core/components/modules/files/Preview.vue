<template>
  <div class="wb-module-files-preview">
    <ul v-if="type === 'basic'" class="basic">
      <li v-for="(value, index) in lines" :key="index">
        {{ value }}
      </li>
    </ul>
    <wb-markdown v-if="type === 'markdown'" :content="content" />
    <div v-if="type === 'html'" v-html="content" />
    <img v-if="type === 'image'" :src="content" />
  </div>
</template>

<script>
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import { cleanString } from '../../../utils/helper';
import WbMarkdown from '../../atoms/Markdown';

export default {
  components: {
    WbMarkdown
  },

  props: {
    ...windowProps,
    type: {
      type: String,
      default: null
    },
    content: {
      type: [String, Array],
      default: null
    }
  },

  emits: [...windowEmits],

  setup(props, context) {
    return useWindow(props, context);
  },

  data() {
    return {
      lines: []
    };
  },
  mounted() {
    if (this.type === 'basic') {
      window.requestAnimationFrame(() => {
        this.lines = [];
        this.core.modules.parser.parseBasic(
          this.content,
          async (value, options) => {
            const parsedValue = await this.core.executeCommand(value, options);
            if (options.message) {
              this.lines.push(cleanString(options.message));
            }
            return parsedValue;
          }
        );
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
