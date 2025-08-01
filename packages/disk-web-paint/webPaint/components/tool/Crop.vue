<template>
  <placement :current-tool="currentTool">
    <template #navigation>
      <button @click="onClickCut">
        <svg-cut />
      </button>
      <button @click="onClickCopy">
        <svg-copy />
      </button>
    </template>
  </placement>
</template>

<script lang="ts" setup>
import SvgCut from '../../assets/svg/crop/cut.svg?component';
import SvgCopy from '../../assets/svg/crop/copy.svg?component';

import Placement from './Placement.vue';
import type Tool from '../../lib/classes/Tool';
import { computed } from 'vue';
import type Crop from '../../lib/classes/tool/interaction/Crop';

const $props = defineProps<{
  currentTool?: Tool;
}>();

const currentTool = computed(() => $props.currentTool as Crop);

function onClickCut() {
  currentTool.value.onClickCut(currentTool.value.currentEvent);
}

function onClickCopy() {
  currentTool.value.onClickCopy(currentTool.value.currentEvent);
}
</script>
