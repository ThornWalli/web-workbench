<template>
  <page :start-commands="startCommand" />
</template>

<script lang="ts" setup>
import { ref, useHead } from '#imports';
import Page from '@/components/Page.vue';

// const startCommand = ref('execute "DF2:FormFields.info"');
// const startCommand = ref('execute "DF3:Tests.info"');
const startCommand = ref([
  // 'execute "DF0:Clock.app"'
  // 'execute "DF0:Calculator.app"'
  // 'execute "DF0:Cloud.app"'
  // 'execute "DF0:DocumentEditor.app"'
  'execute "DF0:DocumentReader.app"'

  // 'execute "DF2:FormFields.info"'
  // 'openDir "RAM:"'

  // 'execute "DF1:Synthesizer.app"'
  // 'executeFile "DF1:WebPainting.app"'
  // 'executeFile "DF1:WebBasic.app"'

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
