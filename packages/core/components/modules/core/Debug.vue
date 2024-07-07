<template>
  <div class="wb-module-core-debug">
    Has selected Items: {{ symbolsModule.hasSelectedItems }}<br />
    {{ symbolsModule.getSelectedItems().map(item => item.id) }}
  </div>
</template>

<script>
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {},

  setup() {
    return useWindow();
  },

  data() {
    return {
      content:
        '# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: lammpee.de<br><br>Version: 0.0.1 ALPHA',
      symbolsModule: this.core.modules.symbols
    };
  }
};
</script>

<style lang="postcss" scoped>
.wb-module-core-debug {
  width: 400px;
  padding: 5px;
}
</style>
