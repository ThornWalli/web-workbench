<template>
  <div>
    <component :is="coreComponent" v-if="ready" class="core" :core="core" />
  </div>
</template>

<script>

export default {
  data () {
    return {
      ready: false,
      core: null,
      coreComponent: null,
      error: null
    };
  },
  mounted () {
    this.setup();
  },
  methods: {
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

