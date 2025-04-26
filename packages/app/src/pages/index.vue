<template>
  <div>
    <page :start-command="startCommand" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute, ref } from '#imports';
import Page from '@/components/Page.vue';

const route = useRoute();

const startCommand = ref(
  [String(route.query['start-command'])].filter(Boolean)
);
</script>
