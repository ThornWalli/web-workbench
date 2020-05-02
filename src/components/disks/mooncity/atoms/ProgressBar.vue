<template>
  <div class="wb-disks-mooncity-gam-progress-bar">
    <div class="progress">
      <div class="value" />
    </div>

    <div class="overlayer" />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="postcss">
.wb-disks-mooncity-gam-progress-bar {
  position: absolute;
  top: 183px;
  left: 146px;
  width: 348px;
  height: 34px;

  & > .overlayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('~assets/img/disks/mooncity/loading_bar.png');
  }

  & > .progress {
    position: relative;
    top: 10px;
    left: 16px;
    width: 316px;
    height: 14px;
    background: #720;

    & > .value {
      position: relative;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background: #c00;
    }

  }
}
</style>
