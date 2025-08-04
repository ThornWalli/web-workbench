<template>
  <div class="wb-disks-extras13-web-basic">
    <element-input-text
      ref="input"
      :override-focused="parentFocused || false"
      :model-value="model.value.content"
      @update:model-value="onUpdateModelValue"
      @refresh="onRefreshInputText" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, watch, ref, onMounted } from 'vue';
import ElementInputText from '@web-workbench/core/components/elements/InputText.vue';

import type { TriggerRefresh } from '@web-workbench/core/types/component';
import { CONFIG_NAME } from '../types';
import type { Model } from '../types';
import useCore from '@web-workbench/core/composables/useCore';
import useWindow from '@web-workbench/core/composables/useWindow';

const inputEl = ref<InstanceType<typeof ElementInputText> | null>(null);
const $emit = defineEmits<{
  (e: 'refresh', value: TriggerRefresh): void;
}>();

const $props = defineProps<{
  model: Model;
}>();

const { core } = useCore();
const { parentFocused } = useWindow();

const openValue = computed(() => {
  return $props.model.value.content;
});
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
  () => openValue.value,
  value => {
    if (value) {
      $props.model.actions.setContent(value);
      nextTick(() => {
        inputEl.value?.resetSelection();
        $emit('refresh', { scroll: true });
      });
    }
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
});

function onUpdateModelValue(value: string) {
  $props.model.actions.setContent(value);
}
function onRefreshInputText() {
  refresh();
}
function refresh() {
  nextTick(() => {
    $emit('refresh', { scroll: true });
  });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic {
  /* empty */
}
</style>
