<template>
  <div class="mc-frame-info-secondary">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.mc-frame-info-secondary {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  background: url('../../assets/graphics/layout/info-content-2.png');
  background-size: contain;
}
</style>
