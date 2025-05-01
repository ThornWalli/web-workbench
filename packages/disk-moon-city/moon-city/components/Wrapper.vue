<template>
  <div class="wb-disk-moon-city">Moon City</div>
</template>

<script setup>
import useWindow from '@web-workbench/core/composables/useWindow';

import useFonts from '@web-workbench/core/composables/useFonts';
import BitFont from '../assets/graphics/fonts/BitFont/BitFont.woff';

useWindow();

const { registerFont } = useFonts();

registerFont([
  {
    fontFamily: 'BitFont',
    fontVariant: 'normal',
    fontFeatureSettings: 'normal',
    fontStretch: 'normal',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
    src: [BitFont, 'woff']
  }
]);
</script>

<style lang="postcss" scoped>
.wb-disk-moon-city {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 640px;
  height: 400px;
}
</style>
