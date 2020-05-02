<template>
  <div class="wb-disks-mooncity-game">
    <mc-atom-progress-bar />
    <mc-atom-error-message />
    <mc-molecule-header />

    <div class="game__background-left" />
    <div class="game__background-right" />

    <div class="game__content">
      controllers
    </div>
  </div>
</template>

<script>

import McAtomProgressBar from './atoms/ProgressBar';
import McAtomErrorMessage from './atoms/ErrorMessage';
import McMoleculeHeader from './molecules/Header';

export default {
  components: { McAtomProgressBar, McAtomErrorMessage, McMoleculeHeader }
};
</script>

<style lang="postcss">

.wb-disks-mooncity-game {
  width: 640px;
  height: 400px;
  margin: 0 auto;

  & * {
    font-family: "BitFont", sans-serif;
  }

  border: solid red 1px;

  & .game__background-left {
    position: absolute;
    top: 26px;
    left: 0;
    width: 288px;
    height: 374px;
  }

  & .game__background-right {
    position: absolute;
    top: 26px;
    left: 288px;
    width: 352px;
    height: 374px;
  }

}

</style>
