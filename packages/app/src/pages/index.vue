<template>
  <div>
    <page :start-commands="startCommands" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute, ref } from '#imports';
import Page from '@/components/Page.vue';

const route = useRoute();

const startCommands = ref(
  [String(route.query['start-command'])].filter(Boolean)
);
</script>
