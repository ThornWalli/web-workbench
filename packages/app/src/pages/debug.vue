
<template>
  <page :start-command="startCommand" />
</template>

<script setup>

import { ref, useHead } from '#imports';
import Page from '@/components/Page';

// const startCommand = ref('execute "DF2:FormFields.info"');
// const startCommand = ref('execute "DF3:Tests.info"');
const startCommand = ref([
  // 'execute "DF2:FormFields.info"'
  // 'execute "DF0:Clock.app"',
  // 'openDir "RAM:"'

  // 'execute "DF1:Synthesizer.app"'
  // 'executeFile "DF1:WebPainting.app"'
  'executeFile "DF1:WebBasic.app"'

  // 'execute "DF0:Clock.app"',
  // 'execute "DF0:DocumentEditor.app"'

  // 'executeFile "DF0:Editor.app"'
  // 'executeFile "DF0:ColorSettings.app"'
  // 'openSettings'
  // 'executeFile "DF0:DocumentReader.app"'
  // 'executeFile "DF2:Tests.app"'

]);

useHead({
  title: 'Debug'
});

</script>

