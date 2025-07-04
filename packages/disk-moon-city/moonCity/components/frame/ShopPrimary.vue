<template>
  <div class="mc-frame-shop-primary">
    <div class="content-1">
      <slot name="content-1" />
    </div>
    <div class="content-2">
      <slot name="content-2" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.mc-frame-shop-primary {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../../assets/graphics/layout/shop-content-1.png');
  background-size: contain;

  & .content-1 {
    position: absolute;
    top: 6px;
    right: 0;
    left: 2px;
    padding: 8px 10px;
    padding-bottom: 10px;
  }

  & .content-2 {
    position: absolute;
    top: 156px;
    right: 0;
    left: 2px;
    padding: 8px 10px;
    padding-bottom: 10px;
  }
}
</style>
