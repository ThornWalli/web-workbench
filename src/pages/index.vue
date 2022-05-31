<template>
  <div>
    <component :is="coreComponent" v-if="ready && !error" class="core" :core="core" @ready="onReady" />
    <wb-env-error v-if="error" v-bind="error" />
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
      ready: false,
      core: null,
      coreComponent: null,
      error: null,
      startCommand: null
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
    } else if (!this.isWebKit()) {
      this.error = {
        input: 'No interaction available.',
        text: 'Use a latest version of a Webkit browser (e.g. Chrome).',
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
    isWebKit () {
      return !global.navigator.userAgent.includes('Firefox/') || 'fromEntries' in Object;
    },
    isLighthouse () {
      return /(Speed Insights)|(Chrome-Lighthouse)/.test(window.navigator.userAgent);
    },
    async setup () {
      this.coreComponent = await import('@/components/environments/Core').then(module => module.default);
      this.core = await import('@/web-workbench').then(module => module.default);
      this.ready = true;
    },

    onReady () {
      if (this.startCommand) {
        this.core.executeCommand(this.startCommand);
      }
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

