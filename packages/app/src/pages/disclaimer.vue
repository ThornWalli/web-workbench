<template>
  <page :start-command="startCommand" />
</template>

<script setup>
import { ref, useHead } from '#imports';
import Page from '@/components/Page';

const startCommand = ref('execute "Disclaimer.md"');

useHead({
  title: 'Disclaimer'
});
</script>
