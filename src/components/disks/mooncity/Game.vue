<template>
  <div class="wb-disks-mooncity-game">
    <!-- <mc-atom-progress-bar /> -->
    <!-- <mc-atom-error-message /> -->
    <mc-molecule-header v-bind="header" />

    <!-- <div class="game__background-left" />
    <div class="game__background-right" /> -->
    <mc-view-router />
    <mc-molecule-navigation class="game__navigation" @navigationItem="onChangeNavigationItem" />

    <mc-atom-button class="game__overview-button" style-type="main-button" :label="null" @click="onClickMainButton" />
  </div>
</template>

<script>

import '@/assets/css/mooncity.pcss';

// import McAtomProgressBar from './atoms/ProgressBar';
// import McAtomErrorMessage from './atoms/ErrorMessage';
import Vue from 'vue';
import VueRouter from 'vue-router';
import MoonCity from '../../../web-workbench/disks/mooncity/lib/classes/Game';
import { formatNumber } from '../../../web-workbench/disks/mooncity/lib/utils';
import soundPlayer, { NAMES as TRACK_NAMES } from '../../../web-workbench/disks/mooncity/lib/service/soundPlayer';
import McViewRouter from './ViewRouter';
import McAtomButton from './atoms/Button';
import McMoleculeHeader from './molecules/Header';
import McMoleculeNavigation from './molecules/Navigation';

Vue.use(VueRouter);
Vue.use({
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        if ('mooncity' in this.$options) {
          this._mooncityRoot = this;
          this._mooncity = this.$options.mooncity;
        } else {
          this._mooncityRoot = (this.$parent && this.$parent._mooncityRoot) || this;
        }
      }
    });

    Object.defineProperty(Vue.prototype, '$mooncity', {
      get () { return this._mooncityRoot._mooncity; }
    });
  }
});

export default {
  mooncity: new MoonCity(),
  router: getRouter(),
  components: {
    // McAtomProgressBar, McAtomErrorMessage
    McViewRouter, McAtomButton, McMoleculeHeader, McMoleculeNavigation
  },
  computed: {
    header () {
      return {
        name: this.$mooncity.currentUser.name,
        credits: formatNumber(this.$mooncity.currentUser.credits, 8),
        date: this.$mooncity.currentDate,
        round: formatNumber(this.$mooncity.currentRound, 3)
      };
    }
  },
  created () {
    this.debug();
  },
  mounted () {
    console.log(this);
  },
  methods: {
    changeView (path, silent) {
      this.$router.push(path);
      if (!silent) {
        soundPlayer.play(TRACK_NAMES.ITEM_CLICK);
      }
    },
    onClickMainButton () {
      this.changeView('/');
    },
    onChangeNavigationItem (path) {
      soundPlayer.play(TRACK_NAMES.ITEM_CLICK);
    },
    debug () {
      this.$mooncity.start([
        'Player 1',
        'Player 2',
        'Player 3',
        'Player 4'
      ]);
      this.changeView('/shop', true);
    }
  }
};

function getRouter () {
  const routes = [
    {
      path: '/',
      component: () => import('./views/Main')
    },
    {
      path: '/shop',
      component: () => import('./views/Shop')
    },
    {
      path: '/city',
      component: () => import('./views/City')
    },
    {
      path: '/stats',
      component: () => import('./views/Stats')
    },
    {
      path: '/weapon',
      component: () => import('./views/Weapon')
    }
  ];
  return new VueRouter({ mode: 'abstract', routes });
}

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
  background-image: url('~assets/disks/mooncity/img/mask.png');

  & .game__overview-button {
    position: absolute;
    top: 0;
    right: 0;
  }

  & * {
    font-family: "BitFont", sans-serif;
    cursor: url("~assets/disks/mooncity/img/cursor/pointer.png"), auto;
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
