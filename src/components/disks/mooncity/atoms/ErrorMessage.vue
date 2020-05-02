<template>
  <div class="wb-disks-mooncity-gam-error-message">
    <div />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="postcss">
.wb-disks-mooncity-gam-error-message {
  position: absolute;
  top: 186px;
  left: 305px;
  z-index: 200;
  display: none;
  width: 320px;
  color: #ce0000;
  background: #212031;
  border: solid #313131 2px;
  border-right-width: 0;
  border-left-width: 0;

  > div {
    padding: 4px 2px;

    > .dialog {
      position: absolute;
      z-index: 100;
      width: 100%;
      height: 100%;
      vertical-align: middle;
      background: #000;
    }
  }

}
</style>
