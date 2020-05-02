<template>
  <div class="wb-disks-mooncity-game">
    <!-- <mc-atom-progress-bar /> -->
    <!-- <mc-atom-error-message /> -->
    <mc-molecule-header />

    <div class="game__background-left" />
    <div class="game__background-right" />
    <mc-view-router />
    <mc-molecule-navigation class="game__navigation" />
  </div>
</template>

<script>

import '@/assets/css/mooncity.pcss';

// import McAtomProgressBar from './atoms/ProgressBar';
// import McAtomErrorMessage from './atoms/ErrorMessage';
import Vue from 'vue';
import VueRouter from 'vue-router';
import McViewRouter from './ViewRouter';
import McMoleculeHeader from './molecules/Header';
import McMoleculeNavigation from './molecules/Navigation';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('./views/Overview')
  }
];
const router = new VueRouter({ mode: 'abstract', routes });
router.replace('/');

export default {
  router,
  components: {
    // McAtomProgressBar, McAtomErrorMessage
    McViewRouter, McMoleculeHeader, McMoleculeNavigation
  }
};
</script>

<style lang="postcss">

.wb-disks-mooncity-game {
  position: relative;
  width: 640px;
  height: 400px;
  margin: 0 auto;
  font-size: 10px;
  line-height: 8px;
  letter-spacing: 0.3px;
  background-image: url('~assets/img/disks/mooncity/mask.png');

  & * {
    font-family: "BitFont", sans-serif;
  }

  & .game__navigation {
    position: absolute;
    right: 0;
    bottom: 0;
  }

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
