<template>
  <div class="wb-disks-extras13-web-basic">
    <element-input-text
      ref="inputEl"
      :model-value="model.value.content"
      @update:model-value="onUpdateModelValue"
      @refresh="onRefreshInputText" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, watch, ref, onMounted } from 'vue';
import ElementInputText from '@web-workbench/core/components/elements/InputText.vue';
import { CONFIG_NAME } from '../types';
import type { Model } from '../types';
import useCore from '@web-workbench/core/composables/useCore';
import useWindow from '@web-workbench/core/composables/useWindow';
import useScrollContent from '@web-workbench/core/composables/useScrollContent';

const inputEl = ref<InstanceType<typeof ElementInputText> | null>(null);

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();
const { parentFocused } = useWindow();

watch(
  () => parentFocused.value,
  value => {
    if (value) {
      inputEl.value.focus();
    }
  }
);

const showPreview = computed<boolean>(() => {
  return Boolean(
    core.value?.config.observable[CONFIG_NAME.WEB_BASIC_SHOW_PREVIEW] || false
  );
});

watch(
  () => $props.model.value,
  () => {
    refresh();
  }
);

watch(
  () => showPreview.value,
  value => {
    $props.model.actions?.togglePreview(value);
  }
);

onMounted(() => {
  if (showPreview.value) {
    nextTick(() => {
      $props.model.actions?.togglePreview();
    });
  }
  if (parentFocused.value) {
    inputEl.value.focus();
  }
});

function onUpdateModelValue(value: string) {
  $props.model.actions.setContent(value);
}
function onRefreshInputText() {
  refresh();
}

const { refresh: refreshScrollContent } = useScrollContent();

let timeout;
function refresh() {
  window.clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    refreshScrollContent();
  }, 250);
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic {
  /* empty */
}
</style>
