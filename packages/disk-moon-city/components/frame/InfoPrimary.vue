<template>
  <div class="mc-frame-info-primary">
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped>
.mc-frame-info-primary {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/info-content-1.png');
  background-size: contain;
}
</style>
