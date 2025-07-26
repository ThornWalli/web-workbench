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
    <div v-else-if="imageSrc" class="image">
      <img :src="imageSrc" />
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
import { OUTPUT_TYPE as WEB_PAINT_OUTPUT_TYPE } from '@web-workbench/disk-web-paint/webPaint';
import type { DocumentFile } from '@web-workbench/disk-web-paint/webPaint/types/document';
import { createDocumentFromDocumentFile } from '@web-workbench/disk-web-paint/webPaint/lib/utils/document';
import { getGlobalCompositeOperation } from '@web-workbench/disk-web-paint/webPaint/workers/display/utils/render';

const { core } = useCore();

const $props = defineProps<{
  type: OUTPUT_TYPE | `${WEB_PAINT_OUTPUT_TYPE}`;
  content: string | string[] | DocumentFile;
}>();

useWindow();
const lines = ref<string[]>([]);

const imageSrc = ref<string>(undefined);
if ($props.type === WEB_PAINT_OUTPUT_TYPE) {
  const webPaintDocument = await createDocumentFromDocumentFile(
    $props.content as DocumentFile
  );

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  webPaintDocument.layers.forEach((layer, index) => {
    if (index === 0) {
      const width = layer.imageBitmap.width;
      const height = layer.imageBitmap.height;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
    }
    if (layer.imageBitmap) {
      ctx.globalCompositeOperation = getGlobalCompositeOperation(
        layer.blendMode
      );
      ctx.globalAlpha = layer.opacity;
      ctx?.drawImage(layer.imageBitmap, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  });

  imageSrc.value = await canvas.toDataURL('image/png');
}

onMounted(() => {
  if ($props.type === OUTPUT_TYPE.BASIC) {
    window.requestAnimationFrame(() => {
      lines.value = [];
      core.value?.modules.parser?.parseBasic(
        $props.content as string,
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

  & .webpaint-document {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--workbench-color-3);
    background-color: var(--background);

    & img {
      max-width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: pixelated;
    }
  }
}
</style>
