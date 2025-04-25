<template>
  <page :start-command="startCommand" />
</template>

<script lang="ts" setup>
import { ref, useHead } from '#imports';
import Page from '@/components/Page.vue';

const startCommand = ref(['execute "Disclaimer.md"']);

useHead({
  title: 'Disclaimer'
});
</script>
