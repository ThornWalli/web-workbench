<template>
  <div class="mc-frame-overview-primary">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.mc-frame-overview-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/overview-content-1-1.png');
  background-size: contain;
}
</style>
