
<template>
  <page :start-command="startCommand" />
</template>

<script setup>

import { ref, useHead } from '#imports';
import Page from '@/components/Page';

// const startCommand = ref('execute "DF2:FormFields.info"');
const startCommand = ref('execute "DF3:Tests.info"');

useHead({
  title: 'Debug'
});

</script>

