<template>
  <wb-components-console
    :show-introduction="false"
    :delimiter-prefix="null"
    :start-commands="command"
    :core="core"
    class="wb-module-core-web-dos"
    :pre-rows="rows"
    @startCommandsComplete="onStartCommandsComplete"
  />
</template>

<script>

import WbComponentsConsole from '@/components/environments/Console';
import MixinWindowComponent from '@/components/mixins/WindowComponent';

export default {
  components: {
    WbComponentsConsole
  },
  mixins: [
    MixinWindowComponent
  ],

  props: {
    core: {
      type: Object,
      required: true
    },
    command: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      startCommands: [],
      rows: [
              `Make by Lammpee ${new Date().getFullYear()}`,
              'Release 1.3',
              'Web-Workbench Disk. Release 1.3.0'
      ]

    };
  },
  // watch: {
  //   async console (console) {
  //     if (console) {
  //       const commands = [].concat(this.rows);
  //       const run = (commands) => {
  //         debugger;
  //         return console.enter(commands.shift(), {
  //           showCommand: false
  //         }).then(() => {
  //           if (commands.length > 0) {
  //             return run(commands);
  //           }
  //           return null;
  //         });
  //       };
  //       await run(commands);
  //     }
  //   }
  // },
  methods: {
    onStartCommandsComplete () {
      global.setTimeout(() => {
        this.$emit('close');
      }, 1000 * (2 + Math.floor(Math.random() * 3)));
    }
  }

};
</script>

<style lang="postcss">
.wb-module-core-web-dos {
  min-width: 320px;
}
</style>
