
<template>
  <page :start-command="startCommand" />
</template>

<script setup>

import { ref, useHead } from '#imports';
import Page from '@/components/Page';

const startCommand = ref('execute "Imprint.md"');

useHead({
  title: 'Imprint'
});

</script>

