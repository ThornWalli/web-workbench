<template>
  <div ref="rootEl" class="wb-disks-extras13-guest-book-main">
    <app
      v-bind="{
        model,
        introContent,
        listContent
      }" />
  </div>
</template>

<script lang="ts" setup>
import useWindow from '@web-workbench/core/composables/useWindow';
import contextMenu from '../../contextMenu';
import type { Model } from '../../types';
import App from '../App.vue';

const $props = defineProps<{
  model: Model;
  introContent: string;
  listContent: string;
}>();

const { setContextMenu } = useWindow();
setContextMenu(contextMenu, { model: $props.model });
</script>
