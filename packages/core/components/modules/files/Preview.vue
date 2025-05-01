<template>
  <div class="wb-module-files-preview">
    <ul v-if="type === 'basic'" class="basic">
      <li v-for="(value, index) in lines" :key="index">
        {{ value }}
      </li>
    </ul>
    <wb-markdown
      v-if="type === 'markdown' && typeof content === 'string'"
      :content="content" />
    <div v-if="type === 'html'" v-html="content" />
    <img
      v-if="type === 'image' && typeof content === 'string'"
      :src="content" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { unwrapString } from '../../../utils/helper';
import WbMarkdown from '../../atoms/Markdown.vue';
import useWindow from '../../../composables/useWindow';
import useCore from '../../../composables/useCore';

const { core } = useCore();

const $props = defineProps<{
  type: 'basic' | 'markdown' | 'html' | 'image';
  content: string | string[];
}>();

useWindow();
const lines = ref<string[]>([]);

onMounted(() => {
  if ($props.type === 'basic') {
    window.requestAnimationFrame(() => {
      lines.value = [];
      core.value?.modules.parser?.parseBasic(
        $props.content,
        async (value, options) => {
          const parsedValue = await core.value?.executeCommand(value, options);
          if (options.message !== undefined) {
            lines.value.push(unwrapString(String(options.message)));
          }
          return parsedValue;
        }
      );
    });
  }
});
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
