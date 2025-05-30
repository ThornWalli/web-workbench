<template>
  <div class="wb-module-files-preview">
    <pre v-if="preparedType === 'json'">{{ content }}</pre>
    <ul v-else-if="preparedType === 'basic'" class="basic">
      <li v-for="(value, index) in lines" :key="index">
        {{ value }}
      </li>
    </ul>
    <wb-markdown
      v-else-if="preparedType === 'markdown' && typeof content === 'string'"
      :content="content" />
    <div v-else-if="type === 'html'" v-html="content" />
    <img
      v-else-if="preparedType === 'image' && typeof content === 'string'"
      :src="content" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { unwrapString } from '../../../utils/helper';
import WbMarkdown from '../../elements/Markdown.vue';
import useWindow from '../../../composables/useWindow';
import useCore from '../../../composables/useCore';

const { core } = useCore();

const $props = defineProps<{
  type: 'json' | 'basic' | 'markdown' | 'html' | 'image';
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

const preparedType = computed(() => $props.type.toLowerCase());
</script>

<style lang="postcss" scoped>
.wb-module-files-preview {
  padding: var(--default-element-margin);

  & ul.basic {
    & li {
      white-space: nowrap;
    }
  }

  & pre {
    margin: 0;
  }
}
</style>
