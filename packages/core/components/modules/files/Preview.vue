<template>
  <div class="wb-module-files-preview">
    <div v-if="preparedType === 'json'" class="json">
      <pre>{{ content }}</pre>
    </div>
    <div v-else-if="preparedType === 'basic'" class="basic">
      <ul>
        <li v-for="(value, index) in lines" :key="index">
          {{ value }}
        </li>
      </ul>
    </div>
    <div
      v-else-if="preparedType === 'markdown' && typeof content === 'string'"
      class="markdown">
      <wb-markdown :content="content" />
    </div>
    <div v-else-if="type === 'html'" class="html">
      <div v-html="content" />
    </div>
    <div
      v-else-if="preparedType === 'image' && typeof content === 'string'"
      class="image">
      <img :src="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { unwrapString } from '../../../utils/helper';
import WbMarkdown from '../../elements/Markdown.vue';
import useWindow from '../../../composables/useWindow';
import useCore from '../../../composables/useCore';
import { OUTPUT_TYPE } from '@web-workbench/core/modules/Files/types';

const { core } = useCore();

const $props = defineProps<{
  type: OUTPUT_TYPE;
  content: string | string[];
}>();

useWindow();
const lines = ref<string[]>([]);

onMounted(() => {
  if ($props.type === OUTPUT_TYPE.BASIC) {
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
  --background: var(--color-core-files-preview-background, #fff);

  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;

  & > div {
    flex: 1;
    width: 100%;
    overflow: auto;
  }

  & .basic {
    & ul {
      & li {
        white-space: nowrap;
      }
    }
  }

  & .json {
    & pre {
      margin: 0;
    }
  }

  & .image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../../../assets/img/grid.png');
    background-color: #fff;

    & img {
      max-width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: pixelated;
    }
  }
}
</style>
