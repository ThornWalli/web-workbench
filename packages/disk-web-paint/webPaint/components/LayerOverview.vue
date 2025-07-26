<template>
  <div class="wb-disks-extras13-web-paint-layer-overview">
    <div v-if="currentLayer" class="controls">
      <button :disabled="layers.length < 2" @click="onClickRemoveLayer">
        <svg-control-minus />
      </button>
      <button @click="onClickDuplicateLayer">
        <svg-control-duplicate />
      </button>
      <button @click="onClickVisibleLayer">
        <svg-control-visible v-if="currentLayer.visible" />
        <svg-control-hidden v-else />
      </button>
      <button @click="onClickAddLayer">
        <svg-control-plus />
      </button>
    </div>
    <div :key="timestamp" class="style-scrollbar">
      <div
        v-for="(layer, index) in layers"
        :key="layer.id"
        draggable="true"
        @drop="onDrop($event, dragLayer, index)"
        @dragstart="onDragStart(layer)"
        @dragend="onDragEnd"
        @dragover="onDragOver"
        @click="onClickLayer(layer)">
        <layer-overview-thumb :layer="layer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LayerOverviewThumb from './LayerOverviewThumb.vue';
import type { Model } from '../types';
import { concatMap, Subscription } from 'rxjs';
import type { LayerDescription } from '../types/layer';

import SvgControlPlus from '../assets/svg/controls/plus.svg';
import SvgControlMinus from '../assets/svg/controls/minus.svg';
import SvgControlDuplicate from '../assets/svg/controls/duplicate.svg';
import SvgControlVisible from '../assets/svg/controls/visible.svg';
import SvgControlHidden from '../assets/svg/controls/hidden.svg';

import type Core from '@web-workbench/core/classes/Core';
import useI18n from '../composables/useI18n';

const { t } = useI18n();

const $props = defineProps<{
  core: Core;
  model: Model;
}>();

const isDragging = ref(false);
function onDragStart(layer: LayerDescription) {
  isDragging.value = true;
  dragLayer.value = layer;
}

function onDragEnd() {
  isDragging.value = false;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}
const currentLayer = computed(() => {
  return $props.model.app.state.layers.find(
    l => l.id === $props.model.app.state.currentLayerId
  );
});
const dragLayer = ref<LayerDescription>();

function onDrop(event: DragEvent, layer: LayerDescription, newIndex: number) {
  event.preventDefault();
  isDragging.value = false;

  const layers = [...$props.model.app.state.layers];

  const currentLayerIndex = layers.findIndex(l => l.id === layer.id);
  if (currentLayerIndex === -1) return;
  const [movedLayer] = layers.splice(currentLayerIndex, 1);
  layers.splice(newIndex, 0, movedLayer);
  layers.forEach((l, index) => {
    l.order = index;
  });

  layers.sort((a, b) => a.order - b.order);
  $props.model.app.actions.moveLayers(layers);
}

const layers = ref([]);
const subscription = new Subscription();
const timestamp = ref(Date.now());

function onClickLayer(layer) {
  $props.model.app.actions.selectLayer(layer.id);
}

onMounted(() => {
  subscription.add(
    $props.model.app.state$
      .pipe(
        concatMap(() => {
          return $props.model.app.actions.getOverviewLayers(100);
        })
      )
      .subscribe(({ payload }) => {
        layers.value = payload.layers;
        timestamp.value = Date.now();
      })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

function onClickAddLayer() {
  $props.model.app.actions.addLayer({
    name: t('context_menu.layers.items.add.default_name'),
    dimension: $props.model.app.currentDocument?.meta.dimension
  });
}

function onClickDuplicateLayer() {
  if ($props.model.app.state.currentLayerId) {
    $props.model.app.actions.duplicateLayer(
      $props.model.app.state.currentLayerId
    );
  }
}

function onClickVisibleLayer() {
  if (currentLayer.value) {
    $props.model.app.actions.updateLayer(currentLayer.value.id, {
      visible: !currentLayer.value.visible
    });
  }
}

async function onClickRemoveLayer() {
  if (
    $props.model.app.state.currentLayerId &&
    (await $props.core.executeCommand(
      `openDialog "${t('context_menu.general.items.workingMode.text')}" --confirm`
    ))
  ) {
    await $props.model.app.actions.removeLayer(
      $props.model.app.state.currentLayerId
    );
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-layer-overview {
  --color-background: var(
    --color-disks-web-paint-layer-overivew-background,
    #000
  );
  --color-border: var(--color-disks-web-paint-layer-overivew-border, #000);
  --color-button-foreground: var(
    --color-disks-web-paint-layer-overview-button-foreground,
    #fff
  );
  --color-button-hover-foreground: var(
    --color-disks-web-paint-layer-overview-button-hover-foreground,
    #ccc
  );

  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  border-right: 4px solid var(--color-border);

  & .info {
    font-size: 9px;
  }

  & > div {
    padding: var(--default-element-margin);
  }

  & > div + div {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    overflow: auto;
  }

  & .controls {
    display: flex;
    gap: calc(var(--default-element-margin) * 4);
    justify-content: center;
    margin-top: var(--default-element-margin);

    & button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      color: var(--color-button-foreground);
      appearance: none;
      background: none;
      border: none;

      & svg {
        & :deep(path) {
          fill: currentColor;
        }
      }

      &[disabled] {
        opacity: 0.3;
      }

      &:hover {
        color: var(--color-button-hover-foreground);
      }
    }
  }
}
</style>
