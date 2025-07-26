<template>
  <div class="wb-disks-extras13-web-paint-view-menu">
    <ul class="controls">
      <li v-for="container in containers" :key="container.id">
        <view-menu-item
          :id="container.id"
          v-model="currentContainerId"
          :menu-id="id"
          :label="container.label" />
      </li>
    </ul>
    <div>
      <div class="containers">
        <slot></slot>
      </div>
      <div class="foot">
        <slot name="foot" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useId } from 'vue';
import ViewMenuItem from '../elements/ViewMenuItem.vue';

const id = useId();

const containers = ref([]);

provide('registerContainer', (value: { id: string; label?: string }) => {
  if (containers.value.length < 1) {
    currentContainerId.value = value.id;
  }
  containers.value = [...containers.value, value];
});
provide('unregisterContainer', (id: string) => {
  containers.value = containers.value.filter(c => c.id !== id);
});

const currentContainerId = ref<string | null>(null);
provide('currentContainerId', currentContainerId);
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-view-menu {
  --color-background: var(--color-view-menu-background, #05a);
  --color-controls-background: var(--color-view-menu-controls-background, #fff);

  .style-filled & {
    --color-background: var(
      --color-view-menu-filled-background,
      var(--color-view-menu-background)
    );
    --color-foreground: var(
      --color-view-menu-filled-foreground,
      var(--color-view-menu-foreground)
    );
    --color-controls-background: var(
      --color-view-menu-filled-controls-background,
      var(--color-view-menu-controls-background)
    );
  }

  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2px;
  color: var(--color-foreground);
  background: var(--color-background);

  & > * {
    padding: var(--default-element-margin);
  }

  & .controls {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    background: var(--color-controls-background);
  }

  & ul {
    padding: 0;
    margin: 0;
  }

  & ul + div {
    display: flex;
    flex-direction: column;
    gap: var(--default-element-margin);
    height: 100%;

    & .containers {
      flex: 1;
    }
  }
}
</style>
