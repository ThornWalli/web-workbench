<template>
  <div class="wb-module-core-info">
    <element-markdown :content="content" />
  </div>
</template>

<script lang="ts" setup>
import ElementMarkdown from '../../elements/Markdown.vue';
import { computed, useNuxtApp } from '#imports';
import useWindow from '../../../composables/useWindow';
import useCore from '../../../composables/useCore';
import { ref } from 'vue';

useWindow();

const { core } = useCore();
const versions = ref(useNuxtApp().versions);

const content = computed(() => {
  return [
    '# Web-Workbench 1.3',
    [
      '<nobr>Created by Thorn-Welf Walli</nobr>',
      'Email: lammpee@gmail.com',
      'Homepage: [lammpee.de](https://lammpee.de)',
      'GitHub: [ThornWalli](https://github.com/ThornWalli)'
    ].join('  \n'),
    '',
    '',
    [
      `Version: <strong>${core.value?.version}</strong>`,
      `Nuxt: <strong>${versions.value?.nuxt}</strong>`,
      `Vue: <strong>${versions.value.vue}</strong>`
    ].join('  \n')
  ].join('\n');
});
</script>

<style lang="postcss" scoped>
.wb-module-core-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
