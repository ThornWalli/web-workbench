<template>
  <wb-components-console
    :show-introduction="false"
    :delimiter-prefix="null"
    :start-commands="command"
    :core="core"
    class="wb-module-core-web-dos"
    :pre-rows="rows"
    @start-commands-complete="onStartCommandsComplete" />
</template>

<script>
import WbComponentsConsole from '../../Console';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    WbComponentsConsole
  },

  props: {
    command: {
      type: String,
      default: null
    }
  },

  emits: ['close'],

  setup() {
    return useWindow();
  },

  data() {
    return {
      startCommands: [],
      rows: [
        `Make by Lammpee ${new Date().getFullYear()}`,
        `Release ${this.core.version}`
      ]
    };
  },

  methods: {
    onStartCommandsComplete() {
      window.setTimeout(
        () => {
          this.$emit('close');
        },
        1000 * (2 + Math.floor(Math.random() * 3))
      );
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-core-web-dos {
  min-width: 320px;
}
</style>
