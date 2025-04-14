<template>
  <page :start-command="startCommand" />
</template>

<script setup lang="ts">
import { ref, useHead } from '#imports';
import Page from '@/components/Page.vue';

const startCommand = ref(['execute "Disclaimer.md"']);

useHead({
  title: 'Disclaimer'
});
</script>
