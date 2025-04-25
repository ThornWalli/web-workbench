<template>
  <page :start-command="startCommand" />
</template>

<script lang="ts" setup>
import { ref, useHead } from '#imports';
import Page from '@/components/Page.vue';

const startCommand = ref(['execute "Imprint.md"']);

useHead({ title: 'Imprint' });
</script>
