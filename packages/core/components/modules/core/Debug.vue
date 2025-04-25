<template>
  <div class="wb-module-core-debug">
    Has selected Items: {{ core?.modules.symbols?.hasSelectedItems || false
    }}<br />
    {{ core?.modules.symbols?.getSelectedItems().map(item => item.id) }}
  </div>
</template>

<script lang="ts" setup>
import useWindow from '@web-workbench/core/composables/useWindow';
import useCore from '@web-workbench/core/composables/useCore';

const { core } = useCore();
useWindow();
</script>

<style lang="postcss" scoped>
.wb-module-core-debug {
  width: 400px;
  padding: 5px;
}
</style>
