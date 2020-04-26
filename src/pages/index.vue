<template>
  <div>
    <component :is="coreComponent" v-if="ready" class="core" :core="core" />
  </div>
</template>

<script>

// import WbEnvCore from '@/components/environments/Core';

export default {
  components: {
    // WbEnvCore
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
      coreComponent: null
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

