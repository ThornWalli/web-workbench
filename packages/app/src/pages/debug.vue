
<template>
  <page :start-command="startCommand" />
</template>

<script setup>

import { ref, useHead } from '#imports';
import Page from '@/components/Page';

// const startCommand = ref('execute "DF2:FormFields.info"');
// const startCommand = ref('execute "DF3:Tests.info"');
const startCommand = ref('execute "DF0:Clock.app"');

useHead({
  title: 'Debug'
});

</script>

