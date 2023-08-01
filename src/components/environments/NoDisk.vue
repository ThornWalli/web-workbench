<template>
  <div class="wb-env-no-disk">
    <svg-no-disk />
  </div>
</template>

<script setup>
import SvgNoDisk from '@/assets/svg/no_disk.svg?component';
</script>

<style lang="postcss" scoped>
.wb-env-no-disk {
  --width: 260px;
  --height: 262px;
  --color-no-disk-background: #fff;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  user-select: none;
  background: var(--color-no-disk-background);

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
