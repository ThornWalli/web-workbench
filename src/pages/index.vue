<template>
  <div>
    asdasd
    <wb-env-core v-if="ready" class="core" :core="core" />
  </div>
</template>

<script>

import WbEnvCore from '@/components/environments/Core';

export default {
  components: {
    WbEnvCore
  },
  data () {
    return {
      ready: false,
      core: null
    };
  },
  mounted () {
    this.setup();
  },
  methods: {
    async setup () {
      this.core = await import('@/web-workbench').then(module => module.default);
      this.ready = true;
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

