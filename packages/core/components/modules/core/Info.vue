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
  return `# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: [lammpee.de](https://lammpee.de)<br><br>Version: <strong>${core.value?.version}</strong><br>Nuxt: <strong>${versions.value?.nuxt}</strong><br>Vue: <strong>${versions.value.vue}</strong>`;
});
</script>

<style lang="postcss" scoped>
.wb-module-core-info {
  min-width: 320px;
  padding: calc(var(--default-element-margin) * 2);
}
</style>
