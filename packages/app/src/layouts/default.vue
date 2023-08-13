<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import useFonts from '@web-workbench/core/composables/useFonts';
import { useHead } from '#imports';

useFonts();

useHead({
  link: [
    {
      rel: 'shortcut icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
});
</script>
