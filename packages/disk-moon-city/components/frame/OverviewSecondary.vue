<template>
  <div class="mc-frame-overview-secondary">
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped>
.mc-frame-overview-secondary {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  background: url('../../assets/graphics/layout/overview-content-2.png');
  background-size: contain;
}
</style>
