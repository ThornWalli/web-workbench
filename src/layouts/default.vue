<template>
  <div>
    <nuxt v-if="!error" />
    <wb-env-error v-if="error" v-bind="error" @close="onClickError" />
  </div>
</template>

<script>

import WbEnvError from '@/components/environments/Error';

export default {
  components: {
    WbEnvError
  },
  data () {
    return {
      error: null
    };
  },
  created () {
    if (process.server) {
      return;
    }
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
  methods: {
    isFirefox () {
      return global.navigator.userAgent.includes('Firefox/');
    },
    isLighthouse () {
      return new RegExp('(Speed Insights)|(Chrome-Lighthouse)').test(window.navigator.userAgent);
    }
  }
};

</script>
