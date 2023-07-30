<template>
  <div>
    <slot />
  </div>
</template>

<script setup>

import amigaTopaz13Font from 'assets/fonts/Amiga-Topaz-13/Amiga-Topaz-13.woff2';
import amigaTopaz13ConsoleFont from 'assets/fonts/Amiga-Topaz-13-Console/Amiga-Topaz-13-Console.woff2';
import { useHead } from '#imports';

useHead({
  link: [
    {
      rel: 'shortcut icon',
      type: 'image/png',
      href: '/favicon.png'
    },
    {
      key: 'preload-amiga-topaz-13',
      rel: 'preload',
      as: 'font',
      href: amigaTopaz13Font,
      type: 'font/woff2'
    }, {
      key: 'preload-amiga-topaz-13-console',
      rel: 'preload',
      as: 'font',
      href: amigaTopaz13ConsoleFont,
      type: 'font/woff2'
    }
  ]
});

</script>
