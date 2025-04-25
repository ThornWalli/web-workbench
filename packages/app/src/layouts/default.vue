<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#imports';

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
