<template>
  <div>
    <component :is="coreComponent" v-if="ready" class="core" :core="core" />
    <wb-env-error v-if="error" v-bind="error" @close="onClickError" />
  </div>
</template>

<script>

// import WbEnvCore from '@/components/environments/Core';

import WbEnvError from '@/components/environments/Error';

export default {
  components: {
    WbEnvError
  },

  // fetch () {
  //   try {
  //     new RegExp('[^\\d$\\-\\w]?(?<a>([+-]?[\\w.]+e\\+\\d+)|([+-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))[ ]*(?<operator>[\\^*%\\/]|MOD|XOR|AND|OR|<<|>>|>>>)[ ]*(?<b>([-]?[\\w.]+e\\+\\d+)|([-]?[\\w$%.]+)|(^[+-]?[\\w$%.]+)|([\\w$%.]+)|([$]{3}\\d+))');
  //   } catch (error) {
  //     throw new Error('firefox');
  //   }
  // },
  data () {
    return {
      ready: false,
      core: null,
      coreComponent: null,
      error: null
    };
  },
  created () {
    if (this.isLighthouse()) {
      this.error = {
        input: 'No interaction available.',
        text: 'Not made for Lighthouse ;)',
        stack: null,
        code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
      };
    } else if (this.isFirefox()) {
      this.error = {
        input: 'No interaction available.',
        text: 'Not made for Firefox, use a Webkit browser (e.g. Chrome).',
        stack: null,
        code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
      };
    }
  },
  mounted () {
    if (!this.error) {
      this.setup();
    }
  },
  methods: {
    isFirefox () {
      return global.navigator.userAgent.includes('Firefox/');
    },
    isLighthouse () {
      return new RegExp('(Speed Insights)|(Chrome-Lighthouse)').test(window.navigator.userAgent);
    },
    async setup () {
      this.coreComponent = await import('@/components/environments/Core').then(module => module.default);
      this.core = await import('@/web-workbench').then(module => module.default);
      this.ready = true;
    },

    // Events
    onClickError () {
      // empty
    }

  }
};
</script>

<style>

.core {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}

</style>

