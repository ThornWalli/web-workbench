<template>
  <div class="wb-env-no-disk">
    <svg-no-disk />
  </div>
</template>

<script>
import SvgNoDisk from '@/assets/svg/no_disk.svg?vue-template';
export default {
  components: { SvgNoDisk }
};
</script>

<style lang="postcss">
.wb-env-no-disk {
  --width: 260px;
  --height: 262px;
  --color__noDisk__background: #fff;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  user-select: none;
  background: var(--color__noDisk__background);

  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
