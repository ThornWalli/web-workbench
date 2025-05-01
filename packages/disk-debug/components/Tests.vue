<template>
  <div class="wb-disks-debug-tests">
    <div>
      !"\#$%&'()*+,-./0123456789:;&lt;=&gt;?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»…ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.wb-disks-debug-tests {
  min-width: 380px;
  height: 100%;

  & .slider {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & > * {
      width: 120px;
      height: 120px;
    }
  }

  & .splitter {
    display: flex;
    height: 100%;

    & > div {
      position: relative;
      flex: 1;
      height: 100%;
    }
  }
}
</style>
